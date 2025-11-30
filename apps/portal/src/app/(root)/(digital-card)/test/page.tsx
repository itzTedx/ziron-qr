import Link from "next/link";

import { Logo } from "@ziron/ui/assets/logo";

import { cn } from "@ziron/utils";

import { BrowserGraphic } from "./_components/browser-graphic";
import { BubbleIcon } from "./_components/bubble-icon";
import { CTA } from "./_components/cta";
import { Hero } from "./_components/hero";

const domain = "https://ziron.com";

export default function TestPage() {
  return (
    <div>
      <Hero>
        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center">
          <BubbleIcon>
            <Logo className="size-10" />
          </BubbleIcon>
          <div className="mt-16 w-full">
            <BrowserGraphic domain={domain} />
          </div>
          <h1
            className={cn(
              "mt-2 text-center font-display font-medium text-4xl text-neutral-900 sm:text-5xl sm:leading-[1.15]",
              "animation-duration-[1s] animate-slide-up-fade fill-mode-[both] [--offset:20px] motion-reduce:animate-fade-in"
            )}
          >
            Welcome to Dub
          </h1>
          <p
            className={cn(
              "mt-5 text-balance text-base text-neutral-700 sm:text-xl",
              "animation-duration-[1s] animate-slide-up-fade fill-mode-[both] [--offset:10px] [animation-delay:200ms] motion-reduce:animate-fade-in"
            )}
          >
            This custom domain is powered by Dub &ndash; the link management platform designed for modern marketing
            teams.
          </p>
        </div>

        <div
          className={cn(
            "relative mx-auto mt-8 flex max-w-fit xs:flex-row flex-col items-center gap-4",
            "animation-duration-[1s] animate-slide-up-fade fill-mode-[both] [--offset:5px] [animation-delay:300ms] motion-reduce:animate-fade-in"
          )}
        >
          <Link href="https://app.dub.co/register">Try Dub today</Link>
        </div>
      </Hero>

      <div className="mt-32">
        <CTA />
      </div>
    </div>
  );
}
