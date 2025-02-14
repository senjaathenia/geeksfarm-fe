import { apiAuthed } from "../api";

const addTestimoni = async (name, title, deskripsi, media) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("title", title);
  formData.append("deskripsi", deskripsi);
  if (media) {
    formData.append("media", media);
  }

  return await apiAuthed.post("/testimoni", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const updateTestimoni = async (id, name, title, deskripsi, media) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("title", title);
  formData.append("deskripsi", deskripsi);
  if (media) {
    formData.append("media", media);
  }

  return await apiAuthed.put(`/update-testimoni/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const deleteTestimoni = async (id) => {
  return await apiAuthed.delete(`/delete-testimoni/${id}`);
};

const getTestimoni = async (page, limit, keyword) => {
  return await apiAuthed.get("/get-testimoni", {
    params: { page, limit, keyword },
  });
};

export { addTestimoni, updateTestimoni, deleteTestimoni, getTestimoni };
