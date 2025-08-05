import { ChatPromptTemplate } from '@langchain/core/prompts';
import Lesson from '../models/lesson.model';
import PromptTemplate from '../models/prompt-template.model';
import { TutorLLM } from './tutor.llm';


export async function evaluateCode(lessonId: string, codeSubmission: string, tutorLLM: TutorLLM): Promise<string> {
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

const createPromptTemplate = async () => {
  const promptTemplateDoc = await PromptTemplate.findOne({
    interactionType: 'CodeReview',
    phase: 'Instructor',
    isActive: true,
  });

  if (!promptTemplateDoc) {
    throw new Error('Active Instructor CodeReview prompt template not found.');
  }

  return ChatPromptTemplate.fromMessages([
    ["system", promptTemplateDoc.template],
    ["user", "{codeSubmission}"]
  ])
}

