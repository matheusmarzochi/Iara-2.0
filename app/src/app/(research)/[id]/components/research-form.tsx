"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import type { Question } from "~/database/schema";
import { schema } from "../schema";
import { useServerAction } from "zsa-react";
import { replyResearchAction } from "../actions";
import { StatusButton } from "~/components/status-button";
import type { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Schema = z.infer<typeof schema>;

type Props = {
  research: string;
  questions: Array<Question>;
};

export function ResearchForm({ questions, research }: Props) {
  const router = useRouter();

  const { execute, isPending } = useServerAction(replyResearchAction, {
    onSuccess: () => {
      toast.success("Obrigado", {
        description:
          "Sua resposta foi registrada, muito obrigado pela sua resposta.",
      });

      form.reset();
      router.push(`/${research}/obrigado`);
    },
    onError: (error) => {
      toast.error("Ops", {
        description:
          "Não foi possível registrar sua resposta, tente novamente por favor.",
      });
    },
  });

  const form = useForm<Schema>({
    defaultValues: {
      research,
      email: "",
      purposes: [
        {
          explanation: "",
          purpose: "",
          score: "5",
          sequence: 1,
        },
      ],
    },
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  const submit = () => {
    execute(form.getValues());
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
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

        {questions.map((question, index) => (
          <div key={question.id} className="space-y-3">
            <FormField
              control={form.control}
              name={`purposes.${index}.purpose`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* {question.purpose}</FormLabel>
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
              name={`purposes.${index}.score`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* {question.score}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
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
                          3 - Na maior parte. Em geral foi atendido,mas algo
                          ficou faltando.
                        </FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel>
                          2 - Parcialmente. Alguns pontos foram ok, mas uma
                          parte relevante deixou a desejar.
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
                          0 - Nada. Nenhuma das minhas necessidades foi
                          atendida.
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
              name={`purposes.${index}.explanation`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* {question.explanation}</FormLabel>
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
              name={`purposes.${index}.sequence`}
              render={() => (
                <Input
                  className="hidden"
                  defaultValue={question.sequence}
                  readOnly
                />
              )}
            />
          </div>
        ))}

        <div className="flex w-full items-center justify-end">
          <StatusButton className="w-[100px]" size="sm" isPending={isPending}>
            Responder
          </StatusButton>
        </div>
      </form>
    </Form>
  );
}
