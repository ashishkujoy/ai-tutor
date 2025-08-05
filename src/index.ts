import dotenv from 'dotenv';
dotenv.config();
import createApp from './app';

import connectDB from './config/database';
import { TutorLLMImpl } from './services/tutor.llm';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

connectDB();

const app = createApp(
  new TutorLLMImpl(new ChatGoogleGenerativeAI({
    model: 'gemini-flash-2.5',
    temperature: 0.7,
  }))
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
