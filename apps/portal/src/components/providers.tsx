"use client";

import { useState } from "react";

import { ProgressProvider } from "@bprogress/next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@ziron/ui/components/sonner";
import { KeyboardShortcutProvider } from "@ziron/ui/hooks";

import { createQueryClient } from "@/lib/orpc/query/client";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());
  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableColorScheme enableSystem>
      <KeyboardShortcutProvider>
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
            <ProgressProvider color="#962DFF" height="3px" memo options={{ showSpinner: false }} shallowRouting>
              {children}
            </ProgressProvider>
            <Toaster position="bottom-center" richColors />
          </NuqsAdapter>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </KeyboardShortcutProvider>
    </ThemeProvider>
  );
}
