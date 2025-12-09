import { ScrollArea, ScrollBar } from "@ziron/ui/components/scroll-area";

import Header from "@/components/layout/header";

import SettingsProfile from "@/features/auth/components/settings-profile";

export default function SettingsPage() {
	return (
		<>
			<Header title="Settings" />

			<section className="h-full flex-1">
				<ScrollArea className="h-full flex-1 overflow-y-auto pt-2 sm:pt-3">
					<div className="space-y-9 p-6">
						<div className="flex items-center gap-2">
							<button className="group h-8 select-none rounded-lg bg-white px-3 text-sm text-zinc-950 leading-8 shadow-[0_-1px_0_0px_#d4d4d8_inset,0_0_0_1px_#f4f4f5_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-50 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
								<span className="group-active:transform-[translate3d(0,1px,0)] block">Click me</span>
							</button>
							<button className="group h-8 select-none rounded-lg bg-white px-3 text-sm text-zinc-950 leading-8 shadow-[0_-1px_0_0px_#d4d4d8_inset,0_0_0_1px_#f4f4f5_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-50 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
								<span className="group-active:transform-[translate3d(0,1px,0)] block">Click me</span>
							</button>
						</div>
						<SettingsProfile />
					</div>

					{/* https://buttons.ibelick.com/ */}

					<ScrollBar />
				</ScrollArea>
			</section>
		</>
	);
}
