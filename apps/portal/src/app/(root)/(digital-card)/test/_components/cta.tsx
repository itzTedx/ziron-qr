import { ReactNode } from "react";

import { Star, StarHalf } from "lucide-react";

import { Button } from "@ziron/ui/components/button";

import { cn } from "@ziron/utils";

import { Grid } from "./grid";

const RATINGS = [
	{
		name: "G2",
		logo: "https://assets.dub.co/companies/g2.svg",
		stars: 5,
		href: "https://www.g2.com/products/dub/reviews",
	},
	{
		name: "Product Hunt",
		logo: "https://assets.dub.co/companies/product-hunt-logo.svg",
		stars: 5,
		href: "https://www.producthunt.com/products/dub",
	},
	{
		name: "Trustpilot",
		logo: "https://assets.dub.co/companies/trustpilot.svg",
		stars: 4.5,
		href: "https://www.trustpilot.com/review/dub.co",
	},
];

export function CTA({
	title = "Supercharge your marketing efforts",
	subtitle = "See why Dub is the link management platform of choice for modern marketing teams.",
	className,
}: {
	title?: ReactNode;
	subtitle?: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative mx-auto mt-12 mb-20 w-full max-w-5xl overflow-hidden rounded-2xl bg-neutral-50 px-6 pt-10 pb-16 text-center sm:mt-0 sm:px-12",
				className
			)}
		>
			<Grid
				cellSize={80}
				className="-translate-x-1/2 mask-[linear-gradient(black_50%,transparent)] inset-[unset] top-0 left-1/2 w-[1200px] text-neutral-200"
				patternOffset={[1, -20]}
			/>
			<div className="-left-1/4 -top-1/2 transform-[translate3d(0,0,0)] absolute h-[135%] w-[150%] opacity-5 blur-[130px]">
				<div className="mask-[radial-gradient(closest-side,black_100%,transparent_100%)] size-full bg-[conic-gradient(from_-66deg,#855AFC_-32deg,#f00_63deg,#EAB308_158deg,#5CFF80_240deg,#855AFC_328deg,#f00_423deg)]" />
			</div>

			<div className="relative mx-auto my-8 flex w-fit gap-8">
				{RATINGS.map(({ href, name, stars }, idx) => (
					<a
						className="group flex flex-col items-center"
						href={href}
						key={`${name}-rating-${idx + 1}`}
						target="_blank"
					>
						{/* <img alt={name} className="size-6 transition-transform duration-150 group-hover:scale-105" src={logo} /> */}
						<div className="mt-4 flex items-center gap-1.5 text-black">
							{[...Array(Math.floor(stars))].map((_, idx) => (
								<Star
									className="size-4 text-amber-500"
									fill="currentColor"
									key={`${name}-stars-${idx + 1}`}
									strokeWidth={0}
								/>
							))}
							{stars % 1 > 0 && (
								<StarHalf className="size-4 text-amber-500" fill="currentColor" strokeWidth={0} />
							)}
						</div>
						<p className="mt-2 text-neutral-500 text-xs">{stars} out of 5</p>
					</a>
				))}
			</div>

			<div className="relative mx-auto mt-1.5 flex w-full max-w-xl flex-col items-center">
				<h2 className="text-balance font-display font-medium text-4xl text-neutral-900 sm:text-[2.5rem] sm:leading-[1.15]">
					{title}
				</h2>
				<p className="mt-5 text-balance text-base text-neutral-500 sm:text-xl">{subtitle}</p>
			</div>

			<div className="relative mx-auto mt-10 flex max-w-fit space-x-4">
				<Button>Start for free</Button>
			</div>
		</div>
	);
}
