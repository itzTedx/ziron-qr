import { DigitalCardSidebar } from "./_components/sidebar";

interface Props {
  children: React.ReactNode;
}

export default function DigitalCardLayout({ children }: Props) {
  return (
    <>
      <DigitalCardSidebar />

      <div className="h-screen md:pt-2 md:pr-2 md:pb-2">
        <main className="h-full overflow-hidden bg-stone-50/80 backdrop-blur-xl sm:rounded-xl dark:bg-stone-950">
          {children}
        </main>
      </div>
    </>
  );
}
