import { SettingsSidebar } from "./_components/settings-sidebar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SettingsSidebar />

      <div className="h-screen md:pt-2 md:pr-2 md:pb-2">
        <main className="h-full overflow-hidden bg-stone-50/80 sm:rounded-xl dark:bg-stone-950">{children}</main>
      </div>
    </>
  );
}
