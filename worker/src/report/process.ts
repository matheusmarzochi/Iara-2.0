import { db } from '../database'
import { eq } from 'drizzle-orm'
import { reports, researches, type Research } from '../database/schema';

interface ScoreBox {
    fit: number
    neutral: number
    unfit: number
}

interface PointOfInterest {
    name: string
    score_box: ScoreBox
    answers: Array<{
        purpose: string;
        score: number;
        explanation: string;
        sequence: number;
        classifications: Array<{
            names: string[];
            affinities: number[];
        }>;
    }>
}

interface StrategyInsights {
    improve: Array<string>;
    adjust: Array<string>;
    develop: Array<string>;
    focus: Array<string>;
    pivot: Array<string>;
    abandon: Array<string>;
}

export type QuestionReport = {
    score_box: ScoreBox
    point_of_interests: Array<PointOfInterest>
    total_forms: number
    strategy_insights: StrategyInsights;
    total_answers: number
}

export const getReport = async (researchId: string) => {
    const research = await db.query.researches.findFirst({
        where: eq(researches.id, researchId),
        with: {
            forms: {
                columns: {
                    id: true
                },
                with: {
                    answers: {
                        with: {
                            classifications: {
                                columns: {
                                    affinities: true,
                                    names: true
                                }
                            }
                        },
                        columns: {
                            purpose: true,
                            score: true,
                            sequence: true,
                            explanation: true,
                        }
                    }
                }
            },
            questions: {
                columns: {
                    purpose: true,
                    sequence: true,
                    explanation: true,
                    score: true,
                },
                with: {
                    categories: {
                        columns: {
                            name: true
                        }
                    }
                }
            }
        },
    }) as Research

    if (!research) {
        console.log(`getClassification: Research ID not found ${researchId}`)
        return
    }

    const data = buildQuestionReports(research)

    await db
        .insert(reports)
        .values({
            researchId: research.id,
            data: data,
        })
        .onConflictDoUpdate({
            target: reports.researchId,
            set: {
                data: data
            }
        });

}


export const buildQuestionReports = (research: Research): Array<QuestionReport> => {
    const questionReports: Array<QuestionReport> = [];

    for (const question of research.questions) {
        const questionReport: QuestionReport = {
            score_box: { fit: 0, neutral: 0, unfit: 0 },
            point_of_interests: [],
            strategy_insights: {
                improve: [],
                adjust: [],
                develop: [],
                focus: [],
                pivot: [],
                abandon: [],
            },
            total_forms: 0,
            total_answers: 0,
        };

        // Map to collect PointOfInterest by name (from classifications)
        const poiMap: { [name: string]: PointOfInterest } = {};

        const formsWithAnswers = new Set<string>(); // to keep track of form ids

        // Map to collect ScoreBox per category
        const categoryScoreBoxes: { [name: string]: ScoreBox } = {};

        // Initialize ScoreBoxes for each category
        for (const category of question.categories) {
            categoryScoreBoxes[category.name] = { fit: 0, neutral: 0, unfit: 0 };
        }

        // Collect all answers to this question
        for (const form of research.forms) {
            let formHasAnswerToQuestion = false;

            for (const answer of form.answers) {
                if (answer.sequence === question.sequence) {
                    formHasAnswerToQuestion = true;
                    questionReport.total_answers += 1;

                    // Update overall score_box
                    if (answer.score >= 4) {
                        questionReport.score_box.fit += 1;
                    } else if (answer.score >= 2) {
                        questionReport.score_box.neutral += 1;
                    } else {
                        questionReport.score_box.unfit += 1;
                    }

                    // For this answer, determine the classification name with the highest affinity
                    let highestAffinity = -1;
                    let selectedName = '';

                    for (const classification of answer.classifications) {
                        for (let i = 0; i < classification.names.length; i++) {
                            const name = classification.names[i];
                            const affinity = classification.affinities[i];

                            if (affinity > highestAffinity) {
                                highestAffinity = affinity;
                                selectedName = name;
                            }
                        }
                    }

                    // Ensure the answer is assigned to only one PointOfInterest
                    if (selectedName) {
                        if (!poiMap[selectedName]) {
                            // Initialize PointOfInterest
                            poiMap[selectedName] = {
                                name: selectedName,
                                score_box: { fit: 0, neutral: 0, unfit: 0 },
                                answers: [],
                            };
                        }

                        // Add answer to PointOfInterest
                        poiMap[selectedName].answers.push(answer);

                        // Update PointOfInterest's score_box
                        if (answer.score >= 4) {
                            poiMap[selectedName].score_box.fit += 1;
                        } else if (answer.score >= 2) {
                            poiMap[selectedName].score_box.neutral += 1;
                        } else {
                            poiMap[selectedName].score_box.unfit += 1;
                        }

                        // Update category ScoreBox if the selectedName matches a category
                        if (categoryScoreBoxes[selectedName]) {
                            if (answer.score >= 4) {
                                categoryScoreBoxes[selectedName].fit += 1;
                            } else if (answer.score >= 2) {
                                categoryScoreBoxes[selectedName].neutral += 1;
                            } else {
                                categoryScoreBoxes[selectedName].unfit += 1;
                            }
                        }
                    }
                }
            }

            if (formHasAnswerToQuestion) {
                formsWithAnswers.add(form.id);
            }
        }

        questionReport.total_forms = formsWithAnswers.size;
        questionReport.point_of_interests = Object.values(poiMap);

        // Now, for each category, decide which strategy_insights list to add it to
        for (const category of question.categories) {
            const categoryScoreBox = categoryScoreBoxes[category.name];
            const totalResponses =
                categoryScoreBox.fit + categoryScoreBox.neutral + categoryScoreBox.unfit;
            if (totalResponses === 0) continue; // No data for this category

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

            const target = category.target;

            if (target) {
                if (majority === 'fit') {
                    questionReport.strategy_insights.improve.push(category.name);
                } else if (majority === 'neutral') {
                    questionReport.strategy_insights.develop.push(category.name);
                } else {
                    questionReport.strategy_insights.pivot.push(category.name);
                }
            } else {
                if (majority === 'fit') {
                    questionReport.strategy_insights.adjust.push(category.name);
                } else if (majority === 'neutral') {
                    questionReport.strategy_insights.focus.push(category.name);
                } else {
                    questionReport.strategy_insights.abandon.push(category.name);
                }
            }
        }

        questionReports.push(questionReport);
    }

    return questionReports;
}