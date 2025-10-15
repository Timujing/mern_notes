import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const {id} = useParams(); //get id from path

  useEffect(() => {

    const fetchNote = async () => {
      try {
        const response = await api.get(`/notes/${id}`);
        setNote(response.data);
        
      } catch (error) {
        
          console.log("error in fetching note", error);
          toast.error('something went wrong');
        
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await api.delete(`/notes/${id}`);
      toast.success('note deleted!');
      navigate('/');
    } catch (error) {
      
      console.log("error to delete", error);
      toast.error('something went wrong');
    
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success('note updated!');
      
    } catch (error) {
      console.log("error to update note", error);
      toast.error('something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-base-200 flex items-center justify-center'>
        <LoaderIcon className='animate-spin size-10'/>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-4 py-8'>
        <div className="max-w-2xl mx-auto">

          <div className='flex items-center justify-between mb-6'>
            <Link to={'/'} className='btn btn-soft'>
              <ArrowLeftIcon className='h-5 w-5'/>Back to Notes
            </Link>

            <button onClick={handleDelete} className='btn btn-outline btn-error'>
              <Trash2Icon className='h-5 w-5'/>DeleteNote
            </button>
          </div>

          <div className='card bg-base-100'>
            <div className='card-body'>
              <div className='mb-4'>
                <label className='input'>
                  <span className='label'>Title</span>
                  <input type="text" 
                    name="title"
                    placeholder='Note title'
                    value={note.title}
                    onChange={(e) => setNote({...note, title: e.target.value})}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label htmlFor='content' className="label block">
                  <span>Content</span>
                </label>
                <textarea
                  value={note.content}
                  className="textarea h-32 lg:textarea-lg lg:min-w-xl sm:min-w-auto"
                  name="content"
                  onChange={(e) => setNote({...note, content: e.target.value})}
                  id="content"
                />
              </div>

              <div className='card-actions justify-end'>
                <button className='btn btn-primary' disabled={saving} onClick={handleSave}>
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default NoteDetailPage