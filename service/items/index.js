import { apiAuthed } from "../api";

const addItems = async (pointer, content) => {
  const formData = new FormData();
  formData.append("pointer", pointer);

  if (typeof content === "string") {
    formData.append("content", content); // Konten berupa teks
  } else if (content instanceof File) {
    formData.append("content", content); // Konten berupa file
  }

  return await apiAuthed.post("/items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const updateItems = async (id, pointer, content) => {
  const formData = new FormData();
  formData.append("pointer", pointer);

  if (typeof content === "string") {
    formData.append("content", content); // Konten berupa teks
  } else if (content instanceof File) {
    formData.append("content", content); // Konten berupa file
  }

  return await apiAuthed.put(`/update-items/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const deleteItems = async (id) => {
  return await apiAuthed.delete(`/delete-items/${id}`);
};

const getItems = async (page, limit, keyword) => {
  return await apiAuthed.get("/get-items", {
    params: { page, limit, keyword },
  });
};

export { addItems, updateItems, deleteItems, getItems };
