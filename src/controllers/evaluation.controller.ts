import { Request, Response } from 'express';
import { evaluateCode } from '../services/evaluation.service';
import { TutorLLM } from '../services/tutor.llm';

export const evaluateController = (tutorLLM: TutorLLM) => async (req: Request, res: Response) => {
  try {
    const { lessonId, codeSubmission } = req.body;

    if (!lessonId || !codeSubmission) {
      return res.status(400).json({ message: 'lessonId and codeSubmission are required.' });
    }

    const result = await evaluateCode(lessonId, codeSubmission, tutorLLM);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in evaluation controller:', error);
    res.status(500).json({ message: error.message || 'Internal server error.' });
  }
};
