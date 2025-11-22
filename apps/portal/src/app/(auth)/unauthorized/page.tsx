import Link from "next/link";

import { ShieldX } from "lucide-react";

import { Button } from "@ziron/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ziron/ui/components/card";

export default function UnauthorizedPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <Card className="relative overflow-hidden sm:mx-auto sm:w-full sm:max-w-md">
          {/* Background effects */}
          <div className="-top-1/2 -translate-y-[10%] absolute inset-x-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]">
            <div className="absolute top-0 right-0 left-0 m-auto h-[310px] w-[310px] rounded-full bg-brand-secondary opacity-20 blur-[100px]" />
          </div>

          <CardContent className="z-10 p-6 px-9">
            {/* Icon */}
            <div className="mx-auto mt-6 grid size-16 place-content-center rounded-full bg-destructive">
              <ShieldX className="size-8 text-destructive-foreground" />
            </div>

            {/* Header */}
            <CardHeader className="px-0 pt-6 pb-4">
              <CardTitle className="text-center text-2xl text-foreground">Access Denied</CardTitle>
              <CardDescription className="text-center">
                You don't have permission to access this resource. Please contact your administrator if you believe this
                is an error.
              </CardDescription>
            </CardHeader>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/login">Go to Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
