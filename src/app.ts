import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import createEvaluationRoutes from './routes/evaluation.routes';
import { TutorLLM } from './services/tutor.llm';

const createApp = (tutorLLM: TutorLLM) => {
  const app = express();

  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/v1', createEvaluationRoutes(tutorLLM));

  app.get('/', (req, res) => {
    res.send({ message: 'Hello, world!' });
  });
  return app;
}

export default createApp;
