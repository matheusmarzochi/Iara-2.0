import { Form } from 'iara-shared/database/schema'
import {
    filterAnswersBySequence,
    filterQuestionsBySequence,
} from './helper';

describe('filterAnswersBySequence', () => {
    const forms: Form[] = [
        {
            id: 'form1',
            email: 'test1@example.com',
            createdAt: new Date(),
            researchId: 'research1',
            answers: [
                { 
                    id: 'answer1',
                    createdAt: new Date(),
                    formId: 'form1',
                    score: 10,
                    explanation: 'Good',
                    sequence: 1,
                    purpose: 'Purpose1',
                    classifications: []
                },
                {
                    id: 'answer2',
                    createdAt: new Date(),
                    formId: 'form1',
                    score: 8,
                    explanation: 'Average',
                    sequence: 2,
                    purpose: 'Purpose2',
                    classifications: []
                },
            ]
        },
        {
            id: 'form2',
            email: 'test2@example.com',
            createdAt: new Date(),
            researchId: 'research2',
            answers: [
                { id: 'answer3', createdAt: new Date(), formId: 'form2', score: 9, explanation: 'Very Good', sequence: 1, purpose: 'Purpose1', classifications: [] },
                { id: 'answer4', createdAt: new Date(), formId: 'form2', score: 7, explanation: 'Fair', sequence: 3, purpose: 'Purpose3', classifications: [] },
            ]
        }
    ];

    it('should filter answers by sequence and return forms with at least one matching answer', () => {
        const sequence = 1;
        const filteredForms = filterAnswersBySequence(forms, sequence);

        expect(filteredForms).toHaveLength(2);
        expect(filteredForms[0].answers).toHaveLength(1);
        expect(filteredForms[0].answers[0].id).toBe('answer1');
        expect(filteredForms[1].answers).toHaveLength(1);
        expect(filteredForms[1].answers[0].id).toBe('answer3');
    });

    it('should return an empty array if no answers match the sequence', () => {
        const sequence = 4;
        const filteredForms = filterAnswersBySequence(forms, sequence);

        expect(filteredForms).toHaveLength(0);
    });

    it('should handle forms with no answers gracefully', () => {
        const emptyForms = [
            ...forms,
            {
                id: 'form3',
                email: 'test3@example.com',
                createdAt: new Date(),
                researchId: 'research3',
                answers: []
            }
        ];
        const sequence = 1;
        const filteredForms = filterAnswersBySequence(emptyForms, sequence);

        expect(filteredForms).toHaveLength(2);
    });
});

describe('filterQuestionsBySequence', () => {
    const questions = [
        { id: '1', createdAt: new Date(), researchId: 'r1', score: '5', explanation: 'ex1', sequence: 1, purpose: 'p1', required: false, categories: [] },
        { id: '2', createdAt: new Date(), researchId: 'r2', score: '4', explanation: 'ex2', sequence: 2, purpose: 'p2', required: false, categories: []  },
        { id: '3', createdAt: new Date(), researchId: 'r3', score: '3', explanation: 'ex3', sequence: 1, purpose: 'p3', required: false, categories: []  },
    ];

    it('should filter questions by sequence', () => {
        const result = filterQuestionsBySequence(questions, 1);
        expect(result).toEqual([
            { id: '1', createdAt: expect.any(Date), researchId: 'r1', score: '5', explanation: 'ex1', sequence: 1, purpose: 'p1', required: false, categories: [] },
            { id: '3', createdAt: expect.any(Date), researchId: 'r3', score: '3', explanation: 'ex3', sequence: 1, purpose: 'p3', required: false, categories: [] },
        ]);
    });

    it('should return an empty array if no questions match the sequence', () => {
        const result = filterQuestionsBySequence(questions, 3);
        expect(result).toEqual([]);
    });

    it('should return all questions if all match the sequence', () => {
        const result = filterQuestionsBySequence(questions, 2);
        expect(result).toEqual([
            { id: '2', createdAt: expect.any(Date), researchId: 'r2', score: '4', explanation: 'ex2', sequence: 2, purpose: 'p2', required: false, categories: [] },
        ]);
    });
});