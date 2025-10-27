import {useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
import NotesNotFound from '../components/NotesNotFound';
import { type Note } from '../types';
import {isAxiosError} from 'axios';

const HomePage = () => {
    const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchNotes = async () => {
            
            try {
                const response = await api.get('/notes');
                console.log(response.data);
                setNotes(response.data);
                setIsRateLimited(false);
            } catch (error: unknown ) { //we always want to check type of error in catch block, and use then type guarding example

                console.log(error);
                
                if (isAxiosError(error)) {
                    if (error.status === 429) {
                        setIsRateLimited(true);
                    }
                }

                toast.error('Failed to load notes');
                
            } finally {
                setLoading(false);
            }

        }
        fetchNotes();
    }, [])

    return (
    
        <div className='min-h-screen'>
            <Navbar/>

            {isRateLimited && <RateLimitedUI/>}
            <div className='max-w-7xl mx-auto p-4 mt-6'>
                {loading && (<div className='text-center text-primary py-10'>
                    Loading notes...<span className="loading loading-infinity loading-xl"></span>
                    </div>)}

                {notes.length == 0 && !isRateLimited && <NotesNotFound/>}

                {notes.length > 0 && !isRateLimited && (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {notes.map(note => (
                            <NoteCard key={note._id} note={note} setNotes={setNotes}/>
                        ))}
                    </div>)}
            </div>
        </div>
    )
}

export default HomePage;