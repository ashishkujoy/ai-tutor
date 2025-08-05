import mongoose from 'mongoose';
import Lesson from '../src/models/lesson.model';
import PromptTemplate from '../src/models/prompt-template.model';
import { evaluateCode } from '../src/services/evaluation.service';
import { TutorLLM } from '../src/services/tutor.llm';

// Helper to create a mock AIMessageChunk

// Mock Mongoose models
jest.mock('../src/models/lesson.model');
jest.mock('../src/models/prompt-template.model');

describe('evaluateCode', () => {
  let mockLlm: jest.Mocked<TutorLLM>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLlm = { evaluateCode: jest.fn() } as unknown as jest.Mocked<TutorLLM>;
  });

  it('should successfully evaluate code and return structured feedback', async () => {
    // Mock Lesson and PromptTemplate data
    const mockLesson = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Test Lesson',
      objective: 'Test Objective',
      moduleId: new mongoose.Types.ObjectId(),
      dayOfMonth: 1,
      learningContentUrl: 'http://example.com',
      dailyChallenge: 'Write a function that adds two numbers.',
      solutionCode: 'function add(a, b) { return a + b; }',
    };

    const mockPromptTemplate = {
      _id: new mongoose.Types.ObjectId(),
      name: 'CodeReview_Instructor',
      interactionType: 'CodeReview',
      phase: 'Instructor',
      template: 'Review the following code for {dailyChallenge}. Solution: {solutionCode}. Submission: {codeSubmission}. Provide feedback and suggestions in JSON format: {{"feedback": "", "suggestions": ""}}',
      version: 1,
      isActive: true,
      notes: ''
    };

    (Lesson.findById as jest.Mock).mockResolvedValue(mockLesson);
    (PromptTemplate.findOne as jest.Mock).mockResolvedValue(mockPromptTemplate);

    // Mock LLM response
    mockLlm.evaluateCode.mockResolvedValue('Good job, but consider edge cases.');

    const lessonId = mockLesson._id.toHexString();
    const codeSubmission = 'function add(a, b) { return a + b; }';

    const result = await evaluateCode(lessonId, codeSubmission, mockLlm);

    expect(Lesson.findById).toHaveBeenCalledWith(lessonId);
    expect(PromptTemplate.findOne).toHaveBeenCalledWith({
      interactionType: 'CodeReview',
      phase: 'Instructor',
      isActive: true,
    });
    expect(mockLlm.evaluateCode).toHaveBeenCalledTimes(1);
    expect(result).toEqual('Good job, but consider edge cases.')
  });

  it('should throw an error if lesson is not found', async () => {
    (Lesson.findById as jest.Mock).mockResolvedValue(null);

    const lessonId = new mongoose.Types.ObjectId().toHexString();
    const codeSubmission = 'some code';

    await expect(evaluateCode(lessonId, codeSubmission, mockLlm)).rejects.toThrow('Lesson not found.');
    expect(Lesson.findById).toHaveBeenCalledWith(lessonId);
    expect(PromptTemplate.findOne).not.toHaveBeenCalled();
    expect(mockLlm.evaluateCode).not.toHaveBeenCalled();
  });

  it('should throw an error if active prompt template is not found', async () => {
    const mockLesson = {
      _id: new mongoose.Types.ObjectId(),
      dailyChallenge: 'test',
      solutionCode: 'test',
    };
    (Lesson.findById as jest.Mock).mockResolvedValue(mockLesson);
    (PromptTemplate.findOne as jest.Mock).mockResolvedValue(null);

    const lessonId = mockLesson._id.toHexString();
    const codeSubmission = 'some code';

    await expect(evaluateCode(lessonId, codeSubmission, mockLlm)).rejects.toThrow('Active Instructor CodeReview prompt template not found.');
    expect(Lesson.findById).toHaveBeenCalledWith(lessonId);
    expect(PromptTemplate.findOne).toHaveBeenCalled();
    expect(mockLlm.evaluateCode).not.toHaveBeenCalled();
  });

  it('should throw an error if LLM invocation fails', async () => {
    const mockLesson = {
      _id: new mongoose.Types.ObjectId(),
      dailyChallenge: 'test',
      solutionCode: 'test',
    };
    const mockPromptTemplate = {
      _id: new mongoose.Types.ObjectId(),
      interactionType: 'CodeReview',
      phase: 'Instructor',
      template: 'Test template {codeSubmission}',
      isActive: true,
    };

    (Lesson.findById as jest.Mock).mockResolvedValue(mockLesson);
    (PromptTemplate.findOne as jest.Mock).mockResolvedValue(mockPromptTemplate);
    mockLlm.evaluateCode.mockRejectedValue(new Error('LLM API error'));

    const lessonId = mockLesson._id.toHexString();
    const codeSubmission = 'some code';

    await expect(evaluateCode(lessonId, codeSubmission, mockLlm)).rejects.toThrow('LLM API error');
    expect(Lesson.findById).toHaveBeenCalledWith(lessonId);
    expect(PromptTemplate.findOne).toHaveBeenCalled();
    expect(mockLlm.evaluateCode).toHaveBeenCalledTimes(1);
  });
});
