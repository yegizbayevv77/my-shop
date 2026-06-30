// src/app/(auth)/register/page.tsx
import { RegisterForm } from "@/components/auth/register-form";

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <RegisterForm googleEnabled={googleEnabled} />
    </main>
  );
}
