import { Question, Form } from "iara-shared/database/schema"
import {
    prompt,
    promptValidation
} from './analysis';

describe('promptValidation', () => {
    it('should return true for valid output object', () => {
        const output = { criteria: "MAINTAIN", action: "Continue com a estratégia atual." };
        expect(promptValidation(output)).toEqual({
            ok: true,
            data: { criteria: "MAINTAIN", action: "Continue com a estratégia atual." }
        });
    });

    it('should return false if output is not an object', () => {
        expect(promptValidation("not an object")).toEqual({ ok: false, data: null });
    });

    it('should return false if criteria is missing', () => {
        expect(promptValidation({ action: "Ação" })).toEqual({ ok: false, data: null });
    });

    it('should return false if action is missing', () => {
        expect(promptValidation({ criteria: "MAINTAIN" })).toEqual({ ok: false, data: null });
    });

    it('should return false if action is empty', () => {
        expect(promptValidation({ criteria: "MAINTAIN", action: "" })).toEqual({ ok: false, data: null });
    });

    it('should return false if criteria is not valid', () => {
        expect(promptValidation({ criteria: "INVALID", action: "Ação" })).toEqual({ ok: false, data: null });
    });
});

describe('prompt function', () => {
    it('should return the correct prompt string for given question, forms, and criteria', () => {
        const question: Question = {
            id: 'q1',
            createdAt: new Date(),
            researchId: 'r1',
            purpose: 'Como podemos melhorar nosso produto?',
            sequence: 1,
            required: false,
            categories: [],
        };

        const forms: Form[] = [
            {
                id: 'f1',
                email: 'example1@test.com',
                createdAt: new Date(),
                researchId: 'r1',
                answers: [
                    {
                        id: 'a1',
                        createdAt: new Date(),
                        formId: 'f1',
                        score: 5,
                        explanation: 'N/A',
                        sequence: 1,
                        purpose: 'Adicionar mais funcionalidades',
                        classifications: [],
                    }
                ]
            },
            {
                id: 'f2',
                email: 'example2@test.com',
                createdAt: new Date(),
                researchId: 'r1',
                answers: [
                    {
                        id: 'a2',
                        createdAt: new Date(),
                        formId: 'f2',
                        score: 4,
                        explanation: 'N/A',
                        sequence: 1,
                        purpose: 'Melhorar a interface',
                        classifications: []
                    }
                ]
            }
        ];

        const criteria = "IMPROVE";

        const expectedOutput =
`Você recebeu uma pesquisa com a seguinte pergunta e lista de respostas.
Seu objetivo é analisar as respostas e sugerir uma ação para a pergunta, escolhendo um critério e uma ação recomendada.

Pergunta da pesquisa:
Como podemos melhorar nosso produto?

Lista de respostas:

0. Adicionar mais funcionalidades
1. Melhorar a interface

Instruções:
Considere que as respostas indicam necessidade de melhorias. Analise as respostas e proponha uma ação para aprimorar a questão.
Depois, sugira uma ação clara e objetiva para a pergunta.
Não mencione as respostas, foque apenas na ação
Não altera o criteria
Responda no formato JSON:
{"criteria": "IMPROVE", "action": "AÇÃO SUGERIDA"}
`;

        expect(prompt(question, forms, criteria)).toBe(expectedOutput);
    });

    it('should handle empty forms and answers correctly', () => {
        const question: Question = {
            id: 'q1',
            createdAt: new Date(),
            researchId: 'r1',
            purpose: 'Como podemos melhorar nosso produto?',
            sequence: 1,
            required: false,
            categories: [],
        };

        const forms: Form[] = [];
        const criteria = "MAINTAIN";

        const expectedOutput =
`Você recebeu uma pesquisa com a seguinte pergunta e lista de respostas.
Seu objetivo é analisar as respostas e sugerir uma ação para a pergunta, escolhendo um critério e uma ação recomendada.

Pergunta da pesquisa:
Como podemos melhorar nosso produto?

Lista de respostas:


Instruções:
Considere que as respostas indicam satisfação com a situação atual. Analise as respostas e proponha uma ação para manter o que está funcionando.
Depois, sugira uma ação clara e objetiva para a pergunta.
Não mencione as respostas, foque apenas na ação
Não altera o criteria
Responda no formato JSON:
{"criteria": "MAINTAIN", "action": "AÇÃO SUGERIDA"}
`;

        expect(prompt(question, forms, criteria)).toBe(expectedOutput);
    });
});
