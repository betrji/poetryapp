import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import PoemList from './components/PoemList.tsx'
import NewPoem from './components/NewPoem.tsx'
import PoemEditor from './components/PoemEditor.tsx'
import CherryBlossoms from './components/CherryBlossoms.tsx'
import './styles/JapaneseTheme.css'
import PoemViewer from './components/PoemViewer.tsx'

function App() {
  const [poems, setPoems] = useState<Poem[]>([]);

  // Load poems from localStorage on mount
  useEffect(() => {
    const loadPoems = () => {
      try {
        const savedPoems = localStorage.getItem('poems');
        if (savedPoems) {
          const parsedPoems = JSON.parse(savedPoems);
          if (Array.isArray(parsedPoems)) {
            setPoems(parsedPoems);
          }
        }
      } catch (e) {
        console.error('Error loading poems from localStorage:', e);
      }
    };

    loadPoems();

    // Set up an event listener to reload poems when localStorage changes
    window.addEventListener('storage', loadPoems);
    return () => window.removeEventListener('storage', loadPoems);
  }, []);

  // Import Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Noto+Serif+JP:wght@200;400;700&display=swap';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const addPoem = (newPoem: Poem) => {
    const updatedPoems = [...poems, newPoem];
    setPoems(updatedPoems);
    try {
      localStorage.setItem('poems', JSON.stringify(updatedPoems));
    } catch (e) {
      console.error('Error saving poems to localStorage:', e);
    }
  };

  const updatePoem = (updatedPoem: Poem) => {
    const updatedPoems = poems.map(poem => 
      poem.id === updatedPoem.id ? updatedPoem : poem
    );
    setPoems(updatedPoems);
    try {
      localStorage.setItem('poems', JSON.stringify(updatedPoems));
    } catch (e) {
      console.error('Error saving updated poems to localStorage:', e);
    }
  };

  // Delete poem at the App level
  const handleDeletePoem = (id: number) => {
    const updatedPoems = poems.filter(poem => poem.id !== id);
    setPoems(updatedPoems);
    try {
      localStorage.setItem('poems', JSON.stringify(updatedPoems));
    } catch (e) {
      console.error('Error deleting poem from localStorage:', e);
    }
  };

  // Reorder poems and persist
  const handleReorderPoems = (newOrder: Poem[]) => {
    setPoems(newOrder);
    try {
      localStorage.setItem('poems', JSON.stringify(newOrder));
    } catch (e) {
      console.error('Error saving reordered poems to localStorage:', e);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen cherry-blossom-bg text-gray-800 py-8 px-3 relative overflow-hidden poem-app">
        <CherryBlossoms />
        <div className="cherry-tree opacity-60"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <Routes>
            <Route path="/" element={<PoemList poems={poems} handleDelete={handleDeletePoem} handleReorder={handleReorderPoems} />} />
            <Route path="/new" element={<NewPoem poems={poems} addPoem={addPoem} updatePoem={updatePoem} />} />
            <Route path="/editor" element={<PoemEditor />} />
            <Route path="/poem/:id" element={<PoemViewer poems={poems} />} />
          </Routes>
          
          <footer className="mt-16 text-center text-gray-600 wave-pattern py-4">
            <p className="font-serif text-sm">© 2024 Poetry Portfolio. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App