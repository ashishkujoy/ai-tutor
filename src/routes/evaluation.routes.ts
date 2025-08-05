import { Router } from 'express';
import { evaluateController } from '../controllers/evaluation.controller';
import { TutorLLM } from '../services/tutor.llm';

const createEvaluationRoutes = (tutorLLM: TutorLLM) => {
    const router = Router();
    router.post('/evaluate', evaluateController(tutorLLM));
    return router;
};

export default createEvaluationRoutes;
