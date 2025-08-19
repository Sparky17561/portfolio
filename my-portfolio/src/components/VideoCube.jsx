import React, { useState, useRef, useEffect } from "react";
import cubeVideo from './cube_animation.mp4';

function VideoCube() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      // Start playback
      video.play().catch(e => console.error("Video play failed:", e));
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      console.error("Failed to load video");
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Preload the video for better performance
    video.preload = "auto";
    video.playsInline = true;
    video.muted = true;
    video.loop = true;

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className="video-cube-container">
      {isLoading && !hasError && (
        <div className="video-loading">
          <div className="loading-spinner"></div>
          Loading animation...
        </div>
      )}
      {hasError && (
        <div className="video-loading">Animation failed to load</div>
      )}
      <video
        ref={videoRef}
        className="cube-video"
        aria-hidden="true"
        preload="auto"
        playsInline
        muted
        loop
      >
        <source src={cubeVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay to hide watermark */}

    </div>
  );
}

export default React.memo(VideoCube);