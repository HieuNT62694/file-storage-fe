// utils/api.ts
import axios from 'axios';

const API_BASE_URL = 'https://file-storage-api.stage.pnj.io';

export const uploadFile = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const retrieveFile = async (filename: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/files/${filename}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (filename: string): Promise<any> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/files/${filename}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFileList = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/files/list`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
