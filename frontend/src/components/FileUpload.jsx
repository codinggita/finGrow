import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileSelected }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      setError('Invalid file type or size too large.');
      setPreview(null);
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setError(null);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      if (onFileSelected) {
        onFileSelected(file);
      }
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/pdf': []
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-primary font-bold">Drop the file here ...</p>
        ) : (
          <div>
            <p className="text-gray-500 font-medium">Drag & drop a file here, or click to select</p>
            <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG, PDF up to 5MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {preview && (
        <div className="mt-4">
          <p className="text-sm font-bold text-gray-700 mb-2">Preview:</p>
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
             {preview.startsWith('blob:') && !error ? (
                <img src={preview} alt="Preview" className="object-cover w-full h-full" />
             ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <span className="text-xs font-bold">File</span>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
