import { useNavigate, useParams } from 'react-router-dom';
import type { PoemViewerProps } from '../types';

function PoemViewer({ poems }: PoemViewerProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-title text-pink-700 mb-4">Poem not found</h2>
        <button className="primary-action-btn" onClick={() => navigate('/')}>Back to List</button>
      </div>
    );
  }

  const poemIndex = poems.findIndex(p => p.id.toString() === id);
  const poem = poems[poemIndex];
  const prevPoem = poemIndex > 0 ? poems[poemIndex - 1] : null;
  const nextPoem = poemIndex < poems.length - 1 ? poems[poemIndex + 1] : null;

  if (!poem) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-title text-pink-700 mb-4">Poem not found</h2>
        <button className="primary-action-btn" onClick={() => navigate('/')}>Back to List</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10 items-center">
      <div className="flex-1 flex items-center justify-center min-w-[220px] max-w-[350px] w-full">
        {poem.image ? (
          <div className="rounded-3xl overflow-hidden shadow-lg bg-white/60 border border-pink-100" style={{width: '100%', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img src={poem.image} alt="Poem visual" className="w-full h-full object-cover" style={{aspectRatio: '3/4'}} />
          </div>
        ) : (
          <div className="rounded-3xl flex items-center justify-center bg-pink-50 border border-pink-100 w-full aspect-[3/4] text-gray-400 text-xl font-title">
            No Image
          </div>
        )}
      </div>
      <div className="flex-1 glassmorphic-card p-8 flex flex-col gap-6 min-w-[260px]">
        <div className="text-sm text-gray-400 tracking-widest mb-1 font-title uppercase">{poem.date}</div>
        <h2 className="text-3xl md:text-4xl font-title text-pink-700 mb-2 font-bold">{poem.title}</h2>
        <div className="bg-pink-100/60 rounded-2xl p-6 text-lg font-handwriting text-gray-700 shadow-inner whitespace-pre-line min-h-[120px]">
          {poem.content}
        </div>
        <div className="poem-viewer-nav-row">
          <button
            className="primary-action-btn text-2xl px-5 py-2"
            onClick={() => prevPoem && navigate(`/poem/${prevPoem.id}`)}
            disabled={!prevPoem}
            aria-label="Previous Poem"
          >
            &#x25C0;
          </button>
          <button
            className="primary-action-btn text-2xl px-5 py-2"
            onClick={() => navigate('/')}
            aria-label="Back to List"
          >
            &#10005;
          </button>
          <button
            className="primary-action-btn text-2xl px-5 py-2"
            onClick={() => nextPoem && navigate(`/poem/${nextPoem.id}`)}
            disabled={!nextPoem}
            aria-label="Next Poem"
          >
            &#x25B6;
          </button>
        </div>
      </div>
    </div>
  );
}

export default PoemViewer;