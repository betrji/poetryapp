import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PoemList({ poems, handleDelete, handleReorder }) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(poems);
  const [viewMode, setViewMode] = useState('view'); // 'view' or 'edit'

  useEffect(() => {
    setCurrentOrder(poems);
  }, [poems]);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;
    // Move the dragged item visually in the array
    const newOrder = [...currentOrder];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, removed);
    setCurrentOrder(newOrder);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (JSON.stringify(currentOrder) !== JSON.stringify(poems)) {
      handleReorder(currentOrder);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10">
      {/* Sticky glassy button bar */}
      <div className="sticky top-0 z-30 flex justify-end items-center gap-3 px-6 py-2 mb-4 bg-white/60 backdrop-blur-md rounded-b-xl shadow-lg border-b border-pink-200 transition-all duration-300" style={{ minHeight: '56px' }}>
        <Link
          to="/new"
          className="glassy-btn minimal-icon-btn"
          aria-label="Create New Poem"
        >
          <span aria-hidden="true" className="text-2xl font-bold">+</span>
        </Link>
        <button
          className="glassy-btn minimal-icon-btn"
          aria-label={viewMode === 'edit' ? 'Switch to View Mode' : 'Switch to Edit Mode'}
          onClick={() => setViewMode(viewMode === 'view' ? 'edit' : 'view')}
          type="button"
        >
          <span aria-hidden="true" className="text-xl font-bold">
            {viewMode === 'edit' ? '👁' : '✎'}
          </span>
        </button>
      </div>
      <header className="text-center mb-16 fuji-header fade-in">
        <h1 className="text-4xl font-bold mb-5 japanese-heading text-pink-800 font-heading">Adhi's Poetry</h1>
        <p className="text-lg text-gray-600 mt-6 font-body">A collection of thoughts and emotions captured in verse</p>
      </header>
      
      <main className="pb-16">
        {currentOrder.length > 0 ? (
          <div className="grid gap-y-24 gap-x-16 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center mb-16">
            {currentOrder.map((poem, index) => (
              <div key={poem.id} className="relative group w-full h-full">
                <Link
                  to={viewMode === 'edit' ? `/new?edit=${poem.id}` : `/poem/${poem.id}`}
                  className={`book-card japanese-border fade-in-delay-${index % 3} cursor-pointer block hover-card mx-auto my-0${draggedIndex === index ? ' dragging' : ''} ${viewMode === 'edit' ? 'edit-mode-card' : 'view-mode-card'}`}
                  style={{ maxWidth: '300px', minWidth: '220px', marginBottom: '3.5rem', opacity: draggedIndex === index ? 0.6 : 1, zIndex: draggedIndex === index ? 10 : 1 }}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={e => e.preventDefault()}
                >
                  <div className="book-inner relative w-full h-full">
                    {/* Book Cover */}
                    <div className="book-cover absolute inset-0 w-full h-full origin-left aspect-[3/4] flex items-stretch justify-stretch bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl overflow-hidden">
                      {poem.image ? (
                        <img 
                          src={poem.image} 
                          alt="Book cover" 
                          className="w-full h-full object-cover" 
                          style={{ aspectRatio: '3/4', backgroundColor: '#fbeff4' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-pink-50 rounded-xl border border-pink-100" style={{ aspectRatio: '3/4' }}>
                          <h2 className="text-2xl font-semibold font-title text-pink-700 text-center px-4">{poem.title}</h2>
                        </div>
                      )}
                    </div>

                    {/* Book Content */}
                    <div className="book-content absolute inset-0 w-full h-full bg-white rounded-xl p-8 flex flex-col">
                      <h2 className="text-2xl font-semibold mb-4 font-title text-pink-700">{poem.title}</h2>
                      <p className="text-gray-500 text-sm mb-5 italic font-body">{poem.date}</p>
                      <p className="text-gray-700 whitespace-pre-line font-handwriting text-base line-clamp-5">{poem.content}</p>
                      
                      <button
                        className="peekaboo-x-btn"
                        title="Delete poem"
                        onClick={e => { e.preventDefault(); e.stopPropagation(); handleDelete(poem.id); }}
                        aria-label="Delete poem"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 fade-in">
            <p className="text-lg text-gray-500 mb-8 font-body">No poems found. Create your first poem!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default PoemList; 