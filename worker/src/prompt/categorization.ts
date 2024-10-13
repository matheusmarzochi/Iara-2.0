import { db } from "../database"
import { gpt, stringToJson } from "../integration/gpt"
import { categories } from "../database/schema/category"
import { Form } from "../database/schema/form"
import { Question, questions } from "../database/schema/question"
import { filterAnswersBySequence, filterQuestionsBySequence } from "./helper"

export const prompt = (question: Question, forms: Form[], categories: number) => {
    let prompt = "Você recebeu uma pesquisa com a seguinte pergunta e lista de respostas. "
    prompt += "Seu objetivo é agrupar as respostas em categorias distintas e descritivas.\n\n"

    prompt += "Pergunta da pesquisa:\n"
    prompt += `${question.purpose}\n\n`

    prompt += "Lista de respostas:\n\n"

    forms.forEach((form, index) => {
        form.answers.forEach(answer => {
            prompt += `${index}. ${answer.purpose}\n`
        })
    })

    prompt += "\n"

    prompt += "Instruções:\n"
    prompt += "Analise a lista de respostas e agrupe-as em categorias. "
    prompt += "Cada categoria deve conter no máximo duas palavras e deve conter grupo de atividades semelhantes. "
    prompt += `Liste apenas as ${categories} categorias no formato JSON.\n`
    prompt += "['categoria 1', ...]"

    return prompt
}

type PromptValidation = {
    ok: boolean
    data: string[]
}

export const promptValidation = (output: any, size: number): PromptValidation => {
    if (!Array.isArray(output)) {
        return { ok: false, data: [] }
    }

    if (output.length !== size) {
        return { ok: false, data: [] }
    }

    for (let item of output) {
        if (typeof item !== 'string') {
            return { ok: false, data: [] }
        }
    }

    return { ok: true, data: output }
}

export const getCategories = async (researchId: string) => {
    const research = await db.query.researches.findFirst({
        where: (researches, { eq }) => (eq(researches.id, researchId)),
    })

    if (!research) {
        console.log(`getCategories: Research ID not found ${researchId}`)
        return
    }

    const questions = await db.query.questions.findMany({
        where: (questions, { eq }) => (eq(questions.researchId, researchId)),
        with: {
            categories: true,
        },
    })

    if (questions.length == 0) {
        console.log(`getCategories: No Questions for Research ID ${researchId}`)
        return
    }
    
    const forms = await db.query.forms.findMany({
        where: (forms, { eq }) => (eq(forms.researchId, researchId)),
        with: {
            answers: true
        },
    })

    if (forms.length == 0) {
        console.log(`getCategories: No Forms for Research ID ${researchId}`)
        return
    }

    const quantity = 5

    for await (const question of questions) {
        let attempt = 0;
        let isValid = false;

        while (attempt < 3 && !isValid) {
            const promptInput = prompt(
                filterQuestionsBySequence(questions, question.sequence)[0],
                filterAnswersBySequence(forms, question.sequence),
                quantity
            );
            
            const output = await gpt(promptInput, "question", question.id);
            const { object } = stringToJson(output);

            const { ok, data } = promptValidation(object, quantity);
            isValid = ok
            
            if (!isValid) {
                attempt++;
                if (attempt >= 3) {
                    console.error(`Validation failed after ${attempt} attempts for question ID ${question.id}`);
                }

                continue
            }

            // TODO: Use Create or Update (if already exists)
            await db
                .insert(categories)
                .values(data.map(d => ({
                    name: d,
                    questionId: question.id,
                }))
            )
        }
    }
}
