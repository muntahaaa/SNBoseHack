// Add this line near the top of the file after the audioRef
const playPromiseRef = useRef(null);

// Replace the current audio play code in initializeAudio function with this:
// Start playing
console.log('Starting audio playback');
try {
  // Store the play promise in our ref
  playPromiseRef.current = audio.play();
  
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
        console.error('Play promise rejected:', error);
        playPromiseRef.current = null;
        setAudioState(prev => ({ 
          ...prev, 
          isPlaying: false,
          error: `Play error: ${error.message}`
        }));
      });
  }
} catch (error) {
  console.error('Error playing audio:', error);
  setAudioState(prev => ({ 
    ...prev, 
    isPlaying: false,
    error: 'Failed to play audio'
  }));
}

// Replace the togglePlayPause function with this:
const togglePlayPause = () => {
  console.log('Toggle play/pause called, current audio state:', audioState);
  
  if (!audioRef.current) {
    console.log('Audio reference is null, cannot toggle');
    return;
  }
  
  try {
    if (audioState.isPlaying) {
      console.log('Attempting to pause audio');
      
      // Only pause if we're not in the middle of a play operation
      if (playPromiseRef.current) {
        console.log('Play operation in progress, waiting for it to complete before pausing');
        playPromiseRef.current
          .then(() => {
            console.log('Now pausing after play promise resolved');
            if (audioRef.current) {
              audioRef.current.pause();
            }
            playPromiseRef.current = null;
          })
          .catch(err => {
            console.error('Error in play promise, still trying to pause:', err);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            playPromiseRef.current = null;
          });
      } else {
        audioRef.current.pause();
        console.log('Audio pause command issued');
      }
      // Let the event listener update the state
    } else {
      console.log('Attempting to play audio');
      // Ensure volume is set to maximum
      audioRef.current.volume = 1.0;
      
      // Store the play promise
      playPromiseRef.current = audioRef.current.play();
      
      if (playPromiseRef.current !== undefined) {
        playPromiseRef.current
          .then(() => {
            console.log('Audio play promise resolved successfully');
            playPromiseRef.current = null;
            // Let the event listener update the state
          })
          .catch(err => {
            console.error('Error playing audio:', err);
            playPromiseRef.current = null;
            setAudioState(prev => ({ 
              ...prev, 
              isPlaying: false, 
              isPaused: false,
              error: `Play error: ${err.message}`
            }));
          });
      }
    }
  } catch (error) {
    console.error('Exception in togglePlayPause:', error);
  }
};

// Replace the cleanupAudio function with this:
const cleanupAudio = () => {
  if (audioRef.current) {
    // First pause the audio safely
    if (playPromiseRef.current) {
      playPromiseRef.current
        .then(() => {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          cleanupResources();
        })
        .catch(() => {
          cleanupResources();
        });
    } else {
      audioRef.current.pause();
      cleanupResources();
    }
  } else {
    cleanupResources();
  }
  
  function cleanupResources() {
    if (audioRef.current) {
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
      error: null
    });

    // Clear play promise
    playPromiseRef.current = null;
  }
};
