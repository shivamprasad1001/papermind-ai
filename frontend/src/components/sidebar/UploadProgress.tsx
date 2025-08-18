import { UploadProgress } from '../../types';
import { CheckCircleIcon, XCircleIcon, LoaderIcon } from '../common/icons';

interface UploadProgressProps {
  progress: UploadProgress;
}

const UploadProgressComponent = ({ progress }: UploadProgressProps) => {
  const getStatusIcon = () => {
    switch (progress.status) {
      case 'uploading':
      case 'processing':
        return <LoaderIcon className="w-5 h-5 animate-spin text-primary" />;
      case 'complete':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (progress.status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing PDF...';
      case 'complete':
        return 'Upload complete!';
      case 'error':
        return 'Upload failed';
      default:
        return '';
    }
  };

  const getProgressColor = () => {
    switch (progress.status) {
      case 'complete':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3 animate-fade-in shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-300 truncate">
            {progress.fileName}
          </span>
        </div>
        <span className="text-xs text-gray-400 font-mono">
          {progress.progress}%
        </span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ease-out ${getProgressColor()} relative`}
          style={{ width: `${progress.progress}%` }}
        >
          {progress.status === 'uploading' && (
            <div className="absolute inset-0 bg-white/20 animate-pulse-slow" />
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {getStatusText()}
        </span>
        {progress.status === 'error' && progress.error && (
          <span className="text-xs text-red-400 truncate max-w-32" title={progress.error}>
            {progress.error}
          </span>
        )}
      </div>
      
      {progress.status === 'complete' && (
        <div className="text-xs text-green-400 animate-bounce-slow">
          ✓ Ready to chat!
        </div>
      )}
    </div>
  );
};

export default UploadProgressComponent; 