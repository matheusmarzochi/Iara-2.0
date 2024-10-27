import { db } from "iara-shared/database"
import { promptRequest, stringToJson } from "../integration/prompt"
import { filterQuestionsBySequence } from "./helper"
import { Answer, Question, Form, Category, classifications } from "iara-shared/database/schema"

const MAX_ATTEMPT = 3

export const prompt = (question: Question, answer: Answer) => {
    let prompt = "Você recebeu uma pesquisa com a seguinte pergunta, resposta e categorias.\n"

    prompt += "Pergunta da pesquisa:\n"
    prompt += `${question.purpose}\n\n`

    prompt += "Resposta:\n"
    prompt += `${answer.purpose}\n\n`

    prompt += "Explicação:\n"
    prompt += `${answer.explanation}\n\n`

    prompt += "Categorias:\n"
    question.categories.forEach(category => {
        prompt += `- ${category.name}\n`
    })
    prompt += "\n\n"

    prompt += "Instruções:\n"
    prompt += "Analise a pergunta, resposta e a explicação para definir a afinidade com cada uma das categorias.\n"
    prompt += "Cada afinidade deve estar entre 0 a 100 para cada categoria.\n"
    prompt += "Crie uma lista contendo as afinidades seguindo a ordem das categorias, responda somente no formato JSON.\n"

    prompt += `{\n`
    question.categories.forEach((category, index) => {
        prompt += `   "${category.name}": 100${question.categories.length > index + 1 ? "," : ""}\n`
    })
    prompt += `}`

    return prompt
}

type PromptValidation = {
    ok: boolean
    data: { [key: string]: number }
}

export const promptValidation = (output: any, categories: Category[]): PromptValidation => {
    const result: PromptValidation = {
        ok: false,
        data: {}
    };

    // Check if output is an object
    if (typeof output !== 'object' || output === null) {
        return result;
    }

    const categoryNames = categories.map(category => category.name);

    // Iterate through the keys of output
    for (const key in output) {
        if (categoryNames.includes(key) && Number.isInteger(output[key])) {
            result.data[key] = output[key];
        } else {
            return { ok: false, data: {} };
        }
    }

    result.ok = true;
    return result;
}

export const getClassification = async (researchId: string) => {
    const research = await db.query.researches.findFirst({
        where: (researches, { eq }) => (eq(researches.id, researchId)),
    })

    if (!research) {
        console.log(`getClassification: Research ID not found ${researchId}`)
        return
    }

    const questions = await db.query.questions.findMany({
        where: (questions, { eq }) => (eq(questions.researchId, researchId)),
        with: {
            categories: true
        },
    })

    if (questions.length == 0) {
        console.log(`getClassification: No Questions for Research ID ${researchId}`)
        return
    }

    const forms = (await db.query.forms.findMany({
        where: (forms, { eq }) => (eq(forms.researchId, researchId)),
        with: {
            answers: true
        },
    })) as Form[]

    if (forms.length == 0) {
        console.log(`getClassification: No Forms for Research ID ${researchId}`)
        return
    }

    const total = forms.reduce((acc, form) => {
        return acc + form.answers.length
    }, 0)
    let process = 0

    for await (const form of forms) {
        for await (const answer of form.answers) {
            let attempt = 0;
            let isValid = false;

            console.log(`Progression: ${process * 100 / total}`)

            const question = filterQuestionsBySequence(questions, answer.sequence)[0]

            const classification = await db.query.classifications.findFirst(({
                where: (classifications, { eq }) => (eq(classifications.answerId, answer.id)),
            }))

            if (classification) {
                const alreadyClassificated = question
                    .categories.map((c: Category) => c.name)
                    .every((element: string) => classification.names.includes(element))

                if (alreadyClassificated) {
                    console.log(`getClassification: Classification already done for answer ID ${answer.id}`);
                    process++
                    continue
                }
            }

            while (attempt <= MAX_ATTEMPT && !isValid) {
                const promptInput = prompt(
                    question,
                    answer
                );

                isValid = true

                const output = await promptRequest(promptInput, "answer", answer.id);
                const { object } = stringToJson(output);

                const { ok, data } = promptValidation(object, question.categories);
                isValid = ok

                if (!isValid) {
                    attempt++;
                    if (attempt >= MAX_ATTEMPT) {
                        console.log(`Validation failed after ${attempt} attempts for answer ID ${answer.id}`);
                    }

                    continue
                }

                await db
                    .insert(classifications)
                    .values({
                        answerId: answer.id,
                        names: Object.keys(data),
                        affinities: Object.values(data),
                    })
                    .onConflictDoUpdate({
                        target: classifications.answerId,
                        set: {
                            names: Object.keys(data),
                            affinities: Object.values(data),
                        }
                    });
                process++
            }
        }
    }
}
