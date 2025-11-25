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
import { useChat } from '../../hooks/useChat';

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

  const { sendMessage } = useChat();

  // Example prompts for general chat
  const generalPrompts = [
    'Explain quantum computing in simple terms',
    'Draft a professional email asking for a deadline extension',
    'Give me 5 creative blog post ideas about productivity',
    'Summarize the key ideas from the latest book you recommend',
  ];

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
    <div className="flex items-center justify-center h-full w-full bg-[var(--bg-surface)]">
  <div className="max-w-3xl w-full px-6 py-10 text-center">

    {/* Title */}
    <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-2">
      {config.title}
    </h1>

    <p className="text-[var(--text-secondary)] mb-8">
      {config.subtitle}
    </p>

    {/* Features */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      {config.features.map((feature, i) => (
        <div
          key={i}
          className="p-6 rounded-xl bg-white/50 dark:bg-white/5 border border-[var(--bg-border)] hover:shadow-sm transition"
        >
          <div className="flex items-center justify-center mb-3">
            <feature.icon className="w-8 h-8 text-blue-500" />
          </div>
          <p className="font-medium text-[var(--text-primary)]">
            {feature.text}
          </p>
        </div>
      ))}
    </div>

    {/* CTA */}
    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2 flex items-center justify-center gap-2">
      <SparklesIcon className="w-5 h-5 text-blue-500" />
      Ready to get started?
      <SparklesIcon className="w-5 h-5 text-blue-500" />
    </h2>

    <p className="text-[var(--text-secondary)] mb-6">
      {mode === "general" && "Type your question or request in the chat below."}
      {mode === "youtube" && "Paste a YouTube URL above to begin analyzing video content."}
      {mode === "pdf" && "Upload a PDF document to start chatting with your files."}
      {mode === "site" && "Enter a website URL above to analyze the website content."}
    </p>

    {mode === "general" && (
      <>
        <div className="text-sm text-[var(--text-secondary)] mb-3">
          Try one of these:
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {generalPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => sendMessage(p)}
              className="px-4 py-2 bg-white/70 dark:bg-white/10 border border-[var(--bg-border)] rounded-lg text-sm hover:bg-white transition"
            >
              {p}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
</div>


  );
};

export default WelcomeScreen;
