import express from 'express'
import dotenv from 'dotenv'
import {MongoClient} from 'mongodb'
import {setDB} from './services/db.js'
import booksRouter from './routes/books.js'
import historyRouter from './routes/history.js'

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

//our routes
app.use('/books',booksRouter);
app.use('/history',historyRouter);

//connecting to Mongodb and starting server
const{DB_USER, DB_PASSWORD, DB_HOST,DB_NAME} = process.env;
const mongoURI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;
const client = new MongoClient(mongoURI);

client.connect().then(() => {
    const db = client.db();
    setDB(db);
    console.log('Connected to Mongo');

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
});