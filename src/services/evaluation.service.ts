import { PromptTemplate as LC_PromptTemplate } from '@langchain/core/prompts';
import Lesson from '../models/lesson.model';
import PromptTemplate from '../models/prompt-template.model';
import { EvaluationResult, TutorLLM } from './tutor.llm';


export async function evaluateCode(lessonId: string, codeSubmission: string, tutorLLM: TutorLLM): Promise<EvaluationResult> {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new Error('Lesson not found.');
  }

  const lcPromptTemplate = await createPromptTemplate();

  return tutorLLM.evaluateCode(lcPromptTemplate, {
    dailyChallenge: lesson.dailyChallenge,
    solutionCode: lesson.solutionCode,
  }, codeSubmission);
}

async function createPromptTemplate() {
  const promptTemplateDoc = await PromptTemplate.findOne({
    interactionType: 'CodeReview',
    phase: 'Instructor',
    isActive: true,
  });

  if (!promptTemplateDoc) {
    throw new Error('Active Instructor CodeReview prompt template not found.');
  }

  // 3. Construct LLM Prompt using LangChain
  const lcPromptTemplate = new LC_PromptTemplate({
    template: promptTemplateDoc.template,
    inputVariables: ['dailyChallenge', 'solutionCode', 'codeSubmission'],
  });
  return lcPromptTemplate;
}

