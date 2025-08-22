import React, { useState, useRef, useEffect } from "react";
import cubeVideo from './cube_animation.mp4';

function VideoCube() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      
      return isMobileDevice || (isTouchDevice && isSmallScreen);
    };

    setIsMobile(checkMobile());

    // Listen for resize events to handle device orientation changes
    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Don't initialize video on mobile devices
    if (isMobile) {
      setIsLoading(false);
      return;
    }

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
  }, [isMobile]);

  // Don't render anything on mobile devices
  if (isMobile) {
    return null;
  }

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
        className="cube-video" // Use either "cube-video" or "cube-video-centered"
        aria-hidden="true"
        preload="auto"
        playsInline
        muted
        loop
      >
        <source src={cubeVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default React.memo(VideoCube);