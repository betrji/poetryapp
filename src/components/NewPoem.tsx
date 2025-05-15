import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ImageCapture from './ImageCapture';
import type { NewPoemProps, FormData } from '../types';

function NewPoem({ addPoem, poems, updatePoem }: NewPoemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    image: null
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editPoemId = searchParams.get('edit');
    
    if (editPoemId && poems) {
      const poemToEdit = poems.find(poem => poem.id.toString() === editPoemId);
      
      if (poemToEdit) {
        setIsEditing(true);
        setEditId(poemToEdit.id);
        setFormData({
          title: poemToEdit.title || '',
          content: poemToEdit.content || '',
          image: poemToEdit.image || null
        });
      }
    }
  }, [location.search, poems]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageCapture = (imageData: string | null) => {
    setFormData(prev => ({
      ...prev,
      image: imageData
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && editId) {
      const updatedPoem = {
        id: editId,
        title: formData.title,
        content: formData.content,
        image: formData.image,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      
      updatePoem(updatedPoem);
    } else {
      const newPoem = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        image: formData.image,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      
      addPoem(newPoem);
    }
    
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <header className="text-center mb-8 fuji-header fade-in">
        <h1 className="text-5xl font-bold mb-3 japanese-heading font-heading text-pink-800">
          {isEditing ? 'Edit Poem' : 'Create New Poem'}
        </h1>
        <p className="text-lg text-gray-600 mt-4 font-body">
          {isEditing 
            ? 'Refine your poetic expression' 
            : 'Let your imagination paint with words'}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="glassmorphic-card p-10 fade-in-delay-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="modern-input peer"
                placeholder=" "
                autoComplete="off"
              />
              <label htmlFor="title" className="modern-label">
                Title your masterpiece
              </label>
            </div>

            <div className="relative">
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={12}
                className="modern-input peer min-h-[300px] resize-none"
                placeholder=" "
              ></textarea>
              <label htmlFor="content" className="modern-label">
                Write your poem
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/40 rounded-2xl p-6 shadow-inner">
              <ImageCapture 
                onImageCapture={handleImageCapture} 
                initialImage={formData.image}
              />
            </div>

            <div className="bg-white/40 rounded-2xl p-6">
              <h3 className="text-lg font-handwriting text-pink-700 mb-3">
                Writing Tips
              </h3>
              <ul className="space-y-2 text-gray-600 font-body">
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">✿</span>
                  Express your emotions freely
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">✿</span>
                  Use vivid imagery
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-500">✿</span>
                  Play with rhythm and flow
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-pink-100">
          <Link 
            to="/" 
            className="modern-action-btn bg-white text-pink-500 border-pink-200 hover:bg-pink-50"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            className="modern-action-btn bg-pink-500 text-white border-pink-500 hover:bg-pink-600"
            disabled={!formData.title || !formData.content}
          >
            {isEditing ? 'Update Poem' : 'Save Poem'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewPoem;