import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import resultRouter from './routes/resultRoutes.js';


const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(cors({https://laboratory-quiz-app.onrender.com}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));



//db
connectDB();

//routes
app.use('/api/auth', userRouter);

app.use('/api/results', resultRouter);

app.get('/', (req, res)=>{
    res.send('API WORKING');
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
