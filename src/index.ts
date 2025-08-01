import dotenv from 'dotenv';
dotenv.config();
import app from './app';

import connectDB from './config/database';

connectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
