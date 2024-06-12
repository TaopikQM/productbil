import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState('/');

  const toggle = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <Link href="/" passHref>
          <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
            <img src="https://firebasestorage.googleapis.com/v0/b/dolanrek-f88ad.appspot.com/o/logo-awal%2FLogo.png?alt=media&token=f0ea354a-5ab3-480e-8af8-c703495d5433" className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Environment</span>
          </div>
        </Link>
       
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
            onClick={toggle}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        <div className={`items-center justify-between ${isOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link href="/product" passHref>
                <div className={`block py-2 px-3 rounded md:p-0 cursor-pointer ${activePage === '/product' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'}`} onClick={() => setActivePage('/product')}>
                  Product
                </div>
              </Link>
            </li>
            <li>
              <Link href="/aksi" passHref>
                <div className={`block py-2 px-3 rounded md:p-0 cursor-pointer ${activePage === '/aksi' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'}`} onClick={() => setActivePage('/aksi')}>
                  Aksi
                </div>
              </Link>
            </li>
            <li>
              <Link href="/artikel" passHref>
                <div className={`block py-2 px-3 rounded md:p-0 cursor-pointer ${activePage === '/artikel' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'}`} onClick={() => setActivePage('/artikel')}>
                  Artikel
                </div>
              </Link>
            </li>
            <li>
              <Link href="/komunitas" passHref>
                <div className={`block py-2 px-3 rounded md:p-0 cursor-pointer ${activePage === '/komunitas' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'}`} onClick={() => setActivePage('/komunitas')}>
                  Komunitas
                </div>
              </Link>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

