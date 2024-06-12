
"use client";

import React, { useState } from 'react';

import ContainerAw from '../components/containerAw';

import AddProduct from '../components/AddProduct';

import ProductList from '../components/ProductList';
import Navbar from '../components/Navbar';


const addproductbtn = () => {

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
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={toggleForm}>Add Product</button>
            </div>
            {showForm && <AddProduct />}
            <br/>
          
        <ProductList/>
        </ContainerAw>
   </div>
  );
};

export default addproductbtn;
