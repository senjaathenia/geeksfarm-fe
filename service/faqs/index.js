// service/Faqs/index.js

import { apiAuthed } from "../api";

const addFaqs = async (question, answer) => {
  return await apiAuthed.post("/faqs", {
    question,
    answer,
  });
};

const updateFaqs = async (id, question, answer) => {
  return await apiAuthed.put(`/faqs/${id}`, {
    question,
    answer
  });
};

const deleteFaqs = async (id) => {
  return await apiAuthed.delete(`/delete-faqs/${id}`);
};

const getFaqs = async (page, limit, keyword) => {
  return await apiAuthed.get("/get-faqs", {
    params: { pages: page, limit, keyword },
  });
};

export { addFaqs, updateFaqs, deleteFaqs, getFaqs };