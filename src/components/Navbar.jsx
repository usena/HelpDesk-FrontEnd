import React from 'react'

const Navbar = () => {
  return (
    <div className='fixed top-0 left-0 right-0 h-16 flex justify-between items-center p-4 sm:p-2 sm:px-4 absolute top-0 left-0 z-50 bg-white shadow-md'>
        <button className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Login</button>
    </div>
  )
}

export default Navbar