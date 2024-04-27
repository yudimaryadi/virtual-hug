import React from 'react';
import { useEffect, useState } from 'react';
import '../style/globals.css';
import supabase from '@/utils/supabaseClient';
import Image from 'next/image';

export default function Home() {
  const [hugs, setHugs] = useState([]);
  const [newHug, setNewHug] = useState('');
  const [name, setName] = useState('');

  const handleAddHug = async () => {
    if (newHug.trim() !== '' && name.trim() !== '') {
      const { data, error } = await supabase
        .from('hugs')
        .insert([
          { sender: name, message: newHug }
        ]);

      if (error) {
        console.error('Error inserting data', error);
      } else {
        window.location.reload();
      }
      setNewHug('');
      setName('');
    }
  };

  useEffect(() => {
    const fetchHugs = async () => {
      const { data, error } = await supabase
        .from('hugs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching hugs:', error);
      } else {
        setHugs(data || []); // Ensure data is always an array, even when null
      }
    };

    fetchHugs();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: 'url("/assets/bg.jpg")', // Asumsi gambar berada di folder public/assets
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
        Virtual Hugs to Pak Eko
      </h1>

      {/* <div className="mb-6">
        <Image
          src="/assets/pass.jpg" // Assuming the image is in the public/assets folder
          alt="Passport Photo"
          width={300} // Set the width as needed
          height={100} // Set the height as needed
          objectFit="cover" // Adjust as necessary to match your design needs
        />
      </div> */}

      <div className="bg-gradient-to-br from-teal-300 to-light-blue-500 w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-wrap mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            className="flex-grow w-full sm:w-auto mr-3 p-2 border-b-2 border-blue-300 focus:border-blue-500 outline-none transition duration-300"
          />
          <input
            type="text"
            value={newHug}
            onChange={(e) => setNewHug(e.target.value)}
            placeholder="Ucapan Semoga Cepat Sembuh"
            className="flex-grow w-full sm:w-auto p-2 border-b-2 border-green-300 focus:border-green-500 outline-none transition duration-300"
          />
          <button onClick={handleAddHug} className="w-full sm:w-auto mt-2 sm:mt-0 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">
            Send
          </button>
        </div>
        <div className="w-full max-w-3xl p-8 bg-gradient-to-br from-light-blue-500 to-teal-300 rounded-lg shadow-lg overflow-auto" style={{ maxHeight: '500px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hugs.map(hug => (
              <div key={hug.id} className="bg-white rounded-lg shadow-lg p-6 mb-4">
                <h3 className="text-lg text-gray-800 mb-2">{hug.message}</h3>
                <p className="text-xs text-gray-600">By: {hug.sender}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
