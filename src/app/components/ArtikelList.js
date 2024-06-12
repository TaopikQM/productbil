import React, { useState, useEffect } from 'react';
import { ref, onValue, remove, child, getDatabase, update } from 'firebase/database';
import { rtdb, storage } from '../config/firebase';
import { getDownloadURL, ref as storageRef, deleteObject, uploadBytes } from 'firebase/storage';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { useHistory } from'react-router-dom';

const ArtikelList = ({ navigateToReviewPage}) => {
  const [places, setPlaces] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newData, setNewData] = useState({});
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
 
 
  useEffect(() => {
    const placesRef = ref(rtdb, 'artikel_B');
    onValue(placesRef, (snapshot) => {
      const data = snapshot.val();
      const placesArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setPlaces(placesArray);
    });
  }, []);

  useEffect(() => {
    setImageUrls(newData.imageUrls || []);
  }, [newData]);

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    update(ref(rtdb, `artikel_B/${id}`), { status: newStatus });
  };

  const deletePlace = (id) => {
    const placeRef = ref(rtdb, `artikel_B/${id}`);
    remove(placeRef);
  };

 

  const openEditModal = (place) => {
    setNewData(place);
    setSelectedPlaceId(place.id);
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewData({ ...newData, [name]: files });
  };

  const saveEdit = async () => {
    const placeRef = ref(rtdb, `artikel_B/${selectedPlaceId}`);
    const updates = { ...newData };
    if (newData.images) {
      const imageUrls = await Promise.all(
        Array.from(newData.images).map(async (image) => {
          const imageRef = storageRef(storage, `artikel_B/${selectedPlaceId}/${image.name}`);
          await uploadBytes(imageRef, image);
          return getDownloadURL(imageRef);
        })
      );
      updates.imageUrls = imageUrls;
    }

    
    update(placeRef, updates);
    setEditModalOpen(false);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
           <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">createdAt</th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {places.map((place) => (
            <tr key={place.id}>
              
              <td className="px-6 py-4 whitespace-nowrap max-w-xs">
              <div>
                  {place.imageUrls && place.imageUrls.map((imageUrl, index) => (
                      <div key={index} className="relative">
                          <img src={imageUrl} alt={`Image ${index + 1}`} className="h-max-30 w-40 rounded-lg" />
                          
                      </div>
                  ))}
                </div>

              </td>
              <td className="px-6 py-4 whitespace-normal max-w-xs text-sm font-medium text-gray-900">
                <div className="text-sm text-gray-900">{place.name}</div>
               </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {place.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {place.createdAt}
              </td>
             
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <button onClick={() => openEditModal(place)} className="text-indigo-600 hover:text-indigo-900 ml-4">Edit</button>
                <button onClick={() => deletePlace(place.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Artikel</h3>
                  <div className="mt-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" id="name" name="name" value={newData.name || ''} onChange={handleEditChange} placeholder="Enter place name" className="mb-2 border p-2 rounded w-full" />
                      
                    
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <input type="text" id="description" name="description" value={newData.description || ''} onChange={handleEditChange} placeholder="Enter description" className="mb-2 border p-2 rounded w-full" />
                      
                     

                      <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images</label>
                      <input type="file" id="images" name="images" onChange={handleFileChange} multiple className="mb-2 border p-2 rounded w-full" />
                      
                     </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={saveEdit} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm">Save</button>
                <button onClick={() => setEditModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtikelList;
