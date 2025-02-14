// service/Categories/index.js

import { apiAuthed } from "../api";

const addCategories = async (name) => {
  return await apiAuthed.post("/Categoriess", {
    name,
  });
};

const updateCategories = async (id, name) => {
  return await apiAuthed.put(`/categories/${id}`, {
    name,
  });
};

const deleteCategories = async (id) => {
  return await apiAuthed.delete(`/delete-categories/${id}`);
};

const getCategories = async (page, limit, keyword) => {
  return await apiAuthed.get("/get-categories", {
    params: { pages: page, limit, keyword },
  });
};

export { addCategories, updateCategories, deleteCategories, getCategories };
