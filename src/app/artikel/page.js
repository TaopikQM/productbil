
"use client";

import React, { useState } from 'react';

import ContainerAw from '../components/containerAw';

import Navbar from '../components/Navbar';


import AddArtikel from '../components/AddArtikel';

import ArtikelList from '../components/ArtikelList';

const addArtikel= () => {

    const [showForm, setShowForm] = useState(false);

  const toggleForm = ({ Component, pageProps }) => {
    setShowForm(!showForm);
  };
  // Your component logic here
  return (
    
     <div>
     <Navbar/>
        <ContainerAw>

            <div className="flex items-center justify-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={toggleForm}>Add Artikel</button>
            </div>
            {showForm && <AddArtikel />}
            <br/>
          <ArtikelList/>
       
        </ContainerAw>
   </div>
  );
};

export default addArtikel;
