import { eq } from "iara-shared/node_modules/drizzle-orm";
import { db } from "iara-shared/database"
import { analysis, type Form, Question } from "iara-shared/database/schema"
import { promptRequest, stringToJson } from "../integration/prompt"
import { filterAnswersBySequence, filterQuestionsBySequence } from "./helper"

function groupAnswersByScore(forms: Form[], sequence: number) {
    const fit: Form["answers"] = [];
    const regular: Form["answers"] = [];
    const unfit: Form["answers"] = [];
    forms.forEach(form => {
        form.answers
            .filter(answer => answer.sequence === sequence)
            .forEach(answer => {
                if (answer.score === 5 || answer.score === 4) fit.push(answer);
                else if (answer.score === 3 || answer.score === 2) regular.push(answer);
                else if (answer.score === 1 || answer.score === 0) unfit.push(answer);
            });
    });
    return { fit, regular, unfit };
}

export const prompt = (question: Question, forms: Form[], criteria: string) => {
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
    prompt += `Analise as respostas e utilize o critério: ${criteria}.\n`;
    prompt += "Depois, sugira uma ação clara e objetiva para a pergunta.\n";
    prompt += "Responda no formato JSON:\n";
    prompt += `{"criteria": "${criteria}", "action": "AÇÃO SUGERIDA"}\n`;
    return prompt;
}

type PromptValidation = {
    ok: boolean
    data: { criteria: string, action: string } | null
}

export const promptValidation = (output: any): PromptValidation => {
    if (
        typeof output !== "object" ||
        !output ||
        typeof output.criteria !== "string" ||
        typeof output.action !== "string"
    ) {
        return { ok: false, data: null }
    }

    const validCriteria = ["PIVOT", "IMPROVE", "MAINTAIN", "ABANDON", "FOCUS", "RETHINK"];
    if (!validCriteria.includes(output.criteria)) {
        return { ok: false, data: null }
    }
    return { ok: true, data: { criteria: output.criteria, action: output.action } }
}


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

    for (const question of questions) {
        if (!question.categories || question.categories.length === 0) continue;

        for (const category of question.categories) {
            let attempt = 0;
            let isValid = false;

            await db.delete(analysis).where(eq(analysis.categoryId, category.id))

            const { fit, regular, unfit } = groupAnswersByScore(forms, question.sequence);

            let criteriaList: string[] = [];
            if (fit.length >= regular.length && fit.length >= unfit.length) {
                criteriaList = ["MAINTAIN", "RETHINK"];
            } else if (regular.length > fit.length && regular.length >= unfit.length) {
                criteriaList = ["IMPROVE", "FOCUS"];
            } else {
                criteriaList = ["PIVOT", "ABANDON"];
            }

            for (const criteria of criteriaList) {
                attempt = 0;
                isValid = false;
                while (attempt < 3 && !isValid) {
                    const promptInput = prompt(
                        filterQuestionsBySequence([question], question.sequence)[0],
                        filterAnswersBySequence(forms, question.sequence),
                        criteria
                    );

                    const output = await promptRequest(promptInput, "analysis", category.id + "-" + criteria);
                    const { object } = stringToJson(output);

                    const { ok, data } = promptValidation(object);
                    isValid = ok

                    if (!isValid) {
                        attempt++;
                        if (attempt >= 3) {
                            console.error(`Validation failed after ${attempt} attempts for category ID ${category.id} and criteria ${criteria}`);
                        }
                        continue
                    }

                    if (data) {
                        await db.insert(analysis).values({
                            categoryId: category.id,
                            criteria: data.criteria as "PIVOT" | "IMPROVE" | "MAINTAIN" | "ABANDON" | "FOCUS" | "RETHINK",
                            action: data.action,
                        })
                    }
                }
            }
        }
    }
}
