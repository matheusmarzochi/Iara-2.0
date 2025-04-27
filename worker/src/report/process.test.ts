import { buildQuestionReports } from './process'; 
import { Research } from 'iara-shared/database/schema'

describe('buildQuestionReports', () => {
  test('should generate correct QuestionReport for a simple ResearchObject', () => {
    const research: Research = {
      id: '1',
      title: 'Test Research',
      description: 'Testing ResearchObject',
      userId: 'user1',
      status: 'CREATED',
      createdAt: new Date(),
      updatedAt: null,
      uploadPath: null,
      deletedAt: null,
      forms: [
        {
          id: 'form1',
          createdAt: new Date(),
          email: '',
          researchId: '',
          answers: [
            {
              purpose: 'Purpose 1',
              score: 5,
              explanation: 'Explanation 1',
              sequence: 1,
              createdAt: new Date(),
              formId: '',
              id: '',
              classifications: [
                {
                  names: ['Category A', 'Category B'],
                  affinities: [80, 20],
                  answerId: "",
                  createdAt: new Date(),
                  id: ''
                },
              ],
            },
            {
              purpose: 'Purpose 2',
              score: 3,
              explanation: 'Explanation 2',
              sequence: 2,
              createdAt: new Date(),
              formId: '',
              id: '',
              classifications: [
                {
                  names: ['Category B', 'Category C'],
                  affinities: [50, 50],
                  answerId: "",
                  createdAt: new Date(),
                  id: ''
                },
              ],
            },
          ],
        },
        {
          id: 'form2',
          createdAt: new Date(),
          email: '',
          researchId: '',
          answers: [
            {
              purpose: 'Purpose 3',
              score: 2,
              explanation: 'Explanation 3',
              sequence: 1,
              createdAt: new Date(),
              formId: '',
              id: '',
              classifications: [
                {
                  names: ['Category A', 'Category C'],
                  affinities: [60, 40],
                  answerId: '',
                  createdAt: new Date(),
                  id: ''
                },
              ],
            },
          ],
        },
      ],
      questions: [
        {
          purpose: 'Question 1',
          sequence: 1,
          createdAt: new Date(),
          required: false,
          id: '',
          researchId: '',
          categories: [
            { name: 'Category A', target: true, createdAt: new Date(), id: '', questionId: '' },
            { name: 'Category B', target: false, createdAt: new Date(), id: '', questionId: '' },
            { name: 'Category C', target: true, createdAt: new Date(), id: '', questionId: '' },
          ],
          analysis: []
        },
        {
          purpose: 'Question 2',
          sequence: 2,
          createdAt: new Date(),
          required: false,
          id: '',
          researchId: '',
          categories: [
            { name: 'Category A', target: false, createdAt: new Date(), id: '', questionId: '' },
            { name: 'Category B', target: true, createdAt: new Date(), id: '', questionId: '' },
            { name: 'Category C', target: false, createdAt: new Date(), id: '', questionId: '' },
          ],
          analysis: [],
        },
      ],
      
    };

    const reports = buildQuestionReports(research);

    expect(reports.length).toBe(2);

    // Test for Question 1
    const report1 = reports[0];
    expect(report1.total_forms).toBe(2);
    expect(report1.score_box).toEqual({ fit: 1, neutral: 1, unfit: 0 });

    expect(report1.strategy_insights).toEqual({
      improve: ['Category A'],
      adjust: [],
      develop: [],
      focus: [],
      pivot: [],
      abandon: [],
    });

    // Test for PointOfInterest in Question 1
    expect(report1.point_of_interests.length).toBe(1);
    const poiNames1 = report1.point_of_interests.map((poi) => poi.name);
    expect(poiNames1).toContain('Category A');

    // Test for Question 2
    const report2 = reports[1];
    expect(report2.total_forms).toBe(1);
    expect(report2.score_box).toEqual({ fit: 0, neutral: 1, unfit: 0 });

    expect(report2.strategy_insights).toEqual({
      improve: [],
      adjust: [],
      develop: ['Category B'],
      focus: [],
      pivot: [],
      abandon: [],
    });

    // Test for PointOfInterest in Question 2
    expect(report2.point_of_interests.length).toBe(1);
    const poiNames2 = report2.point_of_interests.map((poi) => poi.name);
    expect(poiNames2).toContain('Category B');
  });

  test('should handle answers without classifications', () => {
    const research: Research = {
      id: '2',
      title: 'Test Research without classifications',
      description: '',
      userId: 'user2',
      status: 'CREATED',
      createdAt: new Date(),
      updatedAt: null,
      uploadPath: null,
      deletedAt: null,
      forms: [
        {
          id: 'form1',
          createdAt: new Date(),
          email: '',
          researchId: '',
          answers: [
            {
              purpose: 'Purpose 1',
              score: 4,
              explanation: 'Explanation 1',
              sequence: 1,
              classifications: [],
              createdAt: new Date(),
              formId: '',
              id: ''
            },
          ],
        },
      ],
      questions: [
        {
          purpose: 'Question 1',
          sequence: 1,
          createdAt: new Date(),
          required: false,
          id: '',
          researchId: '',
          categories: [{ name: 'Category A', target: true, createdAt: new Date(), id: '', questionId: '' }],
          analysis: [],
        },
      ],
    };

    const reports = buildQuestionReports(research);

    expect(reports.length).toBe(1);

    const report = reports[0];
    expect(report.total_forms).toBe(1);
    expect(report.score_box).toEqual({ fit: 1, neutral: 0, unfit: 0 });
    expect(report.point_of_interests.length).toBe(0);
    expect(report.strategy_insights).toEqual({
      improve: [],
      adjust: [],
      develop: [],
      focus: [],
      pivot: [],
      abandon: [],
    });
  });

  test('should handle multiple answers from the same form', () => {
    const research: Research = {
      id: '3',
      title: 'Test Multiple Answers',
      description: '',
      userId: 'user3',
      status: 'CREATED',
      createdAt: new Date(),
      updatedAt: null,
      uploadPath: null,
      deletedAt: null,
      forms: [
        {
          id: 'form1',
          createdAt: new Date(),
          email: '',
          researchId: '',
          answers: [
            {
              purpose: 'Purpose 1',
              score: 1,
              explanation: 'Explanation 1',
              sequence: 1,
              createdAt: new Date(),
              formId: '',
              id: '',
              classifications: [
                {
                  names: ['Category A'],
                  affinities: [100],
                  answerId: '',
                  createdAt: new Date(),
                  id: ''
                },
              ],
            },
            {
              purpose: 'Purpose 2',
              score: 5,
              explanation: 'Explanation 2',
              sequence: 1,
              createdAt: new Date(),
              formId: '',
              id: '',
              classifications: [
                {
                  names: ['Category B'],
                  affinities: [100],
                  answerId: '',
                  createdAt: new Date(),
                  id: ''
                },
              ],
            },
          ],
        },
      ],
      questions: [
        {
          purpose: 'Question 1',
          sequence: 1,
          createdAt: new Date(),
          required: false,
          id: '',
          researchId: '',
          categories: [
            { name: 'Category A', target: true, createdAt: new Date(), id: '', questionId: '' },
            { name: 'Category B', target: false, createdAt: new Date(), id: '', questionId: '' },
          ],
          analysis: [],
        },
      ],
    };

    const reports = buildQuestionReports(research);

    expect(reports.length).toBe(1);
    const report = reports[0];
    expect(report.total_forms).toBe(1);
    expect(report.score_box).toEqual({ fit: 1, neutral: 0, unfit: 1 });

    expect(report.point_of_interests.length).toBe(2);

    const poiA = report.point_of_interests.find((poi) => poi.name === 'Category A');
    const poiB = report.point_of_interests.find((poi) => poi.name === 'Category B');
    expect(poiA == undefined).toBeFalsy()
    expect(poiB == undefined).toBeFalsy()
    
    if(poiA) {
        expect(poiA.score_box).toEqual({ fit: 0, neutral: 0, unfit: 1 });
    }

    if(poiB) {
        expect(poiB.score_box).toEqual({ fit: 1, neutral: 0, unfit: 0 });
    }

    expect(report.strategy_insights).toEqual({
      improve: [],
      adjust: ['Category B'],
      develop: [],
      focus: [],
      pivot: ['Category A'],
      abandon: [],
    });
  });

  test('should correctly assign strategy insights based on target and score', () => {
    const research: Research = {
      id: '4',
      title: 'Test Strategy Insights',
      description: '',
      userId: 'user4',
      status: 'CREATED',
      createdAt: new Date(),
      updatedAt: null,
      uploadPath: null,
      deletedAt: null,
      forms: [
        {
          id: 'form1',
          createdAt: new Date(),
          email: '',
          researchId: '',
          answers: [
            {
              purpose: 'Purpose 1',
              score: 5,
              explanation: '',
              sequence: 1,
              createdAt: new Date(),
              formId: '',
              id: '',
              classifications: [
                {
                  names: ['Category X'],
                  affinities: [100],
                  answerId: '',
                  createdAt: new Date(),
                  id: ''
                },
              ],
            },
          ],
        },
        {
          id: 'form2',
          createdAt: new Date(),
          email: '',
          researchId: '',
          answers: [
            {
              purpose: 'Purpose 2',
              score: 3,
              explanation: '',
              sequence: 1,
              createdAt: new Date(),
              formId: '',
              id: '',
              classifications: [
                {
                  names: ['Category Y'],
                  affinities: [100],
                  answerId: '',
                  createdAt: new Date(),
                  id: ''
                },
              ],
            },
          ],
        },
        {
          id: 'form3',
          createdAt: new Date(),
          email: '',
          researchId: '',
          answers: [
            {
              purpose: 'Purpose 3',
              score: 1,
              explanation: '',
              sequence: 1,
              createdAt: new Date(),
              formId: '',
              id: '',
              classifications: [
                {
                  names: ['Category Z'],
                  affinities: [100],
                  answerId: '',
                  createdAt: new Date(),
                  id: '',
                },
              ],
            },
          ],
        },
      ],
      questions: [
        {
          purpose: 'Question 1',
          sequence: 1,
          createdAt: new Date(),
          required: false,
          id: '',
          researchId: '',
          categories: [
            { name: 'Category X', target: true, createdAt: new Date(), id: '', questionId: '' },
            { name: 'Category Y', target: false, createdAt: new Date(), id: '', questionId: '' },
            { name: 'Category Z', target: true, createdAt: new Date(), id: '', questionId: '' },
          ],
          analysis: [],
        },
      ],
    };

    const reports = buildQuestionReports(research);
    expect(reports.length).toBe(1);
    const report = reports[0];

    expect(report.total_forms).toBe(3);
    expect(report.score_box).toEqual({ fit: 1, neutral: 1, unfit: 1 });

    expect(report.strategy_insights).toEqual({
      improve: ['Category X'],
      adjust: [],
      develop: [],
      focus: ['Category Y'],
      pivot: ['Category Z'],
      abandon: [],
    });
  });

  test('should skip categories with no responses', () => {
    const research: Research = {
      id: '5',
      title: 'Test No Responses',
      description: '',
      userId: 'user5',
      status: 'CREATED',
      createdAt: new Date(),
      updatedAt: null,
      uploadPath: null,
      deletedAt: null,
      forms: [],
      questions: [
        {
          purpose: 'Question 1',
          sequence: 1,
          createdAt: new Date(),
          required: false,
          id: '',
          researchId: '',
          categories: [
            { name: 'Category A', target: true, createdAt: new Date(), id: '', questionId: '' },
            { name: 'Category B', target: false, createdAt: new Date(), id: '', questionId: '' },
          ],
          analysis: [],
        },
      ],
    };

    const reports = buildQuestionReports(research);
    expect(reports.length).toBe(1);
    const report = reports[0];

    expect(report.total_forms).toBe(0);
    expect(report.score_box).toEqual({ fit: 0, neutral: 0, unfit: 0 });
    expect(report.strategy_insights).toEqual({
      improve: [],
      adjust: [],
      develop: [],
      focus: [],
      pivot: [],
      abandon: [],
    });
  });

  test('should handle ties in majority calculation', () => {
    const research: Research = {
      id: '6',
      title: 'Test Ties in Majority',
      description: '',
      userId: 'user6',
      status: 'CREATED',
      createdAt: new Date(),
      uploadPath: null,
      deletedAt: null,
      updatedAt: null,
      forms: [
        {
          id: 'form1',
          createdAt: new Date(),
          email: '',
          researchId: '',
          answers: [
            {
              purpose: 'Purpose 1',
              score: 4,
              explanation: '',
              sequence: 1,
              createdAt: new Date(),
              formId: '',
              id: '',
              classifications: [
                {
                  names: ['Category A'],
                  affinities: [100],
                  answerId: '',
                  createdAt:  new Date(),
                  id: ''
                },
              ],
            },
            {
              purpose: 'Purpose 2',
              score: 2,
              explanation: '',
              sequence: 1,
              createdAt: new Date(),
              formId: '',
              id: '',
              classifications: [
                {
                  names: ['Category A'],
                  affinities: [100],
                  answerId: '',
                  createdAt: new Date(),
                  id: '', 
                },
              ],
            },
            {
              purpose: 'Purpose 3',
              score: 1,
              explanation: '',
              sequence: 1,
              createdAt: new Date(),
              formId: '',
              id: '',
              classifications: [
                {
                  names: ['Category A'],
                  affinities: [100],
                  answerId: '',
                  createdAt: new Date(),
                  id: ''
                },
              ],
            },
          ],
        },
      ],
      questions: [
        {
          purpose: 'Question 1',
          sequence: 1,
          createdAt: new Date(),
          required: false,
          id: '',
          researchId: '',
          categories: [{ name: 'Category A', target: true, createdAt: new Date(), id: '', questionId: '' }],
          analysis: [],
        },
      ],
    };

    const reports = buildQuestionReports(research);
    expect(reports.length).toBe(1);
    const report = reports[0];

    expect(report.total_forms).toBe(1);
    expect(report.score_box).toEqual({ fit: 1, neutral: 1, unfit: 1 });

    // Since fit, neutral, and unfit all have counts of 1, the code defaults to 'fit' in ties
    expect(report.strategy_insights).toEqual({
      improve: ['Category A'],
      adjust: [],
      develop: [],
      focus: [],
      pivot: [],
      abandon: [],
    });
  });

  test('should assign answer to PointOfInterest with highest affinity', () => {
    const research: Research = {
      id: '7',
      title: 'Test Highest Affinity',
      description: '',
      userId: 'user7',
      status: 'CREATED',
      createdAt: new Date(),
      updatedAt: null,
      uploadPath: null,
      deletedAt: null,
      forms: [
        {
          id: 'form1',
          createdAt: new Date(),
          email: '',
          researchId: '',
          answers: [
            {
              purpose: 'Purpose 1',
              score: 5,
              explanation: '',
              sequence: 1,
              createdAt: new Date(),
              formId: '',
              id: '',
              classifications: [
                {
                  names: ['Category A', 'Category B'],
                  affinities: [30, 70],
                  answerId: '',
                  createdAt: new Date(),
                  id: ''
                },
              ],
            },
          ],
        },
      ],
      questions: [
        {
          purpose: 'Question 1',
          sequence: 1,
          createdAt: new Date(),
          id: '',
          required: false,
          researchId: '',
          categories: [
            { name: 'Category A', target: true, createdAt: new Date(), id: '', questionId: '' },
            { name: 'Category B', target: false, createdAt: new Date(), id: '', questionId: '' },
          ],
          analysis: [],
        },
      ],
    };

    const reports = buildQuestionReports(research);
    expect(reports.length).toBe(1);
    const report = reports[0];

    expect(report.total_forms).toBe(1);
    expect(report.score_box).toEqual({ fit: 1, neutral: 0, unfit: 0 });

    expect(report.point_of_interests.length).toBe(1);
    expect(report.point_of_interests[0].name).toBe('Category B');

    expect(report.strategy_insights).toEqual({
      improve: [],
      adjust: ['Category B'],
      develop: [],
      focus: [],
      pivot: [],
      abandon: [],
    });
  });
});
