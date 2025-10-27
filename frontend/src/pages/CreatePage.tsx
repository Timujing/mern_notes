import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate  } from 'react-router';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import {isAxiosError} from 'axios';

const CreatePage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData): Promise<void> => {
    
    const title = formData.get('title');
    const content = formData.get('content');
 
    if (typeof title !== 'string' || typeof content !== 'string') {
      toast.error('title and content are not string');
      console.log('for some reason title and content are not string');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      // https://github.com/axios/axios/blob/d000fbfd0722a9c3bd0bcea3451c6d515813635d/lib/defaults/index.js#L92 by default if payload is obj axios set headers 'apliaction/json' and automatically will use stringifySafely and return JSON.stringify(rawvalue);
      const response = await api.post('/notes', {title, content});

      if (response.status == 201) {
        
        toast.success("Note created!");

        navigate('/');
      }

    } catch (error: unknown) {
      console.log('error creating note', error);

      if (isAxiosError(error)) {        
        if (error.status == 429) {
          toast.error("Slow down! You're creating notes too fast", {
            duration: 4000,
            icon: "💀",
          });
          return;
        }        
      }

      toast.error('Failed to create note');
    } finally {
      setLoading(false)
    }

  };

  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <Link to={'/'} className='btn btn-soft mb-6'>
            <ArrowLeft className='size-5'/>
            Back to Notes
          </Link>
          <div className='card bg-base-100'>
            <div className='card-body'>
              <h2 className='card-title text-2xl mb-4'>Create new note</h2>

              <form action={handleSubmit}>
                <div className='mb-4'>
                  <label className='input'>
                    <span className='label'>Title</span>
                    <input type="text"
                      name="title"
                      placeholder='Note title'
                      defaultValue=''
                    />
                  </label>
                </div>

                <div className="mb-4">
                  <label htmlFor='content' className="label block">
                    <span>Content</span>
                  </label>
                  <textarea
                    placeholder="Write your content of note here..."
                    className="textarea h-32 lg:textarea-lg lg:min-w-xl sm:min-w-auto"
                    defaultValue=''
                    name="content"                    
                    id="content"
                  />
                </div>

                <div className="card-actions justify-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePage