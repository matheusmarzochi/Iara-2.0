"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido"),
});

type Schema = z.infer<typeof schema>;

export function ResearchForm() {
  const form = useForm<Schema>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>*Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Seu e-mail é confidencial e não será compartilhado com
                terceiros.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          // @ts-expect-error
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                * Porque você escolheu nosso produto ou serviço?
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none"
                  placeholder="Digite sua reposta"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          // @ts-expect-error
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                * Quanto o produto ou serviço atendeu ao seu propósito? Escolha
                apenas uma das opções (obrigatório)
              </FormLabel>
              <FormControl>
                <RadioGroup>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="5" />
                    </FormControl>
                    <FormLabel>
                      5 - Extremamante. Recebi tudo que esperava e mais um
                      pouico.
                    </FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="4" />
                    </FormControl>
                    <FormLabel>
                      4 - Plenamente. Tudo que eu precisava foi atendido.
                    </FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="3" />
                    </FormControl>
                    <FormLabel>
                      3 - Na maior parte. Em geral foi atendido,mas algo ficou
                      faltando.
                    </FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                    <FormLabel>
                      2 - Parcialmente. Alguns pontos foram ok, mas uma parte
                      relevante deixou a desejar.
                    </FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    <FormLabel>
                      1 - Um pouco. Houve itens positivos, mas a real
                      necessidade não foi atendida.
                    </FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="0" />
                    </FormControl>
                    <FormLabel>
                      0 - Nada. Nenhuma das minhas necessidades foi atendida.
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          // @ts-expect-error
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>* Explique porque escolheu a opção acima?</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none"
                  placeholder="Digite sua reposta"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full items-center justify-end">
          <Button size="sm">Responder</Button>
        </div>
      </form>
    </Form>
  );
}
