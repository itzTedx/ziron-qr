import { Metadata } from "next";

import { IconLogoMono } from "@ziron/ui/assets/logo";
import { Card, CardContent } from "@ziron/ui/components/card";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login - Ziron QR",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-card">
      <Card className="relative overflow-hidden rounded-xl border shadow-lg sm:mx-auto sm:w-full sm:max-w-md">
        {/* Background effects */}
        <div className="-top-1/2 -translate-y-[10%] absolute inset-x-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]">
          <div className="absolute top-0 right-0 left-0 m-auto h-[200px] w-[200px] rounded-full bg-brand-secondary opacity-40 blur-[100px] dark:opacity-20" />
        </div>

        <CardContent className="z-10 px-10 py-12">
          {/* Logo */}
          <div className="mx-auto grid size-14 place-content-center rounded-full border-background border-t bg-linear-to-tr bg-size-[120%_120%] from-primary to-brand-secondary shadow-lg shadow-primary/30 dark:border-foreground/60">
            <IconLogoMono aria-hidden={true} className="size-9 text-white" />
          </div>

          {/* Header */}
          <h3 className="mt-6 text-center font-semibold text-foreground text-lg">Welcome back</h3>
          <p className="text-center text-muted-foreground text-sm">Enter your email to sign in to your account</p>

          {/* Login Form */}
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
