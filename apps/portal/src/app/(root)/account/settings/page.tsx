import Header from "@/components/layout/header";

import SettingsProfile from "@/features/auth/components/settings-profile";

export default function SettingsPage() {
  return (
    <div>
      <Header title="Settings" />

      <div className="p-6">
        <button className="group h-8 select-none rounded-lg bg-white px-3 text-sm text-zinc-950 leading-8 shadow-[0_-1px_0_0px_#d4d4d8_inset,0_0_0_1px_#f4f4f5_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-50 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
          <span className="group-active:transform-[translate3d(0,1px,0)] block">Click me</span>
        </button>
        ;
        <SettingsProfile />
      </div>
    </div>
  );
}
