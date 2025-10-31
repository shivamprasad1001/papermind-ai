import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useChat } from '../../hooks/useChat';
import { ACCEPTED_FILE_TYPES } from '../../constants';
import { UploadCloudIcon, FileTextIcon, LoaderIcon } from '../common/icons';
import UploadProgressComponent from '../sidebar/UploadProgress';

const FileUpload = () => {
  const { uploadFile, uploadProgress } = useChat();
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragging(false);
    setDragCounter(0);
    if (acceptedFiles.length > 0) {
      acceptedFiles.forEach(file => uploadFile(file));
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    multiple: true,
    disabled: !!uploadProgress,
    onDragEnter: () => {
      setDragCounter(prev => prev + 1);
      setIsDragging(true);
    },
    onDragLeave: () => {
      setDragCounter(prev => {
        const newCount = prev - 1;
        if (newCount === 0) {
          setIsDragging(false);
        }
        return newCount;
      });
    },
  });

  const isUploading = !!uploadProgress;
  const isActive = isDragActive || isDragging;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {uploadProgress && (
        <div className="mb-6">
          <UploadProgressComponent progress={uploadProgress} />
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ease-in-out
          ${isUploading 
            ? 'border-[var(--bg-border)] bg-[var(--bg-surface)]/50 cursor-not-allowed opacity-60' 
            : isActive
              ? 'border-[var(--bg-button)] bg-[var(--bg-button)]/10 scale-105 shadow-lg'
              : 'border-[var(--bg-border)] hover:border-[var(--bg-button)] hover:bg-[var(--bg-input)]/30 cursor-pointer hover:scale-102'
          }
          ${isActive ? 'animate-pulse' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {/* Background Animation */}
        <div className={`
          absolute inset-0 rounded-xl transition-all duration-500
          ${isActive ? 'bg-gradient-to-br from-[var(--bg-button)]/20 via-transparent to-[var(--bg-button)]/10' : ''}
        `} />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          {/* Icon with Animation */}
          <div className={`
            transition-all duration-300 transform
            ${isActive ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}
            ${isUploading ? 'animate-spin' : ''}
          `}>
            {isUploading ? (
              <LoaderIcon className="w-16 h-16 text-[var(--bg-button)]" />
            ) : isActive ? (
              <div className="relative">
                <UploadCloudIcon className="w-16 h-16 text-[var(--bg-button)]" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--bg-button)] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
            ) : (
              <UploadCloudIcon className="w-16 h-16 text-[var(--text-secondary)] group-hover:text-[var(--bg-button)] transition-colors duration-300" />
            )}
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h3 className={`
              text-xl font-semibold transition-colors duration-300
              ${isUploading 
                ? 'text-[var(--text-secondary)]' 
                : isActive 
                  ? 'text-[var(--bg-button)]' 
                  : 'text-[var(--text-primary)]'
              }
            `}>
              {isUploading 
                ? "Uploading..." 
                : isActive 
                  ? "Drop your PDF files here!" 
                  : "Upload PDF Documents"
              }
            </h3>
            
            <p className={`
              text-sm transition-colors duration-300
              ${isUploading 
                ? 'text-[var(--text-secondary)]' 
                : isActive 
                  ? 'text-[var(--bg-button)]' 
                  : 'text-[var(--text-secondary)]'
              }
            `}>
              {isUploading 
                ? "Please wait while we process your document..." 
                : isActive 
                  ? "Release to upload your documents" 
                  : "Drag & drop PDF files here, or click to browse"
              }
            </p>
            
            {!isUploading && (
              <div className="flex items-center justify-center space-x-4 mt-4">
                <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)]">
                  <FileTextIcon className="w-4 h-4" />
                  <span>PDF files only</span>
                </div>
                <div className="w-1 h-1 bg-[var(--text-secondary)] rounded-full" />
                <div className="text-xs text-[var(--text-secondary)]">
                  Max 10MB each
                </div>
              </div>
            )}
          </div>

          {/* Floating Particles Animation */}
          {isActive && !isUploading && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    absolute w-2 h-2 bg-[var(--bg-button)] rounded-full opacity-60
                    animate-bounce
                  `}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 20}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Border Glow Effect */}
        {isActive && !isUploading && (
          <div className="absolute inset-0 rounded-xl border-2 border-[var(--bg-button)] opacity-50 animate-ping" />
        )}
      </div>

      {/* Help Text */}
      {!isUploading && (
        <div className="mt-4 text-center">
          <p className="text-xs text-[var(--text-secondary)]">
            Supported formats: PDF • Multiple files supported • Secure upload
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
