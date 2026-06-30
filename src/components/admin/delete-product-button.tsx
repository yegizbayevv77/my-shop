// src/components/admin/delete-product-button.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2Icon, Loader2Icon } from "lucide-react";

import { deleteProduct } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteProduct(id);
      if (res.ok) {
        toast.success(`Deleted "${name}"`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Delete failed");
        setConfirming(false);
      }
    });
  }

  if (confirming) {
    return (
      <div className="flex gap-1">
        <Button size="sm" variant="destructive" onClick={handleDelete} disabled={isPending}>
          {isPending && <Loader2Icon className="size-3.5 animate-spin" />}
          Confirm
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      className="text-muted-foreground"
      onClick={() => setConfirming(true)}
      aria-label="Delete"
    >
      <Trash2Icon className="size-4" />
    </Button>
  );
}
