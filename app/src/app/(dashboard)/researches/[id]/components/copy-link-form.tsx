"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { Research } from "iara-shared/database/schema";
import { ClipboardCopy, QrCodeIcon } from "lucide-react";
import { env } from "~/env";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";
import Link from "next/link";

type Props = {
  research: string;
  status: Research["status"];
};

export function CopyLinkForm({ research, status }: Props) {
  const { copied, copy } = useCopyToClipboard();
  const researchUrl = `${env.NEXT_PUBLIC_APP_URL}/${research}`;
  const qrCodeUrl = `${env.NEXT_PUBLIC_APP_URL}/${research}/share`;

  return (
    <div className="py-4 space-y-2">
      <Label className="text-sm">Link de compartilhamento</Label>
      <div className="flex gap-3">
        <Input
          onClick={() => copy(researchUrl)}
          value={researchUrl} readOnly
        />

        <Button
          className="w-[120px]"
          onClick={() => copy(researchUrl)}
          disabled={status !== "CREATED" && status !== "OPENED"}
        >
          <ClipboardCopy className="size-4 mr-2" />
          {copied ? "Copiado!" : "Copiar"}
        </Button>
        <Link href={qrCodeUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="flex items-center gap-2">
            <QrCodeIcon className="size-4" />
            <span>QR Code</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
