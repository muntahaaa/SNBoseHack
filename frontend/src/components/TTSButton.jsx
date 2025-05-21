import React, { useState, useRef, useEffect } from "react";
import { fetchTTS } from "../utils/ttsApi";

export default function TTSButton({ text, language = "en-US", voice = "en-US-AriaNeural", showControls = true, buttonStyle = {}, ...props }) {
  const [audioState, setAudioState] = useState({
    isLoading: false,
    isPlaying: false,
    isPaused: false,
    audioUrl: null,
    error: null
  });
  
  const audioRef = useRef(null);
    // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        
        // Clean up event listeners if they exist
        if (audioRef.current.handleEnded) {
          audioRef.current.removeEventListener('ended', audioRef.current.handleEnded);
        }
        if (audioRef.current.handlePause) {
          audioRef.current.removeEventListener('pause', audioRef.current.handlePause);
        }
        if (audioRef.current.handlePlay) {
          audioRef.current.removeEventListener('play', audioRef.current.handlePlay);
        }
        
        audioRef.current = null;
      }
      if (audioState.audioUrl) {
        URL.revokeObjectURL(audioState.audioUrl);
      }
    };
  }, [audioState.audioUrl]);

  const handleSpeak = async () => {
    // If audio is already loaded
    if (audioState.audioUrl) {
      togglePlayPause();
      return;
    }
    
    setAudioState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const audioBlob = await fetchTTS({ text, language, voice });
      const url = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(url);
      
      // Define event handlers with proper function references
      const handleEnded = () => {
        console.log('Audio ended event');
        setAudioState(prev => ({ 
          ...prev, 
          isPlaying: false,
          isPaused: false
        }));
      };
      
      const handlePause = () => {
        console.log('Audio pause event');
        setAudioState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
      };
      
      const handlePlay = () => {
        console.log('Audio play event');
        setAudioState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      };
      
      // Set up event listeners
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('play', handlePlay);
      
      // Store handlers for cleanup
      audio.handleEnded = handleEnded;
      audio.handlePause = handlePause;
      audio.handlePlay = handlePlay;
      
      audioRef.current = audio;
      
      // Play audio
      await audio.play();
      
      // Update state with the URL
      setAudioState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isPlaying: true,
        audioUrl: url 
      }));
    } catch (e) {
      console.error("TTS Error:", e);
      setAudioState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "Failed to speak text" 
      }));
    }
  };
    const togglePlayPause = () => {
    console.log('Toggle play/pause called', audioState);
    if (!audioRef.current) {
      console.error('No audio reference available');
      return;
    }
    
    try {
      if (audioState.isPlaying) {
        console.log('Pausing audio...');
        audioRef.current.pause();
        // Let the event listener handle state update for consistent behavior
      } else {
        console.log('Playing audio...');
        // Use the Promise API for better error handling
        audioRef.current.play()
          .then(() => {
            console.log('Play successfully started');
            // Event listener will handle state update
          })
          .catch(err => {
            console.error('Error playing audio:', err);
            setAudioState(prev => ({ 
              ...prev, 
              isPlaying: false, 
              isPaused: false,
              error: "Playback failed" 
            }));
          });
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };
    const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Clean up event listeners properly
      if (audioRef.current.handleEnded) {
        audioRef.current.removeEventListener('ended', audioRef.current.handleEnded);
      }
      if (audioRef.current.handlePause) {
        audioRef.current.removeEventListener('pause', audioRef.current.handlePause);
      }
      if (audioRef.current.handlePlay) {
        audioRef.current.removeEventListener('play', audioRef.current.handlePlay);
      }
      
      audioRef.current = null;
    }
    
    // Free memory
    if (audioState.audioUrl) {
      URL.revokeObjectURL(audioState.audioUrl);
    }
    
    // Reset state
    setAudioState({
      isLoading: false,
      isPlaying: false, 
      isPaused: false,
      audioUrl: null,
      error: null
    });
  };

  // If simple mode (no controls)
  if (!showControls) {
    return (
      <button 
        onClick={handleSpeak} 
        disabled={audioState.isLoading} 
        style={{ backgroundColor: audioState.isPlaying ? "#3b8eef" : "#4da3ff", ...buttonStyle }}
        {...props}
      >
        {audioState.isLoading ? "Speaking..." : audioState.isPlaying ? "🔊 Playing..." : "🔊 Speak"}
      </button>
    );
  }

  // With audio controls
  return (
    <div className="tts-button-container" style={{ display: "flex", gap: "8px", ...props.containerStyle }}>
      {!audioState.audioUrl ? (
        <button 
          onClick={handleSpeak} 
          disabled={audioState.isLoading} 
          style={{ 
            backgroundColor: "#4da3ff", 
            color: "white",
            border: "none",
            borderRadius: "16px",
            padding: "6px 12px",
            cursor: audioState.isLoading ? "wait" : "pointer",
            ...buttonStyle 
          }}
          {...props}
        >
          {audioState.isLoading ? "Loading..." : "🔊 Speak"}
        </button>
      ) : (
        <>
          <button 
            onClick={togglePlayPause} 
            style={{ 
              backgroundColor: "#4da3ff", 
              color: "white",
              border: "none",
              borderRadius: "16px",
              padding: "6px 12px",
              cursor: "pointer",
              ...buttonStyle 
            }}
          >
            {audioState.isPlaying ? "⏸️ Pause" : "▶️ Play"}
          </button>
          <button 
            onClick={resetAudio} 
            style={{ 
              backgroundColor: "#f0f0f0", 
              color: "#666",
              border: "none",
              borderRadius: "16px",
              padding: "6px 12px",
              cursor: "pointer",
              ...props.resetStyle 
            }}
          >
            🔄 Reset
          </button>
        </>
      )}
      {audioState.error && <div style={{ color: "red" }}>{audioState.error}</div>}
    </div>
  );
}
