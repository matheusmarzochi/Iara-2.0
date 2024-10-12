"use server";

import { actions } from "~/lib/actions";
import { schema } from "./schemas";

export const createResearchAction = actions
  .createServerAction()
  .input(schema)
  .handler(async ({ input }) => {
    /** @todo adicionar implementação para salvar no banco de dados */
    console.log(input);

    /** @todo pegar o id do usuário do contexto */
    /** @todo criar a pesquisa e recuperar o id */
    /** @todo criar os objetivos com base no id da pesquisa */

    return { status: "success", data: input };
  });
