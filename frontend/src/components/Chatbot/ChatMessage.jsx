import React, { useState, useRef, useEffect } from 'react';
import { fetchTTS } from '../../utils/ttsApi';

const ChatMessage = ({ role, content, timestamp }) => {  const [audioState, setAudioState] = useState({
    isLoading: false,
    isPlaying: false,
    isPaused: false,
    audioUrl: null,
    error: null,
    isInitialized: false
  });
  
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  
  // Voice options for different languages
  const VOICE_OPTIONS = {
    "en-US": [
      { id: "en-US-AriaNeural", name: "Aria (Female)" },
      { id: "en-US-GuyNeural", name: "Guy (Male)" }
    ],
    "bn-IN": [
      { id: "bn-IN-TanishaaNeural", name: "Tanishaa (Female)" },
      { id: "bn-IN-BashkarNeural", name: "Bashkar (Male)" }
    ]
  };
  
  const audioRef = useRef(null);
  const playPromiseRef = useRef(null);  // Track the play promise
  
  // Helper function to set up audio event listeners
  const setupAudioListeners = (audio) => {
    // Define event handlers
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
    
    const handleLoadedData = () => {
      console.log('Audio loaded data event');
    };
    
    const handleError = (e) => {
      console.error('Audio element error:', e);
      setAudioState(prev => ({ 
        ...prev, 
        isPlaying: false,
        isPaused: false,
        error: 'Audio playback error'
      }));
    };
    
    // Set up event listeners
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    
    // Store the event handlers for cleanup
    audio.handleEnded = handleEnded;
    audio.handlePause = handlePause;
    audio.handlePlay = handlePlay;
    audio.handleLoadedData = handleLoadedData;
    audio.handleError = handleError;
    
    return audio;
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Don't execute cleanup if it's not needed
      if (!audioRef.current && !audioState.audioUrl) {
        return;
      }
      
      console.log('Cleaning up audio on unmount');
      
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              cleanupAudioListeners();
            }
          })
          .catch(() => {
            cleanupAudioListeners();
          });
      } else if (audioRef.current) {
        audioRef.current.pause();
        cleanupAudioListeners();
      }
      
      // Cleanup audio URL
      if (audioState.audioUrl) {
        URL.revokeObjectURL(audioState.audioUrl);
      }
    };
    
    function cleanupAudioListeners() {
      if (!audioRef.current) return;
      
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
      if (audioRef.current.handleLoadedData) {
        audioRef.current.removeEventListener('loadeddata', audioRef.current.handleLoadedData);
      }
      if (audioRef.current.handleError) {
        audioRef.current.removeEventListener('error', audioRef.current.handleError);
      }
      
      audioRef.current = null;
    }
  }, [audioState.audioUrl]);
  
  // Format timestamp for display
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get display role name
  const getDisplayRole = (role) => {
    switch(role.toLowerCase()) {
      case 'user':
        return 'You';
      case 'model':
      case 'assistant':
        return 'AI';
      default:
        return 'System';
    }
  };
  // Initialize audio
  const initializeAudio = async (forcedLanguage = null, forcedVoice = null) => {
    console.log('Initialize audio called, current state:', audioState);
    
    if (audioState.audioUrl) {
      console.log('Audio already loaded, toggling play/pause');
      
      // Check if we have a valid audio reference, if not, recreate it
      if (!audioRef.current) {
        console.log('Audio reference is null, recreating audio element');
        const audio = new Audio(audioState.audioUrl);
        // Set up the audio with our helper
        setupAudioListeners(audio);
        // Update audio reference
        audioRef.current = audio;
        console.log('Audio element recreated successfully');
      }
      
      togglePlayPause();
      return;
    }
    
    setAudioState(prev => ({ ...prev, isLoading: true }));
    
    try {      
      console.log('Fetching audio from TTS service');
        
      // Detect language - very simple detection for Bengali
      // More sophisticated detection could be implemented
      const hasScriptBengali = /[\u0980-\u09FF]/.test(content);
      const language = forcedLanguage || (hasScriptBengali ? 'bn-IN' : 'en-US');
      
      // Select voice based on user selection or default
      let voice;
      if (forcedVoice) {
        voice = forcedVoice;
      } else if (selectedVoice && VOICE_OPTIONS[language]?.some(v => v.id === selectedVoice)) {
        voice = selectedVoice;
      } else {
        // Default to first voice in the language
        voice = VOICE_OPTIONS[language]?.[0]?.id;
      }
      
      console.log(`Using language: ${language}, voice: ${voice}`);
      
      const audioBlob = await fetchTTS({ 
        text: content, 
        language: language, 
        voice: voice 
      });
      console.log('Audio blob received, size:', audioBlob.size);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Check if the audio blob has content
      if (audioBlob.size === 0) {
        console.error('Error: Received empty audio blob from TTS service');
        setAudioState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: 'Received empty audio data'
        }));
        return;
      }
      
      // Create audio element
      console.log('Creating audio element');
      const audio = new Audio(audioUrl);
      
      // Set up the audio with our helper
      setupAudioListeners(audio);
      
      // Store audio ref
      audioRef.current = audio;
      
      // Update state before playing
      setAudioState(prev => ({ 
        ...prev, 
        isLoading: false,
        audioUrl,
        isInitialized: true
      }));
      
      // Start playing
      console.log('Starting audio playback');
      try {
        // Add a small delay before playing to ensure the audio is ready
        setTimeout(() => {
          if (audioRef.current) {
            // Modern browsers return a promise from play()
            playPromiseRef.current = audioRef.current.play();
            
            if (playPromiseRef.current !== undefined) {
              playPromiseRef.current
                .then(() => {
                  console.log('Audio playback started successfully');
                  playPromiseRef.current = null;
                  // Update playing state
                  setAudioState(prev => ({ 
                    ...prev, 
                    isPlaying: true 
                  }));
                })
                .catch(error => {
                  // Check if it's an abort error from a pause interruption
                  if (error.name === 'AbortError') {
                    console.log('Play was aborted by pause, this is normal');
                  } else {
                    console.error('Play promise rejected:', error);
                    setAudioState(prev => ({ 
                      ...prev, 
                      isPlaying: false,
                      error: `Play error: ${error.message}`
                    }));
                  }
                  playPromiseRef.current = null;
                });
            }
          }
        }, 100); // Slightly longer delay to help browser prepare
      } catch (error) {
        console.error('Error playing audio:', error);
        setAudioState(prev => ({ 
          ...prev, 
          isPlaying: false,
          error: 'Failed to play audio'
        }));
      }
    } catch (error) {
      console.error('Error in TTS process:', error);
      setAudioState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Failed to fetch audio'
      }));
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    console.log('Toggle play/pause called, current audio state:', audioState);
    
    // If we have a URL but no audio reference, recreate the audio element
    if (!audioRef.current && audioState.audioUrl) {
      console.log('Audio reference is null but URL exists, recreating audio element');
      
      try {
        const audio = new Audio(audioState.audioUrl);
        // Set up the audio with our helper
        setupAudioListeners(audio);
        // Update audio reference
        audioRef.current = audio;
        console.log('Audio element recreated successfully in togglePlayPause');
      } catch (error) {
        console.error('Error recreating audio element:', error);
        setAudioState(prev => ({ 
          ...prev, 
          error: 'Failed to initialize audio player' 
        }));
        return;
      }
    }
    
    if (!audioRef.current) {
      console.log('Audio reference is still null, cannot toggle');
      return;
    }
    
    try {
      if (audioState.isPlaying) {
        console.log('Attempting to pause audio');
        // Only pause if we're not in the middle of a play operation
        if (playPromiseRef.current) {
          console.log('Play promise pending, waiting before pausing');
          // Just let the current operation finish - don't try to pause
          // This prevents the AbortError
          playPromiseRef.current
            .then(() => {
              // Only pause if we still want to after the promise resolves
              // Check isPlaying again to make sure it's still true
              if (audioRef.current && audioState.isPlaying) {
                audioRef.current.pause();
                console.log('Audio paused after play promise resolved');
              }
              playPromiseRef.current = null;
            })
            .catch(err => {
              console.error('Error in pending play promise:', err);
              playPromiseRef.current = null;
            });
        } else {
          audioRef.current.pause();
          console.log('Audio pause command issued directly');
        }
        // Let the event listener update the state
      } else {
        console.log('Attempting to play audio');
        
        // First, make sure we're not interrupting an existing operation
        if (playPromiseRef.current !== null) {
          console.log('Another play/pause operation is in progress, waiting...');
          return;
        }
        
        // Add a small delay before playing to ensure the audio is ready
        setTimeout(() => {
          if (audioRef.current && !audioState.isPlaying) {
            playPromiseRef.current = audioRef.current.play();
            if (playPromiseRef.current !== undefined) {
              playPromiseRef.current
                .then(() => {
                  console.log('Audio play promise resolved successfully');
                  playPromiseRef.current = null;
                  // Let the event listener update the state
                })
                .catch(err => {
                  if (err.name === 'AbortError') {
                    console.log('Play was aborted by pause, this is normal');
                  } else {
                    console.error('Error playing audio:', err);
                    setAudioState(prev => ({ 
                      ...prev, 
                      isPlaying: false, 
                      isPaused: false, 
                      error: `Play error: ${err.message}` 
                    }));
                  }
                  playPromiseRef.current = null;
                });
            }
          }
        }, 100); // Slightly longer delay to help browser prepare
      }
    } catch (error) {
      console.error('Exception in togglePlayPause:', error);
    }
  };
  
  // Clean up resources
  const cleanupAudio = () => {
    const cleanupResources = () => {
      // Clean up event listeners properly
      if (audioRef.current) {
        if (audioRef.current.handleEnded) {
          audioRef.current.removeEventListener('ended', audioRef.current.handleEnded);
        }
        if (audioRef.current.handlePause) {
          audioRef.current.removeEventListener('pause', audioRef.current.handlePause);
        }
        if (audioRef.current.handlePlay) {
          audioRef.current.removeEventListener('play', audioRef.current.handlePlay);
        }
        if (audioRef.current.handleLoadedData) {
          audioRef.current.removeEventListener('loadeddata', audioRef.current.handleLoadedData);
        }
        if (audioRef.current.handleError) {
          audioRef.current.removeEventListener('error', audioRef.current.handleError);
        }
        
        audioRef.current = null;
      }
      
      // Revoke object URL to free up memory
      if (audioState.audioUrl) {
        URL.revokeObjectURL(audioState.audioUrl);
      }
      
      // Reset state
      setAudioState({
        isLoading: false,
        isPlaying: false,
        isPaused: false,
        audioUrl: null,
        error: null,
        isInitialized: false
      });
    };
    
    // Handle in-progress play operations
    if (playPromiseRef.current) {
      // We have a pending play operation
      console.log('Cleanup with pending play operation');
      
      // Don't try to pause until the play promise resolves
      // This prevents the AbortError
      playPromiseRef.current
        .then(() => {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          playPromiseRef.current = null;
          cleanupResources();
        })
        .catch(() => {
          playPromiseRef.current = null;
          cleanupResources();
        });
    } else if (audioRef.current) {
      // No pending play operation, pause directly
      console.log('No pending play operation, pausing directly');
      audioRef.current.pause();
      cleanupResources();
    } else {
      console.log('No audio element, just cleaning up resources');
      cleanupResources();
    }
  };
  
  // Only show TTS button for AI messages
  const isAIMessage = role === 'model' || role === 'assistant';
  
  return (
    <div className={`message ${role === 'model' ? 'assistant' : role}`}>
      <div className="message-header">
        <span className="message-role">{getDisplayRole(role)}</span>
        <span className="message-time">{formatTime(timestamp)}</span>
      </div>
      <div className="message-content">{content}</div>      {isAIMessage && (
        <div className="tts-controls" style={{ marginTop: "10px" }}>
          {!audioState.audioUrl ? (
            <div className="tts-selection" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>              <div className="language-selector" style={{ display: "flex", alignItems: "center" }}>
                <label style={{ marginRight: "8px", fontSize: "0.9rem" }}>Language:</label>
                <select 
                  onChange={(e) => {
                    const newLang = e.target.value; 
                    setSelectedLanguage(newLang);
                    // Reset voice when language changes
                    if (VOICE_OPTIONS[newLang]?.length > 0) {
                      setSelectedVoice(VOICE_OPTIONS[newLang][0].id);
                    }
                  }}
                  value={selectedLanguage || ""}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc"
                  }}
                >
                  <option value="">Auto Detect</option>
                  <option value="en-US">English</option>
                  <option value="bn-IN">Bengali</option>
                </select>
              </div>
              
              {selectedLanguage && (
                <div className="voice-selector" style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
                  <label style={{ marginRight: "8px", fontSize: "0.9rem" }}>Voice:</label>
                  <select 
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    value={selectedVoice || ""}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px", 
                      border: "1px solid #ccc"
                    }}
                  >
                    {VOICE_OPTIONS[selectedLanguage]?.map(voice => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}              <button 
                className="hear-answer-btn" 
                onClick={() => initializeAudio(selectedLanguage, selectedVoice)}
                disabled={audioState.isLoading}
                aria-label="Hear the answer"
                style={{
                  backgroundColor: "#4da3ff",
                  color: "white",
                  border: "none",
                  borderRadius: "16px",
                  padding: "6px 12px",
                  cursor: audioState.isLoading ? "wait" : "pointer",
                  marginTop: "10px"
                }}
              >
                {audioState.isLoading ? (
                  <span className="loading-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                ) : (
                  <span>🔊 Hear the answer</span>
                )}
              </button>
            </div>
          ) : (            <div className="audio-controls" style={{ display: "flex", gap: "10px" }}>
              <button 
                className={`audio-control-btn ${audioState.isPlaying ? 'playing' : 'paused'}`}
                onClick={togglePlayPause}
                aria-label={audioState.isPlaying ? "Pause" : "Play"}
                style={{
                  backgroundColor: audioState.isPlaying ? "#3b8eef" : "#4da3ff",
                  color: "white",
                  border: "none",
                  borderRadius: "16px",
                  padding: "6px 12px",
                  cursor: "pointer"
                }}
              >
                {audioState.isPlaying ? "⏸️ Pause" : "▶️ Play"}
              </button>
              <button 
                className="audio-control-btn reset-btn" 
                onClick={cleanupAudio}
                aria-label="Reset audio"
                style={{
                  backgroundColor: "#f0f0f0",
                  color: "#666",
                  border: "none",
                  borderRadius: "16px",
                  padding: "6px 12px",
                  cursor: "pointer"
                }}
              >🔄 Reset
              </button>
            </div>
          )}
          
          {audioState.error && (
            <div className="audio-error" style={{ color: 'red', marginTop: '5px', fontSize: '0.85rem' }}>
              Error: {audioState.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
