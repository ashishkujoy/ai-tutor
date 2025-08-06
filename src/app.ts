import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport';
import authRoutes from './routes/auth.routes';
import createEvaluationRoutes from './routes/evaluation.routes';
import { TutorLLM } from './services/tutor.llm';

const createApp = (tutorLLM: TutorLLM) => {
  const app = express();

  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL! }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1', createEvaluationRoutes(tutorLLM));

  app.get('/', (req, res) => {
    res.send({ message: 'Hello, world!', user: req.user || null });
  });
  app.get('/login.html', (req, res) => {
    res.sendFile('login.html', { root: 'public' });
  });
  return app;
}

export default createApp;
