"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";

type Props = {
  research: string;
};

export function CopyLinkForm({ research }: Props) {
  const { copied, copy } = useCopyToClipboard();
  const researchUrl = `https://iara.one/${research}`;

  return (
    <div className="py-4 space-y-2">
      <Label className="text-sm">Link de compartilhamento</Label>
      <div className="flex gap-3">
        <Input value={researchUrl} className="lg:w-52" readOnly />

        <Button className="w-[100px]" onClick={() => copy(researchUrl)}>
          {copied ? "Copiado!" : "Copiar"}
        </Button>
      </div>
    </div>
  );
}
