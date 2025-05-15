import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageCapture from './ImageCapture';
import type { Poem, FormData } from '../types';

function PoemEditor() {
  const navigate = useNavigate();
  const [poem, setPoem] = useState<FormData>({
    title: '',
    content: '',
    image: null
  });
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('poemDraft');
    if (savedDraft) {
      try {
        setPoem(JSON.parse(savedDraft));
        setLastSaved(new Date().toLocaleTimeString());
      } catch (e) {
        console.error('Error loading draft:', e);
      }
    }
  }, []);

  // Auto-save draft to localStorage when poem changes
  useEffect(() => {
    if (autoSaveEnabled && (poem.title || poem.content || poem.image)) {
      const saveTimer = setTimeout(() => {
        localStorage.setItem('poemDraft', JSON.stringify(poem));
        setLastSaved(new Date().toLocaleTimeString());
      }, 2000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [poem, autoSaveEnabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPoem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageCapture = (imageData: string | null) => {
    setPoem(prev => ({
      ...prev,
      image: imageData
    }));
  };

  const savePoem = () => {
    // Load existing poems from localStorage
    let poems: Poem[] = [];
    try {
      const savedPoems = localStorage.getItem('poems');
      if (savedPoems) {
        poems = JSON.parse(savedPoems);
      }
    } catch (e) {
      console.error('Error loading saved poems:', e);
    }
    
    // Add the new poem with current date
    const newPoem: Poem = {
      ...poem,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    
    poems.push(newPoem);
    
    // Save back to localStorage
    localStorage.setItem('poems', JSON.stringify(poems));
    
    // Clear draft
    localStorage.removeItem('poemDraft');
    
    // Navigate back to home
    navigate('/');
  };

  const clearDraft = () => {
    if (window.confirm('Are you sure you want to discard this draft?')) {
      localStorage.removeItem('poemDraft');
      setPoem({ title: '', content: '', image: null });
      setLastSaved(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <header className="text-center mb-6 fuji-header fade-in">
        <h1 className="text-4xl font-bold mb-2 japanese-heading font-heading text-pink-800">Poem Editor</h1>
        <p className="text-lg text-gray-600 mt-4 font-body">Create and edit your poems</p>
      </header>
      <form className="glassmorphic-card p-10 fade-in-delay-1 flex flex-col gap-7" style={{margin: '0 auto', maxWidth: 700}}>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 flex flex-col gap-3">
            <label htmlFor="title" className="block text-pink-700 text-base font-medium font-heading">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={poem.title}
              onChange={handleChange}
              className="modern-input"
              placeholder="Enter a title for your poem"
              autoComplete="off"
            />
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <label htmlFor="content" className="block text-pink-700 text-base font-medium font-heading">Your Poem</label>
            <textarea
              id="content"
              name="content"
              value={poem.content}
              onChange={handleChange}
              rows={8}
              className="modern-input min-h-[120px] resize-vertical"
              placeholder="Express your thoughts and feelings through poetry..."
            ></textarea>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 flex flex-col items-center">
            <ImageCapture onImageCapture={handleImageCapture} initialImage={poem.image} />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                className="sr-only peer"
              />
              <div className="relative w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500"></div>
              <span className="ms-2 text-sm font-medium text-gray-600 font-body">Auto-save</span>
            </label>
            {lastSaved && (
              <span className="text-xs text-gray-500 italic font-body">Last saved: {lastSaved}</span>
            )}
            <button 
              onClick={clearDraft}
              className="primary-action-btn text-base mt-2"
              type="button"
            >
              Clear draft
            </button>
          </div>
        </div>
        <div className="flex justify-between gap-4 mt-4">
          <button
            onClick={() => navigate('/')}
            className="primary-action-btn text-base"
            type="button"
          >
            Cancel
          </button>
          <button 
            onClick={savePoem}
            disabled={!poem.title || !poem.content}
            className="primary-action-btn text-base"
            type="button"
          >
            Save Poem
          </button>
        </div>
      </form>
    </div>
  );
}

export default PoemEditor;