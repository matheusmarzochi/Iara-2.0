import fs from 'fs'
import { db } from '../database';
import { researches } from '../database/schema/research';
import { users } from '../database/schema/user';
import { questions } from '../database/schema/question';
import { forms } from '../database/schema/form';
import { answers } from '../database/schema/answer';

type FormData = {
    email: string
    answers: {
        purpose: string,
        score: string,
        explanation: string
    }[]
}

type AnswerData = {
    explanation: string,
    formId: string,
    score: number,
    purpose: string,
    sequence: number
}

const formsData = JSON.parse(fs.readFileSync('/code/src/seed/forms.json').toString()) as FormData[]

const seed = async () => {
    const [user] = await db.insert(users).values({
        email: "ivanmicai@gmail.com",
        name: "Ivan Micai",
    }).returning()

    const [researchReturn] = await db.insert(researches).values({
        description: "Pesquisa do curso de Agilidade para medir a satisfação do usuário",
        title: "Pesquisa de Satisfação F4P",
        userId: user.id,
    }).returning()

    const [questionsReturn] = await db.insert(questions).values([{
        researchId: researchReturn.id,
        purpose: "Qual foi o seu objetivo PRIMÁRIO em escolher o Treinamento Kanban (KMP I)?",
        score: "De acordo com os objetivos acima avalie como o treinamento atendeu às suas expectativas: [Objetivo PRIMÁRIO]",
        explanation: "Qual a sua justificativa em escolher a opção acima para seu Objetivo PRIMÁRIO?",
        sequence: 1,
    }, {
        researchId: researchReturn.id,
        purpose: "(opcional) Qual foi o seu objetivo SECUNDÁRIO em escolher o KMP I?",
        score: "De acordo com os objetivos acima avalie como o treinamento atendeu às suas expectativas: [Objetivo SECUNDÁRIO]",
        explanation: "Qual a sua justificativa em escolher a opção acima para seu Objetivo SECUNDÁRIO?",
        sequence: 2,
    }, {
        researchId: researchReturn.id,
        purpose: "(opcional) Teve algum OUTRO OBJETIVO além dos dois acima?",
        score: "De acordo com os objetivos acima avalie como o treinamento atendeu às suas expectativas: [OUTRO OBJETIVO]",
        explanation: "Qual a sua justificativa em escolher a opção acima para seu OUTRO OBJETIVO?",
        sequence: 3,
    }]).returning()

    for await (const formData of formsData) {
        const [formReturn] = await db.insert(forms).values({
            email: formData.email,
            researchId: researchReturn.id
        }).returning() 

        const insertData: AnswerData[] = [] 

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

        const [answerReturn] = await db
            .insert(answers)
            .values(insertData)
            .returning()
    }

    process.exit(0)
}


seed()
