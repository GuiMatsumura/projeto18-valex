import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';

import errorHandler from './middlewares/errorHandler';
import router from './routes/routeIndex';

dotenv.config();
const app = express();
app.use(cors(), express.json());

app.use(router);
app.use(errorHandler);

const PORT: number = Number(process.env.PORT) || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
