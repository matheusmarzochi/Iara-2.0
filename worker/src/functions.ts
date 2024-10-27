import { eq, and } from 'iara-shared/node_modules/drizzle-orm'
import { db } from 'iara-shared/database'
import { classifications, forms, reports, questions, categories, gptMessages } from 'iara-shared/database/schema'
import { producer } from './queue/research'


const enqueue = async(researchId: string) => {
    await producer.send(researchId)
}

const researchIdStatistics = async(researchId: string) => {
    const researchForms = await db.query.forms.findMany({
        where: eq(forms.researchId, researchId),
        with: {
            answers: true,
        }
    })

    let anwserCompletionTokens = 0
    let anwserPromptTokens = 0
    let anwserRequests = 0
    let questionsCompletionTokens = 0
    let questionsPromptTokens = 0
    let questionsRequests = 0

    for await (const form of researchForms) {
        for await (const answer of form.answers) {
            const answerGptMessage = await db.query.gptMessages.findMany({
                where: and(
                    eq(gptMessages.model_id, answer.id),
                    eq(gptMessages.model_type, "answer")
                )
            })
            anwserRequests += answerGptMessage.length

            answerGptMessage.forEach(gptMessage => {
                anwserPromptTokens += gptMessage.prompt_tokens
                anwserCompletionTokens += gptMessage.completion_tokens    
            })
        }
    }


    const researchQuestions = await db.query.questions.findMany({
        where: eq(questions.researchId, researchId),
    })


    for await (const question of researchQuestions) {
        
        const questionGptMessage = await db.query.gptMessages.findMany({
            where: and(
                eq(gptMessages.model_id, question.id),
                eq(gptMessages.model_type, "question")
            )
        })

        questionsRequests += questionGptMessage.length

        questionGptMessage.forEach(gptMessage => {
            questionsPromptTokens += gptMessage.prompt_tokens
            questionsCompletionTokens += gptMessage.completion_tokens    
        })
    }

    console.log({ 
        anwserCompletionTokens,
        anwserPromptTokens,
        anwserRequests,
        questionsPromptTokens,
        questionsCompletionTokens,
        questionsRequests
    })
}

const reprocessResearch = async(researchId: string) => {
    const researchForms = await db.query.forms.findMany({
        where: eq(forms.researchId, researchId),
        with: {
            answers: true,
        }
    })

    for await (const form of researchForms) {
        for await (const answer of form.answers) {
            await db
                .delete(classifications)
                .where(eq(classifications.answerId, answer.id))
        }
    }

    const researchQuestions = await db.query.questions.findMany({
        where: eq(questions.researchId, researchId),
        with: {
            categories: true
        }
    })


    for await (const question of researchQuestions) {
            await db
                .delete(categories)
                .where(eq(categories.questionId, question.id))
    }

    await db.delete(reports).where(eq(reports.researchId, researchId))

    const categoryDeleted = researchQuestions.reduce((acc, question) => (acc + question.categories.length), 0 )
    const classificationDeleted = researchForms.reduce((acc, form) => (acc + form.answers.length), 0 )
    const formsAccessed = researchForms.length

    console.log({ 
        categories: categoryDeleted,
        classifications: classificationDeleted,
        forms: formsAccessed
    })
}