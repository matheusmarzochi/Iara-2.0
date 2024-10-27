"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { Research } from "iara-shared/database/schema";
import { env } from "~/env";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";

type Props = {
  research: string;
  status: Research["status"];
};

export function CopyLinkForm({ research, status }: Props) {
  const { copied, copy } = useCopyToClipboard();
  const researchUrl = `${env.NEXT_PUBLIC_APP_URL}/${research}`;

  return (
    <div className="py-4 space-y-2">
      <Label className="text-sm">Link de compartilhamento</Label>
      <div className="flex gap-3">
        <Input value={researchUrl} className="lg:w-52" readOnly />

        <Button
          className="w-[100px]"
          onClick={() => copy(researchUrl)}
          disabled={status !== "CREATED"}
        >
          {copied ? "Copiado!" : "Copiar"}
        </Button>
      </div>
    </div>
  );
}
