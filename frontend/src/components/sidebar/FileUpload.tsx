import { useDropzone } from 'react-dropzone';
import { useChat } from '../../hooks/useChat';
import { ACCEPTED_FILE_TYPES } from '../../constants';
import { UploadCloudIcon } from '../common/icons';
import UploadProgressComponent from './UploadProgress';

const FileUpload = () => {
  const { uploadFile, uploadProgress } = useChat();
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragging(false);
    if (acceptedFiles.length > 0) {
      // Process files one by one for now
      acceptedFiles.forEach(file => uploadFile(file));
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    multiple: true,
    disabled: !!uploadProgress,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });
  
  const baseClasses = "border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200";
  const inactiveClasses = uploadProgress 
    ? "border-[var(--bg-border)] bg-[var(--bg-surface)]/50 cursor-not-allowed opacity-50" 
    : "border-[var(--bg-border)] hover:border-[var(--bg-button)] hover:bg-[var(--bg-input)]/50 cursor-pointer";
  const activeClasses = uploadProgress 
    ? "border-[var(--bg-border)] bg-[var(--bg-surface)]/50 cursor-not-allowed opacity-50" 
    : "border-[var(--bg-button)] bg-[var(--bg-button)]/20";

  return (
    <div className="space-y-4">
      {uploadProgress && (
        <UploadProgressComponent progress={uploadProgress} />
      )}
      
      <div
        {...getRootProps()}
        className={`${baseClasses} ${isDragActive || isDragging ? activeClasses : inactiveClasses}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2 h-[88px]">
          <UploadCloudIcon className={`w-8 h-8 ${uploadProgress ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}`} />
          <p className="font-semibold text-[var(--text-primary)]">
            {uploadProgress 
              ? "Upload in progress..." 
              : isDragActive 
                ? "Drop PDF(s) here" 
                : "Drag & drop PDF(s)"
            }
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {uploadProgress ? "Please wait..." : "or click to browse (Max 10MB each)"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
