import express from 'express';
import { PORT, MongoDBURL } from './config.js';
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';

const app = express();

// Middleware for parsing request body

app.use(express.json()); // Ensure that the app can parse JSON request bodies

app.get('/', (request, response) => {
    console.log(request);
    response.status(234).send('Welcome to our MERN bookstore app');
});

// Route to save a new book
app.post('/books', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) { //if the request doesn't have all the necessary fields, give this error
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };

        const book = await Book.create(newBook);

        response.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//creating a route to get all books
app.get('/books', async (request, response) => {
    try {
const books = await Book.find({});

return response.status(200).json({
    count: books.length,
    data: books
});
    } catch (error) {
console.log(error.message);
response.status(500).send({message: error.message});
    }
});

//Route to return a specific book based on ID
app.get('/books/:id', async (request, response) => {
    try {
const {id} = request.params;

const book = await Book.findById(id);

return response.status(200).json(book);
    } catch (error) {
console.log(error.message);
response.status(500).send({message: error.message});
    }
});


// Route to Update an existing Book

app.put('/books/:id', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        )
        {
            //if the request doesn't have all the necessary fields, give this error
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }
  //Searches for a book with the id specified in the HTTP Request and updates it based on what we put in the body      
const {id} = request.params;

const result = await Book.findByIdAndUpdate(id, request.body);

//If the book doesn't exist, return an error otherwise give a success message

if (!result) {
    return response.status(404).json({message: 'Book not found'});
}

return response.status(200).send({message: 'Book updated successfully'});

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
    
});

//Route for Deleting a book
app.delete('/books/:id', async(request, response) => {

    try {
        const {id} = request.params;

        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({message: 'Book not found'});
        }

        return response.status(200).send({message: 'Book deleted successfully'});

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});



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
