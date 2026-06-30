// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type IncomingItem = { id: string; quantity: number };

export async function POST(req: Request) {
  // 1. Auth guard — only logged-in users can check out
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const incoming: IncomingItem[] = Array.isArray(body?.items) ? body.items : [];

    if (incoming.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. Re-fetch products from DB — never trust client-side prices
    const ids = incoming.map((i) => i.id);
    const products = await prisma.product.findMany({ where: { id: { in: ids } } });

    const lineItems: {
      product: (typeof products)[number];
      quantity: number;
    }[] = [];

    for (const item of incoming) {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.id}` },
          { status: 400 }
        );
      }
      const qty = Math.max(1, Math.floor(item.quantity));
      if (qty > product.stock) {
        return NextResponse.json(
          { error: `Not enough stock for ${product.name}` },
          { status: 400 }
        );
      }
      lineItems.push({ product, quantity: qty });
    }

    // 3. Compute authoritative total
    const totalAmount = lineItems.reduce(
      (sum, li) => sum.add(li.product.price.mul(li.quantity)),
      new Prisma.Decimal(0)
    );

    // 4. Create the order (PENDING) with its items
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        status: "PENDING",
        orderItems: {
          create: lineItems.map((li) => ({
            productId: li.product.id,
            quantity: li.quantity,
            price: li.product.price,
          })),
        },
      },
    });

    // 5. Create the Stripe Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: session.user.email ?? undefined,
      line_items: lineItems.map((li) => ({
        quantity: li.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(Number(li.product.price) * 100),
          product_data: {
            name: li.product.name,
            images: li.product.images.filter((u) => u.startsWith("http")).slice(0, 1),
          },
        },
      })),
      metadata: { orderId: order.id },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
    });

    // 6. Save the Stripe session id on the order
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[CHECKOUT]", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
