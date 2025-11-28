"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { APIError } from "better-auth";
import { toast } from "sonner";

import { Button } from "@ziron/ui/components/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm } from "@ziron/ui/components/form";
import { Input } from "@ziron/ui/components/input";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";

import { LoginUserType, loginUserSchema, zodResolver } from "@ziron/validators";

import { PasswordInput } from "@/components/ui/password-input";

import { authClient } from "@/lib/auth/client";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginUserType>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginUserType) {
    startTransition(async () => {
      try {
        await authClient.signIn.email({
          email: values.email,
          password: values.password,
          callbackURL: "/",
          fetchOptions: {
            onSuccess: (data) => {
              toast.success("Signed in...");
              router.push("/");
              console.log("Success login:", data);
            },
            onError: (ctx) => {
              const { error } = ctx;
              const status = error.status;
              const message = error.message;

              // Handle specific status codes
              switch (status) {
                case 400:
                  toast.error("Invalid request. Please check your email and password.");
                  break;
                case 401:
                  toast.error("Invalid email or password. Please try again.");
                  break;
                case 403:
                  toast.error("Access denied.", {
                    description: "Please verify your email address",
                  });
                  break;
                case 404:
                  toast.error("Account not found. Please check your email or sign up.");
                  break;
                case 429:
                  toast.error("Too many login attempts. Please try again later.");
                  break;
                case 500:
                  toast.error("Server error. Please try again later.");
                  break;
                case 503:
                  toast.error("Service temporarily unavailable. Please try again later.");
                  break;
                default:
                  // Use the error message if available, otherwise show a generic message
                  toast.error(message || "An unexpected error occurred. Please try again.");
              }

              console.error("Login error:", error);
            },
          },
        });
      } catch (error) {
        if (error instanceof APIError) {
          console.log(error.message, error.status);
        }
        console.error("Login error:", error);
      }
    });
  }

  return (
    <Form {...form}>
      <form className="mt-9" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input id="email" placeholder="name@mail.com" required type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="relative inline-block w-full cursor-pointer rounded-md bg-linear-0-to-bl bg-white from-primary to-brand-secondary px-4 py-2 text-center font-bold text-sm text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] transition duration-200"
            disabled={isPending}
            type="submit"
          >
            <LoadingSwap isLoading={isPending}>Login</LoadingSwap>
          </Button>
        </div>
      </form>
    </Form>
  );
}
