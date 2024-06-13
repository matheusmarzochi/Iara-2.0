import { MessageSquareTextIcon } from "lucide-react";

export default function HomePage() {
  return (
    <section className="grid h-[calc(100dvh-80px)] w-full place-items-center">
      <span className="inline-flex w-fit flex-col items-center gap-2 font-mono text-sm font-semibold">
        <MessageSquareTextIcon className="size-4 text-green-900" /> iara
      </span>
    </section>
  );
}
