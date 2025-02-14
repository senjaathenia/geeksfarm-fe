// service/event/index.js

import { apiAuthed } from "../api";

const addEvent = async (title, description, typeID, categories) => {
  return await apiAuthed.post("/events", {
    title,
    description,
    type_id: typeID,
    categories, // Array of category IDs
  });
};

const updateEvent = async (id, title, description, typeID, categories) => {
  return await apiAuthed.put(`/update-events/${id}`, {
    title,
    description,
    type_id: typeID,
    categories, // Array of category IDs
  });
};

const deleteEvent = async (id) => {
  return await apiAuthed.delete(`/delete-events/${id}`);
};

const getEvents = async (page, limit, keyword) => {
  return await apiAuthed.get("/get-events", {
    params: { pages: page, limit, keyword },
  });
};

const getEventById = async (id) => {
  return await apiAuthed.get(`/events/${id}`);
};

export { addEvent, updateEvent, deleteEvent, getEvents, getEventById };
