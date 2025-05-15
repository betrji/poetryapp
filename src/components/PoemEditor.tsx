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
  const [isSaving, setIsSaving] = useState(false);

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
        setIsSaving(false);
      }, 2000);
      
      setIsSaving(true);
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
    let poems: Poem[] = [];
    try {
      const savedPoems = localStorage.getItem('poems');
      if (savedPoems) {
        poems = JSON.parse(savedPoems);
      }
    } catch (e) {
      console.error('Error loading saved poems:', e);
    }
    
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
    localStorage.setItem('poems', JSON.stringify(poems));
    localStorage.removeItem('poemDraft');
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
    <div className="max-w-4xl mx-auto px-4">
      <header className="text-center mb-8 fuji-header fade-in">
        <h1 className="text-5xl font-bold mb-3 japanese-heading font-heading text-pink-800">
          Poem Editor
        </h1>
        <p className="text-lg text-gray-600 mt-4 font-body">
          Let your creativity flow freely in this beautiful space
        </p>
      </header>

      <div className="glassmorphic-card p-10 fade-in-delay-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                id="title"
                name="title"
                value={poem.title}
                onChange={handleChange}
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
                value={poem.content}
                onChange={handleChange}
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
                initialImage={poem.image} 
              />
            </div>

            <div className="bg-white/40 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={autoSaveEnabled}
                    onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  <span className="ms-3 text-sm font-medium text-gray-600 font-body">Auto-save</span>
                </label>
                {isSaving && (
                  <span className="text-sm text-pink-600 animate-pulse">Saving...</span>
                )}
              </div>
              
              {lastSaved && (
                <p className="text-sm text-gray-500 font-body">
                  Last saved: {lastSaved}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-pink-100">
          <div className="space-x-4">
            <button
              onClick={() => navigate('/')}
              className="modern-action-btn bg-white text-pink-500 border-pink-200 hover:bg-pink-50"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={clearDraft}
              className="modern-action-btn bg-white text-pink-500 border-pink-200 hover:bg-pink-50"
              type="button"
            >
              Clear Draft
            </button>
          </div>
          <button 
            onClick={savePoem}
            disabled={!poem.title || !poem.content}
            className="modern-action-btn bg-pink-500 text-white border-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Save Poem
          </button>
        </div>
      </div>
    </div>
  );
}

export default PoemEditor;