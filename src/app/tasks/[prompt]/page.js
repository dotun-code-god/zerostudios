
import axios from 'axios';
import Task from '@/app/components/Task';

export default function Tasks({ params }) {
    const { prompt } = params;

    return (
        <>
            <Task prompt={prompt}/>
        </>
    )
}