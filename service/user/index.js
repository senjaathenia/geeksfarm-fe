// service/user/index.js

import { apiAuthed } from "../api";

const addUser = async (name, email, roleID) => {
  return await apiAuthed.post("/register", {
    name,
    email,
    role_id: parseInt(roleID, 10),
  });
};

// Get User By ID
const getUserById = async (id) => {
  try {
    // Memastikan ID valid
    if (!id) {
      throw new Error("User ID is required");
    }

    // Memanggil API endpoint dengan ID
    const response = await apiAuthed.get(`/getbyid-users/${id}`);
    return response.data; // Mengembalikan data dari response
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error; // Lempar kembali error untuk penanganan di layer atas
  }
};

export const getUserByEmail = async (email) => {
  try {
    // Encode email dengan benar
    const encodedEmail = encodeURIComponent(email);
    
    // Pastikan menggunakan URL yang valid (termasuk domain dan protokol)
    const url = `http://localhost:8080/users/${encodedEmail}`;  // API URL lengkap

    // Menggunakan fetch untuk mendapatkan data pengguna
    const response = await fetch(url);
    
    // Jika tidak ada data pengguna ditemukan, response akan memiliki status 404
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      throw new Error('Internal server error');
    }

    // Jika pengguna ditemukan, return data pengguna
    return await response.json();
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;  // Menangani error dengan melemparnya kembali
  }
};


const updateUser = async (id, name, email, roleID) => {
  return await apiAuthed.put(`/users/${id}`, {
    name,
    email,
    role_id: parseInt(roleID, 10),
  });
};

const deleteUser = async (id) => {
  return await apiAuthed.delete(`/delete-users/${id}`);
};

const forgotPassword = async (id) => {
  return await apiAuthed.post(`/forgot-password/${id}`);
};

const getUsers = async (page, limit, keyword) => {
  return await apiAuthed.get("/get-users", {
    params: { pages: page, limit, keyword },
  });
};

// service/user/index.js

// Update status User berdasarkan ID
const updateStatus = async (id, status) => {
  try {
    // Memastikan ID dan status valid
    if (!id || !status) {
      throw new Error("ID and status are required");
    }

    // Memanggil API endpoint untuk memperbarui status pengguna
    const response = await apiAuthed.put(`/update-status/${id}`, {
      status, // Status yang ingin diperbarui
    });

    return response.data; // Mengembalikan data dari response
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error; // Lempar kembali error untuk penanganan di layer atas
  }
};

// Ekspor fungsi baru ini bersama fungsi lainnya
export { updateStatus, addUser, getUserById, updateUser, deleteUser, forgotPassword, getUsers, getUserByEmail };
