import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ImageCapture from './ImageCapture';

function NewPoem({ addPoem, poems, updatePoem }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });

  // Check if we're editing an existing poem
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageCapture = (imageData) => {
    setFormData(prev => ({
      ...prev,
      image: imageData
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing && editId) {
      // Update existing poem
      const updatedPoem = {
        id: editId,
        title: formData.title,
        content: formData.content,
        image: formData.image,
        // Preserve the original date or update it
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      
      updatePoem(updatedPoem);
    } else {
      // Create new poem
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
    
    // Navigate back to homepage
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <header className="text-center mb-8 fuji-header fade-in">
        <h1 className="text-4xl font-bold mb-3 text-pink-800 japanese-heading font-heading">
          {isEditing ? 'Edit Poem' : 'Create New Poem'}
        </h1>
        <p className="text-lg text-gray-600 mt-4 font-body">
          {isEditing ? 'Update your poem' : 'Express your thoughts and emotions through verse'}
        </p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="mx-auto glassmorphic-card p-10 fade-in-delay-1 flex flex-col gap-8">
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
            <label htmlFor="title" className="modern-label">Poem Title</label>
          </div>
          <div className="relative">
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="8"
              className="modern-input peer min-h-[160px] resize-vertical"
              placeholder=" "
            ></textarea>
            <label htmlFor="content" className="modern-label">Poem Content</label>
          </div>
          <div className="flex justify-center">
            <ImageCapture onImageCapture={handleImageCapture} initialImage={formData.image} />
          </div>
          <div className="flex justify-between mt-8 gap-4">
            <Link to="/" className="modern-action-btn bg-white text-pink-500 border-pink-200 hover:bg-pink-50">Cancel</Link>
            <button 
              type="submit" 
              className="modern-action-btn bg-pink-500 text-white border-pink-500 hover:bg-pink-600"
            >
              {isEditing ? 'Update Poem' : 'Save Poem'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default NewPoem; 