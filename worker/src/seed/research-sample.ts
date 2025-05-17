import fs from 'fs'
import { db } from 'iara-shared/database';
import { researches } from 'iara-shared/database/schema/research';
import { questions } from 'iara-shared/database/schema/question';
import { forms } from 'iara-shared/database/schema/form';
import { answers } from 'iara-shared/database/schema/answer';

type FormData = {
    email: string
    answers: {
        purpose: string,
        score: string,
        explanation: string
    }[]
}

type ResearchData = {
    title: string,
    description: string,
    questions: {
        purpose: string,
        sequence: number
    }[]
    forms: FormData[]
}

const researchFiles = [
    '/code/worker/src/seed/researches/f4p-base.json',
    '/code/worker/src/seed/researches/sicredi-2019.json',
    '/code/worker/src/seed/researches/sicredi-2020.json',
    '/code/worker/src/seed/researches/sicredi-2021.json',
    '/code/worker/src/seed/researches/sicredi-2022.json',
    '/code/worker/src/seed/researches/sicredi-2023.json',
    '/code/worker/src/seed/researches/sicredi-2024.json',
    '/code/worker/src/seed/researches/sicredi-2025-01.json',
    '/code/worker/src/seed/researches/sicredi-2025-02.json',
    '/code/worker/src/seed/researches/sicredi-2025-04.json'
]

const seed = async (email: string) => {
    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
    })

    if (!user) {
        return "Email not found"
    }

    for (const filePath of researchFiles) {
        const researchData = JSON.parse(fs.readFileSync(filePath).toString()) as ResearchData

        // Insere a research a partir do JSON
        const [researchReturn] = await db.insert(researches).values({
            description: researchData.description,
            title: researchData.title,
            userId: user.id,
        }).returning()

        // Insere as questions a partir do JSON
        const questionsToInsert = researchData.questions.map(q => ({
            researchId: researchReturn.id,
            purpose: q.purpose,
            sequence: q.sequence,
        }))
        await db.insert(questions).values(questionsToInsert).returning()

        // Para cada form no JSON, insere o form e as respostas
        for await (const formData of researchData.forms) {
            const [formReturn] = await db.insert(forms).values({
                email: formData.email,
                researchId: researchReturn.id
            }).returning()

            const insertData: {
                explanation: string,
                formId: string,
                score: number,
                purpose: string,
                sequence: number
            }[] = [];

            formData.answers.forEach((data, index) => {
                const validated = [
                    data.purpose.length > 0,
                    parseInt(data.score) > 0,
                    data.explanation.length > 0
                ].every(Boolean)

                if (validated) {
                    insertData.push({
                        explanation: data.explanation,
                        formId: formReturn.id,
                        score: parseInt(data.score),
                        purpose: data.purpose,
                        sequence: index + 1
                    })
                }
            })

            if (insertData.length > 0) {
                await db
                    .insert(answers)
                    .values(insertData)
                    .returning()
            }
        }
    }

    process.exit(0)
}

seed("ivanmicai@gmail.com")

