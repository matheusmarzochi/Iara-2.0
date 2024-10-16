import { Form } from "../../../app/src/database/schema/form"
import { Question } from "../../../app/src/database/schema/question"

export const filterQuestionsBySequence = (questions: Question[], sequence: number): Question[] => {
    return questions.filter(question => question.sequence === sequence);
}

export const filterAnswersBySequence = (forms: Form[], sequence: number): Form[] => {
    return forms.map(form => {
        return {
            ...form,
            answers: form.answers.filter(a => a.sequence === sequence)
        };
    }).filter(form => form.answers.length > 0);
}
