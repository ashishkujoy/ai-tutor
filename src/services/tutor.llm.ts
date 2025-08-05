import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import Lesson from '../models/lesson.model';

export interface EvaluationResult {
    feedback: string;
    suggestions: string;
    rawLLMResponse: string;
}

type Lesson = {
    dailyChallenge: string;
    solutionCode: string;
}

export interface TutorLLM {
    evaluateCode(promptTemplate: ChatPromptTemplate, lesson: Lesson, codeSubmission: string): Promise<string>
}

export class TutorLLMImpl implements TutorLLM {
    private llm: BaseChatModel;
    constructor(llm: BaseChatModel) {
        this.llm = llm;
    }

    async evaluateCode(promptTemplate: ChatPromptTemplate, lesson: Lesson, codeSubmission: string): Promise<string> {
        const messages = (await promptTemplate.invoke({ codeSubmission })).messages
        const res = await this.llm.invoke(messages);
        return res.text;
    }
}