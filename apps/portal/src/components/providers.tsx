"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@ziron/ui/components/sonner";

import { queryClient } from "@/lib/orpc/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableColorScheme enableSystem>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <ProgressProvider color="#962DFF" height="3px" memo options={{ showSpinner: false }} shallowRouting>
            {children}
            <ReactQueryDevtools />
          </ProgressProvider>
          <Toaster closeButton richColors />
        </NuqsAdapter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
