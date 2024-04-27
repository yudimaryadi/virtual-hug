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
    <div className="min-h-screen flex flex-col items-center justify-center relative" style={{ width: '100vw' }}>

      {/* Background image */}
      <Image
        src="/assets/bg.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0"
      />

      {/* Semi-transparent overlay */}
      <div
        className='min-h-screen flex flex-col items-center justify-center relative'
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black
          zIndex: 1, // Ensure the overlay is above the background image but below the content
        }}
      >

        <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-3xl font-bold mb-6" style={{ color: "#f6f9eb" }}>
          Virtual Hugs for Pak Eko's Son
        </h3>

        <div className="w-full sm:max-w-3xl md:w-3xl lg:w-5xl p-8 rounded-lg shadow-lg" style={{ backgroundColor: "#c5d8d0", color: "#668b74" }}>
          <div className="flex flex-wrap mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="flex-grow w-full sm:w-auto mr-3 p-2 border-b-2 border-blue-300 focus:border-blue-500 outline-none transition duration-300"
            />
            <input
              type="text"
              value={newHug}
              onChange={(e) => setNewHug(e.target.value)}
              placeholder="Write your message"
              className="flex-grow w-full sm:w-auto p-2 border-b-2 border-green-300 focus:border-green-500 outline-none transition duration-300"
            />
            <button onClick={handleAddHug} className="w-full sm:w-auto mt-2 sm:mt-0 text-white font-bold py-2 px-4 rounded ml-2" style={{ backgroundColor: "#7d7a4b" }}>
              Send
            </button>
          </div>
          <div style={{ maxHeight: '200px', overflow: 'auto' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hugs.map(hug => (
                <div key={hug.id} style={{ backgroundColor: "#f6f9eb", color: "#8bb1a0" }} className="rounded-lg shadow-lg p-6 mb-4">
                  <h3 className="text-lg mb-2" style={{ color: "#585535" }}>{hug.message}</h3>
                  <p className="text-xs" style={{ color: "#585535" }}>Sender: {hug.sender}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
        <h3
          className="text-2xl sm:text-3xl md:text-3xl lg:text-3xl font-bold mt-6"
          style={{
            color: "#f6f9eb"
          }}>
          Thank you for your kindness and support.
        </h3>
      </div>
    </div>
  );
}
