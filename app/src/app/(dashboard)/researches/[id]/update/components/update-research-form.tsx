"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { schema } from "../../../new/schemas";
import type { z } from "zod";
import { useServerAction } from "zsa-react";
import { StatusButton } from "~/components/status-button";
import { toast } from "sonner";
import { Checkbox } from "~/components/ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { cn } from "~/lib/utils";
import type { Question, Research } from "iara-shared/database/schema";
import { updateSchema } from "../schema";
import { updateResearchAction } from "../action";
import { ConfirmDialog } from "./modal";
import { useState } from "react";

type Schema = z.infer<typeof updateSchema>;

type Props = {
  research: Pick<Research, "id" | "title" | "description"> & {
    questions: Array<Pick<Question, "id" | "purpose" | "required">>;
  };
};

export function UpdateResearchForm({ research }: Props) {
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const { execute, isPending } = useServerAction(updateResearchAction, {
    onSuccess: () => {
      toast.success("Pesquisa atualizada.", {
        description: "Pesquisa atualizada com sucesso!",
      });
    },
    onError: (error) => {
      toast.error("Erro", {
        description:
          "Houve um erro ao tentar atualizar sua pesquisa, por favor tente novamente.",
      });
    },
  });

  const form = useForm<Schema>({
    defaultValues: {
      id: research.id,
      title: research.title,
      description: research.description,
      purposes: research.questions,
    },
    mode: "onChange",
    resolver: zodResolver(updateSchema),
  });

  const { fields } = useFieldArray<Schema>({
    control: form.control,
    name: "purposes",
  });

  const submit = () => {
    const values = form.getValues();
    execute(values);
  };

  return (
    <Form {...form}>
      <form
        id="update-research"
        className="flex flex-col gap-6 min-h-[calc(100dvh-250px)]"
        onSubmit={form.handleSubmit(submit)}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1 lg:max-w-[345px]">
                <FormLabel>* Título</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Digite o título do formulário"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>* Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-none lg:max-h-10 min-h-10"
                    placeholder="Digite a descrição do formulário"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <div>
            {fields.map((field, index) => (
              <div key={field.id} className="py-3 space-y-4">
                <FormField
                  control={form.control}
                  name={`purposes.${index}.purpose`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>* Propósito {index + 1}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="resize-none"
                          placeholder="Porque você escolheu nosso produto ou serviço?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3 md:flex-row items-start md:items-center justify-between">
                  <FormField
                    control={form.control}
                    name={`purposes.${index}.required`}
                    render={({ field }) => (
                      <FormItem className="flex gap-2 items-start md:items-center space-y-0">
                        <FormControl>
                          <Checkbox
                            id={field.name}
                            checked={field.value as CheckedState}
                            onCheckedChange={field.onChange}
                            aria-readonly={index === 0}
                            className={cn("mt-0.5 md:mt-0", {
                              "pointer-events-none": index === 0,
                            })}
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={field.name}
                          className={cn("text-sm font-normal", {
                            "pointer-events-none": index === 0,
                          })}
                        >
                          Preenchendo essa opção, este propósito ficará
                          obrigatório para ser respondido.
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="w-full mt-auto md:py-0 flex flex-col md:flex-row items-center justify-between gap-4">
          <Button
            size="sm"
            className="order-2 md:order-1 w-full md:w-fit"
            variant="outline"
            tabIndex={-1}
            asChild
          >
            <Link href={`/researches/${research.id}`}>Voltar</Link>
          </Button>

          <Button
            size="sm"
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="w-full md:w-fit lg:w-[120px] order-1 md:order-2"
          >
            Editar Pesquisa
          </Button>
        </footer>
      </form>

      <ConfirmDialog
        isPending={isPending}
        open={isConfirmOpen}
        onOpenChange={setConfirmOpen}
      />
    </Form>
  );
}
