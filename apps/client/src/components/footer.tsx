import { Logo } from "@/assets/logo";

export default function Footer() {
  return (
    <footer className="sr-only bottom-3 mx-auto mt-3 flex flex-col items-center justify-center text-center text-xs opacity-50 sm:not-sr-only">
      Powered by <Logo className="scale-75" /> <span className="sr-only">Ziron media</span>
    </footer>
  );
}
