//Robert Melena

import axios from "axios";

const url = "https://openlibrary.org";

export async function searchByKeyword(keyword) {
  const response = await axios.get(`${url}/search.json`, {
    params: { q: keyword, limit: 10 },
  });

  return response.data.docs.map((book) => ({
    title: book.title,
    author: book.author_name ? book.author_name[0] : "Unknown",
    id: book.key,
  }));
}

export async function getDetailedById(id) {
  const response = await axios.get(`${url}${id}.json`);

  return {
    title: response.data.title,
    description:
      response.data.description?.value ||
      response.data.description ||
      "No description available",
    subjects: response.data.subjects ? response.data.subjects.slice(0, 5) : [],
  };
}
