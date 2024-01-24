"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const Task = ({prompt}) => {
    // const [patientsRecords, setPatientsRecord] = useState([]);
    let patientsRecords = [];
    const [tasks, setTasks] = useState(null);

    useEffect(() => {
        const fetchPatientsRecords = async () => {
            await axios.get("/tasks/api")
                .then(res => {
                    processPatientsRecords(res.data)
                    if(patientsRecords.length > 0){
                        processList(prompt, patientsRecords);
                    }
                })
                .catch(err => {
                    console.log(err.message)
                })
        }

        fetchPatientsRecords();
    }, []);

    const processPatientsRecords = (records) => {
        let index = 1;
        while (index < records[0].length) { // assuming the first item in the records represents the id and are all complete
            const formattedRecords = {};
            for (let i = 0; i < records.length; i++) {
                const recordData = records[i];
                if (recordData.length > 1) {
                    formattedRecords[recordData[0]] = recordData[index];
                }
            }
            index++;
            patientsRecords.push(formattedRecords)
        }
    }

    const processList = async (prompt, patientsRecords) => {
        const careGapsInstruction = "Identify high-priority care-gaps for these patients and return result in form of a JSON stringified array of objects only containing the caregap action required, patient name and priority:"

        const assistantMessage = {
            role: "assistant",
            content: `Data: ${JSON.stringify(patientsRecords)}`
        }

        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: `${careGapsInstruction}` },
                { role: "user", content: `Prompt: ${prompt}` },
                assistantMessage
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then(data => {
            return data.json();
        }).then(data => {
            const generatedResult = data.choices && data.choices[0].message.content;
            // setAIResult(data);
            console.log(generatedResult);
            setTasks(JSON.parse(generatedResult))
        })

    }

    useEffect(() => {
        setTasks(tasks)
    }, [tasks])

  return (
    <div>
        <div className="bg-white w-full h-16 shadow-md relative flex items-center gap-3 md:pl-8 pl-4">
            <Link href={"/"}>
                <Image
                    src='/images/logo.png'
                    width={40}
                    height={40}
                    alt="Company Logo"
                />
            </Link>
            <span className="bg-[rgb(176,183,195,0.51)] h-[calc(100%-2rem)] w-[0.2rem]"></span>
            <p className="text-[rgb(114,118,126)] text-xl">Tasks</p>
        </div>
        <div className='mt-3 px-5'>
              <h1 className='text-[rgb(114,118,126)] '>Below are the tasks generated from your prompt - {prompt.replace(/%20/g, " ")}</h1>
              <div className='w-full mt-10 px-15'>
                {
                    tasks ? tasks.map((task, index) => {
                        return (
                            <div key={index} className='flex items-center justify-between '>
                                <p className='text-center'>{task?.Action || task?.careGapAction || task?.careGap || task?.action || task?.caregap || task?.CareGap || task?.caregapAction || task?.CareGapAction}</p>
                                <p className='text-center'>{task?.Name || task?.patientName || task?.name || task?.Patient}</p>
                                <p className='text-center'>{task?.Priority || task?.priority}</p>
                            </div>
                        )
                    }) : (
                        <p>Please wait, while we generate your response</p>
                    )
                }
              </div>
        </div>
    </div>
  )
}

export default Task