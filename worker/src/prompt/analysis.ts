import { eq } from "iara-shared/node_modules/drizzle-orm";
import { db } from "iara-shared/database"
import { analysis, questions, type Form, Question } from "iara-shared/database/schema"
import { promptRequest, stringToJson } from "../integration/prompt"
import { filterAnswersBySequence, filterQuestionsBySequence } from "./helper"

// Gera o prompt para análise de uma pergunta com base nas respostas
export const prompt = (question: Question, forms: Form[]) => {
    let prompt = "Você recebeu uma pesquisa com a seguinte pergunta e lista de respostas.\n";
    prompt += "Seu objetivo é analisar as respostas e sugerir uma ação para a pergunta, escolhendo um critério e uma ação recomendada.\n\n";
    prompt += "Pergunta da pesquisa:\n";
    prompt += `${question.purpose}\n\n`;
    prompt += "Lista de respostas:\n\n";
    forms.forEach((form, index) => {
        form.answers.forEach(answer => {
            prompt += `${index}. ${answer.purpose}\n`
        })
    })
    prompt += "\n";
    prompt += "Instruções:\n";
    prompt += "Analise as respostas e escolha um critério entre: PIVOT, IMPROVE, MAINTAIN, ABANDON, FOCUS, RETHINK.\n";
    prompt += "Depois, sugira uma ação clara e objetiva para a pergunta.\n";
    prompt += "Responda no formato JSON:\n";
    prompt += `{"criteria": "CRITÉRIO", "action": "AÇÃO SUGERIDA"}\n`;
    return prompt;
}

type PromptValidation = {
    ok: boolean
    data: { criteria: string, action: string } | null
}

// Valida se a saída do modelo está no formato esperado
export const promptValidation = (output: any): PromptValidation => {
    if (
        typeof output !== "object" ||
        !output ||
        typeof output.criteria !== "string" ||
        typeof output.action !== "string"
    ) {
        return { ok: false, data: null }
    }
    // Critérios válidos
    const validCriteria = ["PIVOT", "IMPROVE", "MAINTAIN", "ABANDON", "FOCUS", "RETHINK"];
    if (!validCriteria.includes(output.criteria)) {
        return { ok: false, data: null }
    }
    return { ok: true, data: { criteria: output.criteria, action: output.action } }
}

// Executa a análise para todas as perguntas de uma pesquisa e salva no banco
export const getAnalysis = async (researchId: string) => {
    const questions = await db.query.questions.findMany({
        where: (questions, { eq }) => (eq(questions.researchId, researchId)),
        with: {
            categories: true,
        },
    }) as Question[]

    if (questions.length == 0) {
        console.log(`getAnalysis: No Questions for Research ID ${researchId}`)
        return
    }

    const forms = (await db.query.forms.findMany({
        where: (forms, { eq }) => (eq(forms.researchId, researchId)),
        with: {
            answers: true
        },
    })) as Form[]

    if (forms.length == 0) {
        console.log(`getAnalysis: No Forms for Research ID ${researchId}`)
        return
    }

    for await (const question of questions) {
        let attempt = 0;
        let isValid = false;

        // Remove análises anteriores para a pergunta
        await db.delete(analysis).where(eq(analysis.questionId, question.id))

        while (attempt < 3 && !isValid) {
            const promptInput = prompt(
                filterQuestionsBySequence(questions, question.sequence)[0],
                filterAnswersBySequence(forms, question.sequence)
            );

            const output = await promptRequest(promptInput, "analysis", question.id);
            const { object } = stringToJson(output);

            const { ok, data } = promptValidation(object);
            isValid = ok

            if (!isValid) {
                attempt++;
                if (attempt >= 3) {
                    console.error(`Validation failed after ${attempt} attempts for question ID ${question.id}`);
                }
                continue
            }

            if (data) {
                await db.insert(analysis).values({
                    questionId: question.id,
                    criteria: data.criteria as "PIVOT" | "IMPROVE" | "MAINTAIN" | "ABANDON" | "FOCUS" | "RETHINK",
                    action: data.action,
                })
            }
        }
    }
}
