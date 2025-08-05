import { PromptTemplate } from "@langchain/core/prompts";
import Lesson from '../models/lesson.model';
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { JsonOutputParser } from "@langchain/core/output_parsers";

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
    evaluateCode(promptTemplate: PromptTemplate, lesson: Lesson, codeSubmission: string): Promise<EvaluationResult>
}

export class TutorLLMImpl implements TutorLLM {
    private llm: BaseChatModel;
    constructor(llm: BaseChatModel) {
        this.llm = llm;
    }

    async evaluateCode(promptTemplate: PromptTemplate, lesson: Lesson, codeSubmission: string): Promise<EvaluationResult> {
        const parser = new JsonOutputParser();

        const chain = promptTemplate.pipe(this.llm).pipe(parser);

        let llmResponse: any;
        try {
            llmResponse = await chain.invoke({
                dailyChallenge: lesson.dailyChallenge,
                solutionCode: lesson.solutionCode,
                codeSubmission: codeSubmission,
            });
        } catch (error) {
            console.error('Error invoking LLM:', error);
            throw new Error('Failed to get response from LLM.');
        }

        // 5. Process LLM Response and return structured JSON
        // Assuming the LLM is instructed to return JSON with 'feedback' and 'suggestions'
        if (typeof llmResponse === 'object' && llmResponse !== null && 'feedback' in llmResponse && 'suggestions' in llmResponse) {
            return {
                feedback: llmResponse.feedback,
                suggestions: llmResponse.suggestions,
                rawLLMResponse: JSON.stringify(llmResponse),
            };
        } else {
            // Fallback if LLM doesn't return expected JSON format
            return {
                feedback: 'Could not parse LLM feedback.',
                suggestions: 'Please try again or check the prompt template.',
                rawLLMResponse: JSON.stringify(llmResponse),
            };
        }
    }
}