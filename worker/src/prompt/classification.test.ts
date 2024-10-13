import { promptValidation } from './classification';

describe('promptValidation', () => {
    const categories = [
        { id: '1', name: 'category1', createdAt: new Date(), questionId: 'q1' },
        { id: '2', name: 'category2', createdAt: new Date(), questionId: 'q2' },
        { id: '3', name: 'category3', createdAt: new Date(), questionId: 'q3' },
    ];

    test('should return false when output is not an object', () => {
        const result = promptValidation(null, categories);
        expect(result.ok).toBe(false);
        expect(result.data).toEqual({});
    });

    test('should return true and data when all keys exist in categories', () => {
        const output = { category1: 1, category2: 2 };
        const result = promptValidation(output, categories);
        expect(result.ok).toBe(true);
        expect(result.data).toEqual(output);
    });

    test('should return false when some keys do not exist in categories', () => {
        const output = { category1: 1, category4: 4 };
        const result = promptValidation(output, categories);
        expect(result.ok).toBe(false);
        expect(result.data).toEqual({});
    });

    test('should return true and empty data when output is an empty object', () => {
        const output = {};
        const result = promptValidation(output, categories);
        expect(result.ok).toBe(true);
        expect(result.data).toEqual({});
    });
})
