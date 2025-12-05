"use client";

import { ComponentProps, useState } from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Input } from "@ziron/ui/components/input";

import { cn } from "@ziron/utils";

export function PasswordInput({ id = "password", className, ...props }: ComponentProps<typeof Input>) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="relative">
      <Input className={cn("pe-9", className)} type={isVisible ? "text" : "password"} {...props} />
      <button
        aria-controls={id}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        onClick={toggleVisibility}
        type="button"
      >
        {isVisible ? <EyeOffIcon aria-hidden="true" size={16} /> : <EyeIcon aria-hidden="true" size={16} />}
      </button>
    </div>
  );
}
