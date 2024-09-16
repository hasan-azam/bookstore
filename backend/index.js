import express from 'express';
import { PORT, MongoDBURL } from './config.js';
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';

const app = express();

// Middleware for parsing request body

app.use(express.json()); // Ensure that the app can parse JSON request bodies

//Middleware for handling CORS Policy

app.use(
    cors({
        origin: 'http//localhost:3000',
        methods: ['GET', 'POST', 'PUT', "DELETE"],
        allowedHeaders: ['Content-Type'],
    })
);

app.get('/', (request, response) => {
    console.log(request);
    response.status(234).send('Welcome to our MERN bookstore app');
});

app.use('/books', booksRoute);

//connects app to MongoDB and logs which port it's running on
mongoose
    .connect(MongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
