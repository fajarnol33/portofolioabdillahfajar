// components/ProjectModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface Project {
  id: string;
  title: string;
  longDesc: string;
  tools: string[] | string; // Izinkan tools bisa string atau array
  media: MediaItem[] | null;
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const getEmbedUrl = (url: string) => {
  try {
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be')) {
      const videoId = new URL(url).pathname.split('/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('drive.google.com')) {
      return url.replace('/view', '/preview').replace('?usp=sharing', '');
    }
  } catch (e) {
    console.error('Invalid URL for embedding:', url, e);
  }
  return url;
};

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasMedia = project.media && project.media.length > 0;

  const goToPrevious = () => {
    if (!hasMedia) return;
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? project.media!.length - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    if (!hasMedia) return;
    const isLastSlide = currentIndex === project.media!.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const currentMedia = hasMedia ? project.media![currentIndex] : null;

  // --- START OF FIX ---
  // Logika cerdas untuk mem-parsing data 'tools' dalam format apa pun
  let toolsArray: string[] = [];
  if (Array.isArray(project.tools)) {
    toolsArray = project.tools;
  } else if (typeof project.tools === 'string' && project.tools.length > 0) {
    // Membersihkan string dari karakter yang tidak perlu lalu memisahkan dengan koma
    toolsArray = project.tools
      .replace(/[\[\]'"{}]/g, '') // Hapus semua jenis kurung dan tanda kutip
      .split(',')
      .map((tool) => tool.trim())
      .filter(Boolean); // Hapus entri kosong
  }
  // --- END OF FIX ---

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="relative w-full h-full bg-custom-dark border border-white/10 rounded-xl flex flex-col md:flex-row overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20 bg-black/50 rounded-full p-2"
          aria-label="Close modal"
        >
          <FaTimes size={24} />
        </button>

        <div className="w-full md:w-2/3 h-1/2 md:h-full bg-black flex items-center justify-center relative rounded-t-xl md:rounded-l-xl md:rounded-tr-none overflow-hidden">
          {hasMedia && currentMedia ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                {currentMedia.type === 'image' ? (
                  <img
                    src={currentMedia.url}
                    alt={`${project.title} - media ${currentIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    src={getEmbedUrl(currentMedia.url)}
                    title={project.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-gray-400">
              Tidak ada media untuk ditampilkan.
            </div>
          )}

          {hasMedia && project.media!.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-colors"
                aria-label="Previous media"
              >
                <FaChevronLeft size={20} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-colors"
                aria-label="Next media"
              >
                <FaChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        <div className="w-full md:w-1/3 h-1/2 md:h-full p-6 space-y-4 overflow-y-auto">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
            {project.title}
          </h3>

          <div className="space-y-2">
            <h4 className="text-xl font-semibold">Tentang Proyek</h4>
            <p className="text-gray-300 text-justify">{project.longDesc}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xl font-semibold">Tools</h4>
            <div className="flex flex-wrap gap-2">
              {/* Menggunakan 'toolsArray' yang sudah dijamin aman dan bersih */}
              {toolsArray.map((tool) => (
                <span
                  key={tool}
                  className="bg-white/10 px-3 py-1 rounded-full text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;
