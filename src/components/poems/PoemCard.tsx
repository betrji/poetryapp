import { Link } from 'react-router-dom';
import type { Poem } from '@/types';

interface PoemCardProps {
  poem: Poem;
  mode: 'view' | 'edit';
  onDelete: (id: number) => void;
  dragHandlers?: {
    onDragStart: () => void;
    onDragEnter: () => void;
    onDragEnd: () => void;
  };
  isDragging?: boolean;
}

function PoemCard({ poem, mode, onDelete, dragHandlers, isDragging }: PoemCardProps) {
  return (
    <Link
      to={mode === 'edit' ? `/new?edit=${poem.id}` : `/poem/${poem.id}`}
      className={`book-card japanese-border cursor-pointer block hover-card mx-auto my-0 ${isDragging ? 'dragging' : ''} ${mode === 'edit' ? 'edit-mode-card' : 'view-mode-card'}`}
      style={{ 
        maxWidth: '300px', 
        minWidth: '220px', 
        marginBottom: '3.5rem', 
        opacity: isDragging ? 0.6 : 1, 
        zIndex: isDragging ? 10 : 1 
      }}
      draggable={!!dragHandlers}
      onDragStart={dragHandlers?.onDragStart}
      onDragEnter={dragHandlers?.onDragEnter}
      onDragEnd={dragHandlers?.onDragEnd}
      onDragOver={e => e.preventDefault()}
    >
      <div className="book-inner relative w-full h-full">
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

        <div className="book-content absolute inset-0 w-full h-full bg-white rounded-xl p-8 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 font-title text-pink-700">{poem.title}</h2>
          <p className="text-gray-500 text-sm mb-5 italic font-body">{poem.date}</p>
          <p className="text-gray-700 whitespace-pre-line font-handwriting text-base line-clamp-5">{poem.content}</p>
          
          <button
            className="peekaboo-x-btn"
            title="Delete poem"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(poem.id);
            }}
            aria-label="Delete poem"
          >
            ×
          </button>
        </div>
      </div>
    </Link>
  );
}

export default PoemCard;