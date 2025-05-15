"use client";
import Image from "next/image";
import axios from 'axios';

import { useEffect } from 'react';
export default function Home() {
  useEffect(() => {
    const requestFun = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/items');
        console.log('the response', response);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    requestFun();
  }, []); 
 
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     <h1>Hello</h1>
     
    </div>
  );
}
