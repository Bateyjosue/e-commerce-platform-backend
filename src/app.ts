
import express from 'express';
import { json, urlencoded } from 'express';
// import { errorHandler } from './middleware/errorHandler';
import { api } from './routes';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api', api);

// app.use(errorHandler);

export default app;
