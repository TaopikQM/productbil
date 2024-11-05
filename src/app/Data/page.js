
"use client";

import React, { useState } from 'react';

import ContainerAw from '../components/containerAw';
import Navbar from '../components/Navbar';
import AddFiles from '../components/AddFiles';
import FilesList from '../components/FilesList';

const addFiles = () => {
  const [showForm, setShowForm] = useState(false);
  const [isDayMode, setIsDayMode] = useState(true); // State for day/night mode

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleDayNightMode = () => {
    setIsDayMode(prev => !prev);
  };

  return (
    <div>
      <ContainerAw>
        <div className="flex items-center justify-between mb-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={toggleForm}>
            Add Files
          </button>
          <button 
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" 
            onClick={toggleDayNightMode}
          >
            {isDayMode ? 'Switch to Night Mode' : 'Switch to Day Mode'}
          </button>
        </div>
        
        {showForm && <AddFiles />}
        <br />
        <FilesList isDayMode={isDayMode} /> {/* Pass isDayMode prop */}
      </ContainerAw>
    </div>
  );
};

export default addFiles;

// "use client";

// import React, { useState } from 'react';

// import ContainerAw from '../components/containerAw';

// import Navbar from '../components/Navbar';

// import AddFiles from '../components/AddFiles';
// import FilesList from '../components/FilesList';


// const addFiles = () => {

//     const [showForm, setShowForm] = useState(false);

//   const toggleForm = ({ Component, pageProps }) => {
//     setShowForm(!showForm);
//   };
//   // Your component logic here
//   return (
    
//      <div>
//      <ContainerAw>

//             <div className="flex items-center justify-center">
//                 <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={toggleForm}>Add Files</button>
//             </div>
//             {showForm && <AddFiles />}
//             <br/>
//           <FilesList/>
       
//         </ContainerAw>
   
//    </div>
//   );
// };

// export default addFiles;
