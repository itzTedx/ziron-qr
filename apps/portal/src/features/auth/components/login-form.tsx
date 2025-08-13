"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { PasswordInput } from "@/components/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@ziron/auth/client";
import { Button } from "@ziron/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@ziron/ui/components/form";
import { Input } from "@ziron/ui/components/input";
import { LoadingSwap } from "@ziron/ui/components/loading-swap";
import { loginUserSchema, LoginUserType } from "@ziron/validators";

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
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in...");
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
            if (ctx.error.status === 403) {
              toast.info("Please verify your email address");
            }
            console.error(ctx.error);
          },
        },
      });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-9">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@mail.com"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <Button>hello</Button> */}

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
            type="submit"
            className="from-primary to-brand-secondary relative inline-block w-full cursor-pointer rounded-md bg-white bg-gradient-to-bl px-4 py-2 text-center text-sm font-bold text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] transition duration-200"
            disabled={isPending}
          >
            <LoadingSwap isLoading={isPending}>Login</LoadingSwap>
          </Button>
        </div>
      </form>
    </Form>
  );
}
