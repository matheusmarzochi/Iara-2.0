import { MessageSquareTextIcon } from "lucide-react";

export default function HomePage() {
  return (
    <section className="grid h-[calc(100dvh-160px)] w-full place-items-center">
      <span className="inline-flex w-fit items-end gap-2 font-mono text-sm font-semibold">
        <MessageSquareTextIcon className="size-4 text-primary" /> iara
      </span>
    </section>
  );
}
