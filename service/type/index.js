// service/type/index.js

import { apiAuthed } from "../api";

const addType = async (nameD) => {
  return await apiAuthed.post("/types", {
    name,
  });
};

const updateType = async (id, name) => {
  return await apiAuthed.put(`/types/${id}`, {
    name,
  });
};

const deleteType = async (id) => {
  return await apiAuthed.delete(`/delete-types/${id}`);
};

const getTypes = async (page, limit, keyword) => {
  return await apiAuthed.get("/get-types", {
    params: { pages: page, limit, keyword },
  });
};

export { addType, updateType, deleteType, getTypes };
