import dotenv from "dotenv";
dotenv.config();

require('./db');



import express from 'express';
import postRouter from './routers/post';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(morgan('dev'));
app.use('/api/post/',postRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});