import { Question } from "../database/schema/question"
import { Form } from "../database/schema/form"
import {
    prompt,
    promptValidation
} from './categorization';

describe('promptValidation', () => {
    it('should return true for a valid array of strings with the correct size', () => {
        const output = ['string1', 'string2', 'string3'];
        const size = 3;
        expect(promptValidation(output, size)).toEqual({ ok: true, data: ['string1', 'string2', 'string3'] });
    });

    it('should return false if output is not an array', () => {
        const output = 'not an array';
        const size = 3;
        expect(promptValidation(output, size)).toEqual({ ok: false, data: [] });
    });

    it('should return false if the array size does not match the specified size', () => {
        const output = ['string1', 'string2'];
        const size = 3;
        expect(promptValidation(output, size)).toEqual({ ok: false, data: [] });
    });

    it('should return false if any element in the array is not a string', () => {
        const output = ['string1', 'string2', 123];
        const size = 3;
        expect(promptValidation(output, size)).toEqual({ ok: false, data: [] });
    });

    it('should return false if the array is empty and size is greater than 0', () => {
        const output: string[] = [];
        const size = 1;
        expect(promptValidation(output, size)).toEqual({ ok: false, data: [] });
    });

    it('should return true for an empty array if size is 0', () => {
        const output: string[] = [];
        const size = 0;
        expect(promptValidation(output, size)).toEqual({ ok: true, data: [] });
    });
});

describe('prompt function', () => {
    it('should return the correct prompt string for given question, forms, and categories', () => {
        const question: Question = {
            id: 'q1',
            createdAt: new Date(),
            researchId: 'r1',
            purpose: 'Qual é o seu hobby favorito?',
            score: 'high',
            explanation: 'N/A',
            sequence: 1,
            categories: []
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
                        purpose: 'Ler livros',
                        classifications: [],
                    },
                    {
                        id: 'a2',
                        createdAt: new Date(),
                        formId: 'f1',
                        score: 5,
                        explanation: 'N/A',
                        sequence: 2,
                        purpose: 'Assistir filmes',
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
                        id: 'a3',
                        createdAt: new Date(),
                        formId: 'f2',
                        score: 5,
                        explanation: 'N/A',
                        sequence: 1,
                        purpose: 'Jogar futebol',
                        classifications: []
                    },
                    {
                        id: 'a4',
                        createdAt: new Date(),
                        formId: 'f2',
                        score: 5,
                        explanation: 'N/A',
                        sequence: 2,
                        purpose: 'Correr',
                        classifications: []
                    }
                ]
            }
        ];

        const categories = 2;

        const expectedOutput = `Você recebeu uma pesquisa com a seguinte pergunta e lista de respostas. Seu objetivo é agrupar as respostas em categorias distintas e descritivas.\n\nPergunta da pesquisa:\nQual é o seu hobby favorito?\n\nLista de respostas:\n\n0. Ler livros\n0. Assistir filmes\n1. Jogar futebol\n1. Correr\n\nInstruções:\nAnalise a lista de respostas e agrupe-as em categorias. Cada categoria deve conter no máximo duas palavras e deve conter grupo de atividades semelhantes. Liste apenas as 2 categorias no formato JSON.\n['categoria 1', ...]`;

        expect(prompt(question, forms, categories)).toBe(expectedOutput);
    });

    it('should handle empty forms and answers correctly', () => {
        const question: Question = {
            id: 'q1',
            createdAt: new Date(),
            researchId: 'r1',
            purpose: 'Qual é o seu hobby favorito?',
            score: 'high',
            explanation: 'N/A',
            sequence: 1,
            categories: []
        };

        const forms: Form[] = [];

        const categories = 2;

        const expectedOutput = `Você recebeu uma pesquisa com a seguinte pergunta e lista de respostas. Seu objetivo é agrupar as respostas em categorias distintas e descritivas.\n\nPergunta da pesquisa:\nQual é o seu hobby favorito?\n\nLista de respostas:\n\n\nInstruções:\nAnalise a lista de respostas e agrupe-as em categorias. Cada categoria deve conter no máximo duas palavras e deve conter grupo de atividades semelhantes. Liste apenas as 2 categorias no formato JSON.\n['categoria 1', ...]`;

        expect(prompt(question, forms, categories)).toBe(expectedOutput);
    });
});
