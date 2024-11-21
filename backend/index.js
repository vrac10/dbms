import express from 'express';
import loginRoute from './routes/login.js'
import participantRoutes from './routes/participant.js'
import eventRoutes from './routes/event.js'
import sponsorsRoute from './routes/sponsor.js'
import cors from 'cors'

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());

app.use(cors({
    origin: true, // your frontend URL
    methods: ['GET', 'POST', 'DELETE', 'PUT'], // specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // specify allowed headers
  }));

app.use('/auth',loginRoute)
app.use('/participant',participantRoutes)
app.use('/event',eventRoutes);
app.use('/sponsors',sponsorsRoute);

app.get('/', (req,res) => {
  console.log('hello ');
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
