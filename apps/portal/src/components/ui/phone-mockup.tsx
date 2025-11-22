import { cn } from "@ziron/utils";

export default function PhoneMockup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto h-full w-[290px] rounded-[2.5rem] border-[10px] border-gray-900 bg-gray-900 shadow-xl dark:border-gray-100 dark:bg-gray-100",
        className
      )}
    >
      <div className="-translate-x-1/2 absolute top-1.5 left-1/2 z-40 flex h-[1.5rem] w-[80px] items-center justify-end rounded-full bg-gray-900 px-2 dark:bg-gray-100">
        <div className="size-3 rounded-full border-2 border-gray-600 bg-gray-900 dark:border-gray-300 dark:bg-gray-200" />
      </div>
      <div className="-start-[13px] absolute top-[124px] z-40 h-[46px] w-[3px] rounded-s-lg bg-gray-900 dark:bg-gray-100" />
      <div className="-start-[13px] absolute top-[178px] z-40 h-[46px] w-[3px] rounded-s-lg bg-gray-900 dark:bg-gray-100" />
      <div className="-end-[13px] absolute top-[142px] z-40 h-[64px] w-[3px] rounded-e-lg bg-gray-900 dark:bg-gray-100" />
      <div className="@container h-[572px] w-[272px] overflow-hidden rounded-[2rem] bg-background">{children}</div>
    </div>
  );
}
