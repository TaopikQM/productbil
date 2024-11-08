import React, { useState } from 'react';
import { storage, rtdb } from '../config/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as databaseRef, push, set } from "firebase/database";

const AddF = () => {
  const [uploadType, setUploadType] = useState("files"); // "files" or "folder"
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileNames, setFileNames] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    files.forEach(file => {
      setFileNames(prevFileNames => ({
        ...prevFileNames,
        [file.webkitRelativePath || file.name]: file.name // Default name
      }));
    });
  };

  const handleNameChange = (e, filePath) => {
    const newName = e.target.value;
    setFileNames(prevFileNames => ({
      ...prevFileNames,
      [filePath]: newName
    }));
  };

  const removeFile = (filePath) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => (file.webkitRelativePath || file.name) !== filePath));
    setFileNames(prevFileNames => {
      const newFileNames = { ...prevFileNames };
      delete newFileNames[filePath];
      return newFileNames;
    });
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files or a folder to upload.');
      return;
    }

    setIsLoading(true);

    try {
      const newEntryRef = push(databaseRef(rtdb, 'product_P'));
      const newEntryKey = newEntryRef.key;

      const uploadPromises = selectedFiles.map(async (file) => {
        const filePath = file.webkitRelativePath || file.name;
        const fileRef = storageRef(storage, `product_P/${newEntryKey}/${filePath}`);
        
        const snapshot = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const currentDate = new Date();
        const jakartaOffset = 7 * 60 * 60 * 1000;
        const jakartaTime = new Date(currentDate.getTime() + jakartaOffset).toISOString();

        return {
          name: fileNames[filePath],
          url: downloadURL,
          createdTime: jakartaTime,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      await set(newEntryRef, {
        files: uploadedFiles,
      });

      alert('Files uploaded successfully!');
      setSelectedFiles([]);
      setFileNames({});
      window.location.reload();
    } catch (error) {
      console.error("Error uploading files:", error);
      alert('Error uploading files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <div className="flex flex-col items-center justify-center text-black p-6">
  <h2 className="text-2xl font-semibold mb-4">Upload Files or Folder</h2>

  {/* Toggle between File and Folder Upload */}
  <label className="mb-2">
    Select Upload Type:
    <select
      onChange={(e) => setUploadType(e.target.value)}
      value={uploadType}
      className="ml-2 border border-gray-300 rounded p-1"
    >
      <option value="files">Files</option>
      <option value="folder">Folder</option>
    </select>
  </label>

  {/* File/Folder Input */}
  <input
    type="file"
    multiple={uploadType === "files"}
    webkitdirectory={uploadType === "folder" ? "true" : undefined}
    onChange={handleFileChange}
    className="mt-4 border border-gray-300 rounded p-2 w-full max-w-md"
  />

  {/* Selected Files Preview */}
  <div className="mt-4 w-full max-w-md">
    {selectedFiles.map((file) => (
      <div key={file.webkitRelativePath || file.name} className="flex items-center justify-between border-b py-2">
        <span className="flex-1 text-gray-800">{file.webkitRelativePath || file.name}</span>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Enter file name"
          value={fileNames[file.webkitRelativePath || file.name] || ""}
          onChange={(e) => handleNameChange(e, file.webkitRelativePath || file.name)}
          className="border border-gray-300 rounded p-1 ml-2 flex-1"
        />

        {/* Remove Button */}
        <button
          onClick={() => removeFile(file.webkitRelativePath || file.name)}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          X
        </button>
      </div>
    ))}
  </div>

  {/* Submit Button */}
  <button
    type="button"
    onClick={handleSubmit}
    disabled={isLoading}
    className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    {isLoading ? "Adding..." : "Add"}
  </button>
</div>

  );
};

export default AddF;
