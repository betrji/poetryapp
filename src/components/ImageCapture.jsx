import { useState, useEffect, useRef } from 'react';

function ImageCapture({ onImageCapture, initialImage = null }) {
  const [previewUrl, setPreviewUrl] = useState(initialImage);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialImage) {
      setPreviewUrl(initialImage);
    }
  }, [initialImage]);

  // Clean up Blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // If file is an image and large, compress/resize before base64
    if (file.type.startsWith('image/')) {
      if (file.size > 1024 * 1024) {
        compressAndConvertToBase64(file, (base64) => {
          if (onImageCapture) onImageCapture(base64);
        });
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (onImageCapture) onImageCapture(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      if (onImageCapture) onImageCapture(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (file.type.startsWith('image/')) {
        if (file.size > 1024 * 1024) {
          compressAndConvertToBase64(file, (base64) => {
            if (onImageCapture) onImageCapture(base64);
          });
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (onImageCapture) onImageCapture(event.target.result);
          };
          reader.readAsDataURL(file);
        }
      } else {
        if (onImageCapture) onImageCapture(null);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Compress and resize image using canvas (for JPEG/PNG)
  function compressAndConvertToBase64(file, callback) {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (event) => {
      img.onload = () => {
        // Resize to max 1200px width or height
        const maxDim = 1200;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG for better compression, fallback to PNG
        let base64;
        try {
          base64 = canvas.toDataURL('image/jpeg', 0.8);
        } catch {
          base64 = canvas.toDataURL('image/png');
        }
        callback(base64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mb-4 w-full flex flex-col items-center gap-2">
      <h2 className="text-base font-handwriting text-pink-700 mb-1" style={{letterSpacing: '0.01em'}}>Image</h2>
      {previewUrl ? (
        <div className="flex flex-col items-center w-full">
          <div className="bg-white/70 rounded-xl flex items-center justify-center mb-2 border border-pink-100" style={{ width: '160px', height: '120px', overflow: 'hidden' }}>
            <img src={previewUrl} alt="Uploaded" className="max-w-full max-h-full rounded-lg object-contain" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <button
            onClick={() => {
              setPreviewUrl(null);
              onImageCapture && onImageCapture(null);
            }}
            className="modern-action-btn bg-white text-pink-400 border-pink-100 hover:bg-pink-50 text-xs px-3 py-1 mt-1 font-handwriting"
            type="button"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 border-dashed border-pink-200 bg-white/60 cursor-pointer relative w-full"
          style={{ minHeight: '100px', maxWidth: '180px', borderStyle: 'dashed', boxShadow: 'none' }}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-200 mb-1 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-base font-handwriting text-pink-600 mb-0 z-10 font-semibold">Upload Image</span>
          <span className="text-xs text-gray-400 font-handwriting z-10">Click or drag a file here</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}
    </div>
  );
}

export default ImageCapture; 