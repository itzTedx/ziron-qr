import { ThemeToggle } from "../ui/theme-toggle";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export default async function Header({ title, children }: Props) {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between gap-3 border-b px-4 py-2 sm:px-6">
      <h1 className="font-medium text-lg">{title}</h1>
      <div className="flex gap-2 sm:gap-3">
        {children}

        <ThemeToggle />
      </div>
    </header>
  );
}
