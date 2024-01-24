"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tasks from './Task';
import Image from 'next/image'
import { useRouter } from 'next/navigation';

export let patientsRecords = [];

const Prompt = () => {
    const [prompt, setPrompt] = useState("")
    const router = useRouter();

    const handlePromptBtnClick = () => {
        if (prompt) {
            router.push(`/tasks/${prompt}`)
        }
    }

    return (
        <div className="overflow-hidden bg-[url('/healthcare-assistant-bg.png')] h-screen w-full bg-no-repeat bg-cover relative before:absolute before:w-full before:h-full before:bg-[rgba(0,0,0,0.7)]">
            <div className="bg-white w-full h-16 shadow-md relative flex items-center gap-3 md:pl-8 pl-4">
                <Image
                    src='/images/logo.png'
                    width={40}
                    height={40}
                    alt="Company Logo"
                />
                <span className="bg-[rgb(176,183,195,0.51)] h-[calc(100%-2rem)] w-[0.2rem]"></span>
                <p className="text-[rgb(114,118,126)] text-xl">Zero Studios</p>
            </div>
            <div className="absolute z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-center">
                <h1 className="md:text-[10rem] sm:text-[7rem] text-[4rem] text-white font-bold tracking-tight leading-[1em]">Generate</h1>
                <p className="text-white font-bold md:text-[3.5rem] sm:text-[2.5rem] text-[1.4rem]">Patients Task List</p>
                <input value={prompt} onChange={(e) => setPrompt(e.target.value)} type="text" className="border-[0.1rem] border-gray-200 rounded-[50px] sm:h-20 h-16 max-w-[95%] md:w-[50rem] sm:w-[40rem] mx-auto px-5" placeholder="Enter a Prompt to see Tasks" />
                <button onClick={handlePromptBtnClick} className="bg-blue-600 block mx-auto text-white rounded-[50px] px-12 py-5 mt-5 hover:bg-blue-700 transition-colors duration-150">Prompt</button>
            </div>
        </div>
    )
}

export default Prompt