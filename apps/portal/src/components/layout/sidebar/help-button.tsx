import { CircleQuestion } from "@/assets/icons/question";

export async function HelpButton() {
  return (
    <a
      className="flex size-11 shrink-0 items-center justify-center rounded-lg text-content-default hover:bg-bg-inverted/5"
      href="https://dub.co/contact/support"
      target="_blank"
    >
      <CircleQuestion className="size-5" strokeWidth={2} />
    </a>
  );
}
