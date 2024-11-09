import React, { useState, useEffect } from 'react';
import { getDatabase, ref as databaseRef, onValue } from 'firebase/database';
import { rtdb, storage } from '../config/firebase';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';

const FilesList2 = ({isDayMode}) => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // New date filter
 
  const [itemsPerPage, setItemsPerPage] = useState(30); // State for items per page
  const itemsPerPageOptions = [30, 50, 100];


  // Firebase setup
  useEffect(() => {
    const db = getDatabase();
    const filesRef = databaseRef(db, 'product_P');

    onValue(filesRef, (snapshot) => {
      const data = snapshot.val();
      const fileList = [];

      for (let id in data) {
        if (data[id].files && Array.isArray(data[id].files)) {
          data[id].files.forEach(file => {
            fileList.push({
              ...file,
              id,
            });
          });
        }
      }
      setFiles(fileList);
      setFilteredFiles(fileList);
    });
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = files;

    // Filter by year and month
    if (yearFilter) {
      filtered = filtered.filter(file => new Date(file.createdTime).getFullYear().toString() === yearFilter);
    }
    if (monthFilter) {
      filtered = filtered.filter(file => new Date(file.createdTime).getMonth().toString() === monthFilter);
    }

    // Filter by specific date
    if (dateFilter) {
      filtered = filtered.filter(file => new Date(file.createdTime).toDateString() === new Date(dateFilter).toDateString());
    }

    // Search filter (case insensitive)
    if (searchQuery) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFiles(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [files, searchQuery, yearFilter, monthFilter, dateFilter]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on items per page change
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const currentFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPagination = () => {
    let pages = [];
    if (totalPages <= 5) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 3) {
      pages = [1, 2, 3, 4, 5, '...'];
    } else if (currentPage >= totalPages - 2) {
      pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
    return pages;
  };

  return (
    <div className={isDayMode ? 'bg-white text-black' : 'bg-gray-800 text-white'}> {/* Tailwind for day/night mode */}
      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-4 p-4  text-black">
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full md:w-auto border-gray-300"
        />
       
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-2 border rounded w-full md:w-auto border-gray-300"
        />
       
      </div>

      {/* Total Filtered Files Display */}
      <div className="flex items-center  text-black">
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded px-2 py-1"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <div className="mt-4 text-sm text-gray-500">
            Total Files: {filteredFiles.length}
          </div>
        </div>

      {/* File Display */}
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {currentFiles.map((file, index) => (
          <div 
            key={index} 
            className={`border rounded-lg shadow p-4 text-center ${isDayMode ? 'bg-white' : 'bg-gray-800'} transition-colors duration-300`}
          >
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.type === 'image' ? (
                  <img src={file.url} alt={file.name} className="w-full h-32 object-cover mb-2 rounded" />
                ) : file.type === 'video' ? (
                  <video controls src={file.url} className="w-full h-32 mb-2 rounded" />
                ) : (
                  <div className={`h-32 flex items-center justify-center ${isDayMode ? 'bg-gray-100' : 'bg-gray-700'} rounded`}>
                    📄 {file.name}
                  </div>
                )}
                 </a>
          </div>
        ))}
      </div>


      {/* Pagination */}
      {filteredFiles.length > itemsPerPage && (
        <nav className="flex justify-between items-center mt-4" aria-label="Table navigation">
          <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
          <ul className="inline-flex  text-black items-center space-x-1">
            <li>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-4 py-2 border rounded-l-lg border-gray-300"
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {getPagination().map((page, idx) => (
              <li key={idx}>
                {page === '...' ? (
                  <span className="px-4 py-2">...</span>
                ) : (
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border ${currentPage === page ? 'bg-gray-200' : 'border-gray-300'}`}
                  >
                    {page}
                  </button>
                )}
              </li>
            ))}
            <li>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 border rounded-r-lg border-gray-300"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default FilesList2;
