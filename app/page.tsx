"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://file-storage-api.stage.pnj.io";

type DeleteButtonProps = {
  filename: string;
  refreshFileList: () => void;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({
  filename,
  refreshFileList,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.post(
        `${API_BASE_URL}/files/delete/${filename}`
      );
      setMessage(`File "${filename}" deleted successfully.`);
      console.log("File deleted:", filename);
      refreshFileList(); // Refresh file list after deletion
    } catch (error) {
      setMessage(`Error deleting file "${filename}".`);
      console.error("Error deleting file:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      <p className="text-red-500 ml-2">{message}</p>
    </div>
  );
};

const Home: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<string[]>([]);
  const [fileContent, setFileContent] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await axios.post(
          `${API_BASE_URL}/files/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setMessage("File uploaded successfully.");
        console.log("File uploaded:", response.data);
        retrieveFileList(); // Refresh file list after upload
      } else {
        setMessage("Please select a file to upload.");
      }
    } catch (error) {
      setMessage("Error uploading file.");
      console.error("Error uploading file:", error);
    }
  };

  const retrieveAndDownloadFile = async (filename: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/files/retrieve/${filename}`
      );
      setFileContent(response.data);
      const blob = new Blob([response.data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setMessage(`File "${filename}" retrieved and downloaded successfully.`);
    } catch (error) {
      setMessage(`Error retrieving and downloading file "${filename}".`);
      console.error("Error retrieving and downloading file:", error);
    }
  };

  const retrieveFileList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/files/list`);
      setFileList(response.data);
      setMessage("");
    } catch (error) {
      setMessage("Error retrieving file list.");
      console.error("Error retrieving file list:", error);
    }
  };

  useEffect(() => {
    retrieveFileList();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow-md">
        <h1 className="text-3xl font-semibold mb-6">File Management App</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Upload File</h2>
          <input
            type="file"
            className="border p-2 rounded text-gray-900"
            onChange={handleFileChange}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            onClick={handleUpload}
          >
            Upload File
          </button>
          <p className="text-red-500 mt-2">{message}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            Retrieve and Download File
          </h2>
          {fileList.length === 0 ? (
            <p>No files available.</p>
          ) : (
            <ul className="list-disc pl-6">
              {fileList.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between py-1 text-gray-900"
                >
                  {item}
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded ml-2"
                    onClick={() => retrieveAndDownloadFile(item)}
                  >
                    Retrieve & Download
                  </button>
                  <DeleteButton
                    filename={item}
                    refreshFileList={retrieveFileList}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
