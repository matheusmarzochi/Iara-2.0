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

// Novo helper para filtrar respostas por categoria
function filterAnswersByCategory(forms: Form[], sequence: number, categoryName: string) {
    const filteredForms: Form[] = [];
    forms.forEach(form => {
        // Filtra as respostas da questão e da categoria
        const filteredAnswers = form.answers.filter(answer => {
            if (answer.sequence !== sequence) return false;
            // Verifica se alguma classificação tem o nome da categoria
            return answer.classifications.some(classification =>
                classification.names.includes(categoryName)
            );
        });
        if (filteredAnswers.length > 0) {
            filteredForms.push({
                ...form,
                answers: filteredAnswers
            });
        }
    });
    return filteredForms;
}

const criteriaInstructions: Record<string, string> = {
    "PIVOT": "Considere que a maioria das respostas sugere uma mudança significativa de direção. Analise as respostas e proponha uma ação para pivotar a abordagem.",
    "IMPROVE": "Considere que as respostas indicam necessidade de melhorias. Analise as respostas e proponha uma ação para aprimorar a questão.",
    "MAINTAIN": "Considere que as respostas indicam satisfação com a situação atual. Analise as respostas e proponha uma ação para manter o que está funcionando.",
    "ABANDON": "Considere que as respostas sugerem abandonar a abordagem atual. Analise as respostas e proponha uma ação para abandonar ou substituir a questão.",
    "FOCUS": "Considere que as respostas indicam a necessidade de foco em pontos específicos. Analise as respostas e proponha uma ação para concentrar esforços.",
    "RETHINK": "Considere que as respostas sugerem repensar a abordagem. Analise as respostas e proponha uma ação para reavaliar a questão."
};

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
    prompt += criteriaInstructions[criteria] ? criteriaInstructions[criteria] + "\n" : "";
    prompt += "Depois, sugira uma ação clara e objetiva para a pergunta.\n";
    prompt += "Não mencione as respostas, foque apenas na ação\n";
    prompt += `Mantenha a criteria como: ${criteria}\n`;
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
        typeof output.action !== "string" ||
        output.action.trim() === ""
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
            answers: {
                with: {
                    classifications: true
                }
            }
        },
    })) as Form[]

    if (forms.length == 0) {
        console.log(`getAnalysis: No Forms for Research ID ${researchId}`)
        return
    }

    let progress = 0;
    const totalQuestions = questions.length;

    for (const question of questions) {
        if (!question.categories || question.categories.length === 0) continue;

        const categoryScoreBoxes: { [name: string]: { fit: number, neutral: number, unfit: number } } = {};
        for (const category of question.categories) {
            categoryScoreBoxes[category.name] = { fit: 0, neutral: 0, unfit: 0 };
        }

        
        // Cria um dicionário para armazenar as somas de affinities por nome de categoria
        const affinitiesByCategory: { [name: string]: number } = {};

        for (const form of forms) {
            for (const answer of form.answers) {
            if (answer.sequence !== question.sequence) continue;

            // Para cada classificação, some affinities por nome
            for (const classification of answer.classifications) {
                for (let i = 0; i < classification.names.length; i++) {
                const name = classification.names[i];
                const affinity = classification.affinities?.[i] ?? 0;
                affinitiesByCategory[name] = (affinitiesByCategory[name] || 0) + affinity;
                }
            }
            }
        }

        // Para cada resposta, só considera a categoria com maior affinities
        for (const form of forms) {
            for (const answer of form.answers) {
            if (answer.sequence !== question.sequence) continue;

            let maxAffinity = -Infinity;
            let maxCategory: string | null = null;

            for (const classification of answer.classifications) {
                for (let i = 0; i < classification.names.length; i++) {
                const name = classification.names[i];
                const affinity = classification.affinities?.[i] ?? 0;
                if (affinity > maxAffinity) {
                    maxAffinity = affinity;
                    maxCategory = name;
                }
                }
            }

            if (maxCategory && categoryScoreBoxes[maxCategory]) {
                if (answer.score >= 4) categoryScoreBoxes[maxCategory].fit += 1;
                else if (answer.score >= 2) categoryScoreBoxes[maxCategory].neutral += 1;
                else categoryScoreBoxes[maxCategory].unfit += 1;
            }
            }
        }

        for (const category of question.categories) {
            let attempt = 0;
            let isValid = false;

            await db.delete(analysis).where(eq(analysis.categoryId, category.id))

            // Usa o ScoreBox da categoria para decidir o critério majoritário
            const categoryScoreBox = categoryScoreBoxes[category.name];
            const totalResponses =
                categoryScoreBox.fit + categoryScoreBox.neutral + categoryScoreBox.unfit;
            if (totalResponses === 0) continue; // Nenhuma resposta para esta categoria

            let majority = 'fit';
            if (
                categoryScoreBox.fit >= categoryScoreBox.neutral &&
                categoryScoreBox.fit >= categoryScoreBox.unfit
            ) {
                majority = 'fit';
            } else if (
                categoryScoreBox.neutral >= categoryScoreBox.fit &&
                categoryScoreBox.neutral >= categoryScoreBox.unfit
            ) {
                majority = 'neutral';
            } else {
                majority = 'unfit';
            }

            const criteriaList: string[] = [];
            if (majority === 'fit') {
                criteriaList.push("MAINTAIN")
                criteriaList.push("RETHINK")
            } else if (majority === 'neutral') {
                criteriaList.push("IMPROVE")
                criteriaList.push("FOCUS")
            } else {
                criteriaList.push("PIVOT")
                criteriaList.push("ABANDON")
            }
            
            const categoryForms = filterAnswersByCategory(forms, question.sequence, category.name);

            for (const criteria of criteriaList) {
                attempt = 0;
                isValid = false;
                while (attempt < 3 && !isValid) {
                    const promptInput = prompt(
                        filterQuestionsBySequence([question], question.sequence)[0],
                        categoryForms,
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
                        console.error(`Validation failed after ${attempt} attempts for category ID ${category.id} and criteria ${criteria}`);
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
        progress++;
        console.log(`getAnalysis Progression: ${progress}/${totalQuestions} (${((progress / totalQuestions) * 100).toFixed(2)}%)`);
    }
}
