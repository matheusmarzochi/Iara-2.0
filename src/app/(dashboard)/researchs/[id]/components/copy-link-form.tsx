"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

// @todo adicionar hook para copiar o link
export function CopyLinkForm() {
  return (
    <div className="py-4 space-y-2">
      <Label className="text-sm">Link de compartilhamento</Label>
      <div className="flex gap-3">
        <Input value="https://iara.one/ABC123" className="lg:w-52" readOnly />
        <Button className="w-fit">Copiar</Button>
      </div>
    </div>
  );
}
