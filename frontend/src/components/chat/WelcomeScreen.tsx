import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  MessageCircleIcon, 
  YoutubeIcon, 
  FileTextIcon, 
  GlobeIcon,
  SparklesIcon,
  UploadCloudIcon,
  BrainCircuitIcon
} from '../common/icons';
import type { ChatMode } from '../../types';
import FileUpload from './FileUpload';

interface WelcomeScreenProps {
  mode: ChatMode;
  hasDocument?: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ mode, hasDocument }) => {
  const { state } = useAppContext();

  const modeConfig = {
    general: {
      icon: MessageCircleIcon,
      title: 'General Chat',
      subtitle: 'Ask me anything!',
      description: 'I can help with explanations, creative writing, problem-solving, and general questions.',
      gradient: 'from-blue-500/20 via-purple-500/20 to-pink-500/20',
      iconColor: 'text-blue-500',
      features: [
        { icon: SparklesIcon, text: 'Creative writing & brainstorming' },
        { icon: BrainCircuitIcon, text: 'Problem solving & analysis' },
        { icon: MessageCircleIcon, text: 'General knowledge Q&A' }
      ]
    },
    youtube: {
      icon: YoutubeIcon,
      title: 'YouTube Analysis',
      subtitle: 'Analyze video content',
      description: 'Paste a YouTube URL to get summaries, key insights, and answer questions about the video.',
      gradient: 'from-red-500/20 via-orange-500/20 to-yellow-500/20',
      iconColor: 'text-red-500',
      features: [
        { icon: YoutubeIcon, text: 'Video content analysis' },
        { icon: FileTextIcon, text: 'Automatic summaries' },
        { icon: MessageCircleIcon, text: 'Q&A about video content' }
      ]
    },
    pdf: {
      icon: FileTextIcon,
      title: 'PDF Chat',
      subtitle: 'Chat with your documents',
      description: 'Upload PDF documents to analyze content, get summaries, and ask specific questions.',
      gradient: 'from-green-500/20 via-emerald-500/20 to-teal-500/20',
      iconColor: 'text-green-500',
      features: [
        { icon: UploadCloudIcon, text: 'Secure document upload' },
        { icon: FileTextIcon, text: 'Content analysis & extraction' },
        { icon: MessageCircleIcon, text: 'Interactive Q&A' }
      ]
    },
    site: {
      icon: GlobeIcon,
      title: 'Website Analysis',
      subtitle: 'Explore web content',
      description: 'Enter a website URL to analyze content, extract information, and get insights.',
      gradient: 'from-indigo-500/20 via-blue-500/20 to-cyan-500/20',
      iconColor: 'text-indigo-500',
      features: [
        { icon: GlobeIcon, text: 'Website content analysis' },
        { icon: FileTextIcon, text: 'Key information extraction' },
        { icon: MessageCircleIcon, text: 'Content-based discussions' }
      ]
    }
  };

  const config = modeConfig[mode];

  // For PDF mode without document, show FileUpload
  if (mode === 'pdf' && !hasDocument) {
    return (
      <div className="flex items-center justify-center h-full max-h-screen overflow-hidden bg-gradient-to-br from-[var(--bg-surface)]/30 to-[var(--bg-input)]/20">
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6 lg:mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br ${config.gradient} mb-4 lg:mb-6 animate-float`}>
              <config.icon className={`w-8 h-8 lg:w-10 lg:h-10 ${config.iconColor}`} />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-2">{config.title}</h1>
            <p className="text-base lg:text-lg text-[var(--text-secondary)] mb-3 lg:mb-4">{config.subtitle}</p>
            <p className="text-sm lg:text-base text-[var(--text-secondary)] max-w-xl mx-auto">{config.description}</p>
          </div>
          <FileUpload />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full max-h-screen overflow-hidden bg-gradient-to-br from-[var(--bg-surface)]/30 to-[var(--bg-input)]/20 relative">
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
        {/* Main Icon */}
        <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br ${config.gradient} mb-4 sm:mb-6 lg:mb-8 animate-float shadow-lg`}>
          <config.icon className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${config.iconColor}`} />
        </div>

        {/* Title Section */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-2 sm:mb-3 lg:mb-4">{config.title}</h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-3 sm:mb-4 lg:mb-6">{config.subtitle}</p>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Features Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
          {config.features.map((feature, index) => (
            <div 
              key={index}
              className="p-3 sm:p-4 lg:p-6 rounded-lg lg:rounded-xl bg-[var(--bg-input)]/50 border border-[var(--bg-border)] hover:bg-[var(--bg-surface)]/70 transition-all duration-300 hover:scale-105 group"
            >
              <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-br ${config.gradient} mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${config.iconColor}`} />
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-[var(--text-primary)] font-medium">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* Call to Action - Compact */}
        <div className="bg-[var(--bg-input)]/30 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border border-[var(--bg-border)]">
          <div className="flex items-center justify-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
            <SparklesIcon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${config.iconColor} animate-pulse`} />
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-[var(--text-primary)]">Ready to get started?</h3>
            <SparklesIcon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${config.iconColor} animate-pulse`} />
          </div>
          <p className="text-xs sm:text-sm lg:text-base text-[var(--text-secondary)] mb-4 lg:mb-6">
            {mode === 'general' && "Type your question or request in the chat below."}
            {mode === 'youtube' && "Paste a YouTube URL above to begin analyzing video content."}
            {mode === 'pdf' && "Upload a PDF document to start chatting with your files."}
            {mode === 'site' && "Enter a website URL above to start exploring web content."}
          </p>
          
          {/* Status Indicators - Responsive */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm text-[var(--text-secondary)]">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI Ready</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Fast Response</span>
            </div>
          </div>
        </div>

        {/* Floating Elements - Reduced for mobile */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1.5 h-1.5 lg:w-2 lg:h-2 ${config.iconColor.replace('text-', 'bg-')} rounded-full opacity-20 animate-float`}
              style={{
                left: `${15 + i * 20}%`,
                top: `${25 + (i % 2) * 30}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
