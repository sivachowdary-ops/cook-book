"use client";

import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export const VideoReel = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Play automatically if intersection observer sees it? 
  // For now just autoPlay muted.
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-[280px] sm:w-[320px] mx-auto aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-900 bg-black group cursor-pointer" onClick={togglePlay}>
      {/* Fallback to webp if video fails, but we prefer video for sound and performance */}
      <video
        ref={videoRef}
        src="/videos/cook_book_video.mp4"
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        poster="/videos/cook_book_poster.webp"
      />
      
      {/* Overlay gradient for controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Center Play/Pause indicator (shows briefly or when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
            <Play className="w-8 h-8 ml-1" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-3">
        <button 
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors border border-white/20"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      <div className="absolute bottom-6 left-5 right-16">
        <h3 className="text-white font-bold text-lg drop-shadow-md">Cook Book Magic</h3>
        <p className="text-white/80 text-xs drop-shadow-md mt-1 line-clamp-2">Authentic traditional recipes made fresh daily. Order now via WhatsApp!</p>
      </div>
    </div>
  );
};
