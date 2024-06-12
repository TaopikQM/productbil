import React, { useState } from 'react';
import { storage, rtdb } from '../config/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as databaseRef, push, set, update } from "firebase/database";


const AddAksi = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Tambahkan state isLoading



  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Mulai proses upload
    try {
      const currentTime = new Date().toLocaleString();

      const newWisataRef = push(databaseRef(rtdb, 'aksi_B'));
      const newWisataKey = newWisataRef.key;

      const initialData = {
        name,
        
        description,
        
        imageUrls: [],
        status: "ACTIVE",
        createdAt: currentTime
      };

      await set(newWisataRef, initialData);

      console.log("Data saved to Realtime Database with key: ", newWisataKey);

      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const imageRef = storageRef(storage, `aksi_B/${newWisataKey}/${image.name}`);
          await uploadBytes(imageRef, image);
          const imageUrl = await getDownloadURL(imageRef);
          console.log(`Uploaded image: ${image.name}, URL: ${imageUrl}`);
          return imageUrl;
        })
      );


      // Here, using update instead of set to avoid overwriting the entire node
      await update(databaseRef(rtdb, `aksi_B/${newWisataKey}`), {
        imageUrls
      });

      setName('');
      
      setDescription('');
      setImages([]);
     
      setIsLoading(false); // Selesai upload
      alert("Place added successfully!"); 
      window.location.reload(); // Refresh the page
    } catch (error) {
        setIsLoading(false); // Selesai upload dengan kesalahan
      console.error("Error adding document: ", error);
      alert("Error adding place.");
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Aksi</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block h-9 w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
     
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block  h-9 w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>
      
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images</label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading} // Tambahkan properti disabled berdasarkan isLoading
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
         {isLoading ? "Adding..." : "Add Wisata"} {/* Ubah label tombol berdasarkan isLoading */}
     
        </button>

        {/* Tampilkan popup loading saat isLoading true */}
        {isLoading && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            )}
      </form>
  );
};

export default AddAksi;
