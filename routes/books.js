import express from 'express';
import { searchByKeyword, getDetailedById } from '../services/api.js';
import { getDB } from '../services/db.js';

const router = express.Router();

// GET /books?keyword=...
router.get('/', async (req, res) => {
    const { keyword } = req.query;

    if (!keyword) {
        return res.status(400).json({ error: 'keyword query parameter is required' });
    }

    try {
        const results = await searchByKeyword(keyword);

        // Return only a clean display name and a usable identifier
        const books = results.map(book => ({
            display: book.title,
            identifier: book.id.replace('/works/', '')
        }));

        // Save keyword to MongoDB only if it is not already stored
        const db = getDB();
        const collection = db.collection('SearchHistoryKeyword');

        const alreadySaved = await collection.findOne({ keyword: keyword.toLowerCase() });

        if (!alreadySaved) {
            await collection.insertOne({ keyword: keyword.toLowerCase() });
        }

        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'server error' });
    }
});

// GET /books/:id
// Example link for Harry Potter and the Philosopher's Stone
// https://openlibrary.org/works/OL82563W.json
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Reconstruct the full Open Library path that getDetailedById expects
        const book = await getDetailedById('/works/' + id);
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'server error' });
    }
});

export default router;
