// app.js

import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { searchByKeyword, getDetailedById } from "./api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HISTORY_FILE = path.join(__dirname, "search_history.json");

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function loadSearchHistory() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      return [];
    }

    const fileContents = fs.readFileSync(HISTORY_FILE, "utf8").trim();

    if (!fileContents) {
      return [];
    }

    const parsed = JSON.parse(fileContents);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading search_history.json. Using empty history.");
    return [];
  }
}

function saveSearchHistory(history) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving search history:", error.message);
  }
}

function saveKeywordIfUnique(keyword) {
  const cleanedKeyword = keyword.trim();

  if (!cleanedKeyword) {
    return;
  }

  const history = loadSearchHistory();

  const alreadyExists = history.some(
    (item) => item.toLowerCase() === cleanedKeyword.toLowerCase()
  );

  if (!alreadyExists) {
    history.push(cleanedKeyword);
    saveSearchHistory(history);
  }
}

function displaySearchResults(results) {
  console.log("\nSearch Results:");
  console.log("===============");

  results.forEach((book, index) => {
    console.log(
      `${index + 1}. ${book.title}\n   Author: ${book.author}\n   ID: ${book.id}\n`
    );
  });
}

function displayDetailedData(book) {
  console.log("\nDetailed Information:");
  console.log("=====================");
  console.log(`Title: ${book.title}`);
  console.log(`Description: ${book.description}`);

  if (book.subjects && book.subjects.length > 0) {
    console.log(`Subjects: ${book.subjects.join(", ")}`);
  } else {
    console.log("Subjects: No subjects available");
  }

  console.log();
}

async function promptUserToSelect(results) {
  const rl = createInterface();

  try {
    while (true) {
      const answer = await askQuestion(
        rl,
        `Select a book by number (1-${results.length}) or 0 to exit: `
      );

      const choice = Number(answer);

      if (!Number.isInteger(choice)) {
        console.log("Please enter a valid number.");
        continue;
      }

      if (choice === 0) {
        return null;
      }

      if (choice < 1 || choice > results.length) {
        console.log("Please choose a number within range.");
        continue;
      }

      return results[choice - 1];
    }
  } finally {
    rl.close();
  }
}

export async function runSearch(keyword) {
  try {
    if (!keyword || !keyword.trim()) {
      console.log("Please provide a keyword to search.");
      return;
    }

    saveKeywordIfUnique(keyword);

    const results = await searchByKeyword(keyword);

    if (!results || results.length === 0) {
      console.log(`No results found for "${keyword}".`);
      return;
    }

    displaySearchResults(results);

    const selectedBook = await promptUserToSelect(results);

    if (!selectedBook) {
      console.log("Exiting without selecting a book.");
      return;
    }

    const detailedData = await getDetailedById(selectedBook.id);
    displayDetailedData(detailedData);
  } catch (error) {
    console.error("Error during search:", error.message);
  }
}
