
"use client";

import React, { useState } from 'react';

import ContainerAw from '../components/containerAw';

import Navbar from '../components/Navbar';

import AddFiles from '../components/Addfiles';
import FilesList from '../components/FilesList';


const addFiles = () => {

    const [showForm, setShowForm] = useState(false);

  const toggleForm = ({ Component, pageProps }) => {
    setShowForm(!showForm);
  };
  // Your component logic here
  return (
    
     <div>
     <ContainerAw>

            <div className="flex items-center justify-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={toggleForm}>Add Files</button>
            </div>
            {showForm && <AddFiles />}
            <br/>
          <FilesList/>
       
        </ContainerAw>
     // <Navbar/>
     //    <ContainerAw>

     //        <div className="flex items-center justify-center">
     //            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={toggleForm}>Add Aksi</button>
     //        </div>
     //        {showForm && <AddAksi />}
     //        <br/>
     //      <AksiList/>
       
     //    </ContainerAw>
   </div>
  );
};

export default addFiles;
