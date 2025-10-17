import React from 'react'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <div className="w-full h-[100vh]">
    <div className="w-full h-[12vh] flex justify-center items-center">
        <Navbar />
    </div>
    <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
    </div>
  )
}
