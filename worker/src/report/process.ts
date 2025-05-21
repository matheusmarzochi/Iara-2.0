import { db } from 'iara-shared/database'
import { eq } from 'iara-shared/node_modules/drizzle-orm'
import { reports, researches, type Research, PointOfInterest, ScoreBox, StrategyInsights, ReportData, analysis } from 'iara-shared/database/schema';

export const getReport = async (researchId: string) => {
    console.log(`getReport: Start processing Research ID ${researchId}`)
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
                            id: true,
                        }
                    }
                }
            },
            questions: {
                columns: {
                    id: true,
                    purpose: true,
                    sequence: true,
                },
                with: {
                    categories: {
                        columns: {
                            id: true,
                            name: true
                        },
                        with: {
                            analysis: true
                        }
                    },
                }
            }
        },
    }) as Research

    if (!research) {
        console.log(`getReport: Research ID not found ${researchId}`)
        return
    }

    const totalQuestions = research.questions.length;
    let progress = 0;

    const data = buildQuestionReports(research, (idx) => {
        progress = idx + 1;
        console.log(`getReport Progression: ${((progress / totalQuestions) * 100).toFixed(2)}% (Question ${progress} of ${totalQuestions})`);
    })

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

    await db
        .update(researches)
        .set({
            status: "FINISHED",
            updatedAt: new Date(),
        })
        .where(
            eq(researches.id, researchId),
        );

    console.log(`getReport: Finished processing Research ID ${researchId}`)
}


// buildQuestionReports agora aceita um callback opcional para progresso
export const buildQuestionReports = (research: Research, onProgress?: (index: number) => void): Array<ReportData> => {
    const questionReports: Array<ReportData> = [];

    for (const [index, question] of research.questions.entries()) {
        const questionReport: ReportData = {
            score_box: { fit: 0, neutral: 0, unfit: 0 },
            question_id: question.id,
            question_propose: question.purpose,
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
                            poiMap[selectedName] = {
                                name: selectedName,
                                score_box: { fit: 0, neutral: 0, unfit: 0 },
                                analysis: {
                                    on_target: { criteria: '', action: '' },
                                    off_target: { criteria: '', action: '' },
                                },
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

        for (const poi of questionReport.point_of_interests) {
            const category = question.categories.find(c => c.name === poi.name)
            if (category) {
                // Calcule a maioria dos scores deste POI
                const fit = poi.score_box.fit;
                const neutral = poi.score_box.neutral;
                const unfit = poi.score_box.unfit;
                
                let majority = 'fit';
                if (fit >= neutral && fit >= unfit) {
                    majority = 'fit';
                } else if (neutral >= fit && neutral >= unfit) {
                    majority = 'neutral';
                } else {
                    majority = 'unfit';
                }

                // Função auxiliar para buscar a action correspondente ao criteria
                const findAction = (criteria: string) => {
                    const found = category.analysis.find(a => a.criteria === criteria);
                    return found ? found.action : '';
                };

                if (majority === 'unfit') {
                    poi.analysis.on_target = { criteria: 'PIVOT', action: findAction('PIVOT') };
                    poi.analysis.off_target = { criteria: 'ABANDON', action: findAction('ABANDON') };
                } else if (majority === 'neutral') {
                    poi.analysis.on_target = { criteria: 'IMPROVE', action: findAction('IMPROVE') };
                    poi.analysis.off_target = { criteria: 'FOCUS', action: findAction('FOCUS') };
                } else {
                    poi.analysis.on_target = { criteria: 'MAINTAIN', action: findAction('MAINTAIN') };
                    poi.analysis.off_target = { criteria: 'RETHINK', action: findAction('RETHINK') };
                }
            }
        }

        // Ao final do loop de cada questão:
        questionReports.push({
            ...questionReport,
            point_of_interests: questionReport.point_of_interests.sort((a, b) => b.answers.length - a.answers.length)
        });
        if (onProgress) onProgress(index);
    }

    return questionReports;
}