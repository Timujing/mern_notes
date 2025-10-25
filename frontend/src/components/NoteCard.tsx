import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';
import { formatDate } from '../lib/utils.tsx';
import api from '../lib/axios.tsx';
import toast from 'react-hot-toast';

const NoteCard = ({note, setNotes}) => {

  const handleDelete = async (e, id) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await api.delete(`/notes/${note._id}`);

      setNotes((prevNotes) => prevNotes.filter(note => note._id !== id));
      
      if (response.status == 200) {
        toast.success('note deleted!');
      }

    } catch (error) {
      console.log("error to delete", error);
      toast.error('something went wrong');
    }
  };
  
  return (
    <Link to={`/note/${note._id}`}
      className='card bg-base-200 hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-200 border-t-4 border-solid border-[var(--color-primary)]'
    >
      <div className='card-body'>
        <h3 className='card-title text-base-content'>{note.title}</h3>
        <p className='text-base-content/70 line-clamp-3'>{note.content}</p>
        <div className='card-actions justify-between'>
          <span className='text-sm text-base-content/60'>
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className='flex items-center gap-1'>
            <PenSquareIcon className='size-4'/>
            <button className='btn btn-soft btn-xs text-error' onClick={(e) => handleDelete(e, note._id)}>
              <Trash2Icon className="size-4"/>
            </button>
          </div>
        </div>
        
      </div>
    </Link>
  )
}

export default NoteCard