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
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { schema } from "../schemas";
import type { z } from "zod";
import { useServerAction } from "zsa-react";
import { createResearchAction } from "../actions";

type Schema = z.infer<typeof schema>;

/** @todo criar um botão que indique quando estamos em estado de loading  */
/** @todo criar preview do formulário */
/** @todo mover os actions para server actions assim não precisamos do javascript */
/** @todo adicionar validação de form para caso a internet do usuário esteja lenda */
export function CreateResearchForm() {
  const { execute, isPending } = useServerAction(createResearchAction, {
    onSuccess: () => {
      // @todo nós podemos fazer algo aqui quando for sucesso
    },
    onError: () => {
      // @todo ou podemos lidar com o erro aqui
    },
  });

  const form = useForm<Schema>({
    defaultValues: {
      title: "",
      description: "",
      purposes: [
        {
          purpose: "",
          score: "",
          explanation: "",
        },
      ],
    },
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray<Schema>({
    control: form.control,
    name: "purposes",
  });

  const submit = () => {
    execute(form.getValues());
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o título do formulário" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none"
                  placeholder="Digite a descrição do formulário"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <h3 className="text-2xl font-semibold">Propósitos</h3>

          <div>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border-b py-10 last:border-b-0 space-y-4"
              >
                {index > 0 ? (
                  <div className="py-2">
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      Remover este propósito
                    </Button>
                  </div>
                ) : null}

                <FormField
                  control={form.control}
                  name={`purposes.${index}.purpose`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Questão de Propósito</FormLabel>
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

                <FormField
                  control={form.control}
                  name={`purposes.${index}.score`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Questão de Avaliação</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="resize-none"
                          placeholder="Porque você escolheu nosso produto ou serviço?"
                        />
                      </FormControl>
                      <FormMessage />

                      <RadioGroup>
                        <div className="flex items-start md:items-center gap-2">
                          <RadioGroupItem value="" aria-readonly disabled />
                          <Label>
                            5 - Extremamante. Recebi tudo que esperava e mais um
                            pouico.
                          </Label>
                        </div>

                        <div className="flex items-start md:items-center gap-2">
                          <RadioGroupItem value="" aria-readonly disabled />
                          <Label>
                            4 - Plenamente. Tudo que eu precisava foi atendido.
                          </Label>
                        </div>

                        <div className="flex items-start md:items-center gap-2">
                          <RadioGroupItem value="" aria-readonly disabled />
                          <Label>
                            3 - Na maior parte. Em geral foi atendido,mas algo
                            ficou faltando.
                          </Label>
                        </div>

                        <div className="flex items-start md:items-center gap-2">
                          <RadioGroupItem value="" aria-readonly disabled />
                          <Label>
                            2 - Parcialmente. Alguns pontos foram ok, mas uma
                            parte relevante deixou a desejar.
                          </Label>
                        </div>

                        <div className="flex items-start md:items-center gap-2">
                          <RadioGroupItem value="" aria-readonly disabled />
                          <Label>
                            1 - Um pouco. Houve itens positivos, mas a real
                            necessidade não foi atendida.
                          </Label>
                        </div>

                        <div className="flex items-start md:items-center gap-2">
                          <RadioGroupItem value="" aria-readonly disabled />
                          <Label>
                            0 - Nada. Nenhuma das minhas necessidades foi
                            atendida.
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`purposes.${index}.explanation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Questão de Avaliação</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="resize-none"
                          placeholder="Detalhe sua resposta ao item 2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                append({ explanation: "", purpose: "", score: "" })
              }
            >
              Adicionar Propósito
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center [&>*]:w-full">
          <Button size="sm" variant="outline" type="button" asChild>
            <Link href="/dashboard">Voltar</Link>
          </Button>

          <Button size="sm">Criar Pesquisa</Button>
        </div>
      </form>
    </Form>
  );
}
