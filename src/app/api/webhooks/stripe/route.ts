// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Stripe needs the raw request body to verify the signature,
// so we read it as text (do NOT parse JSON first).
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature/secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[WEBHOOK] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // We only care about completed checkouts
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        await fulfillOrder(orderId);
      } catch (err) {
        console.error("[WEBHOOK] failed to fulfill order:", err);
        return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
      }
    }
  }

  // Always 200 so Stripe stops retrying
  return NextResponse.json({ received: true });
}

async function fulfillOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true },
  });

  // Idempotency: skip if missing or already processed
  if (!order || order.status === "PAID") return;

  await prisma.$transaction([
    // Mark the order as paid
    prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    }),
    // Decrement stock for each purchased item
    ...order.orderItems.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    ),
  ]);

  console.log(`[WEBHOOK] Order ${orderId} marked PAID`);
}
