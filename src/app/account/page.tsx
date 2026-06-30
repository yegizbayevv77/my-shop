// src/app/account/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { PackageIcon, ShieldIcon } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My account</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Name: </span>
            {user?.name || "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Email: </span>
            {user?.email}
          </p>
          <p>
            <span className="text-muted-foreground">Role: </span>
            {user?.role}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/account/orders">
            <PackageIcon className="size-4" /> My orders
          </Link>
        </Button>
        {user?.role === "ADMIN" && (
          <Button asChild>
            <Link href="/admin">
              <ShieldIcon className="size-4" /> Admin panel
            </Link>
          </Button>
        )}
      </div>
    </main>
  );
}
