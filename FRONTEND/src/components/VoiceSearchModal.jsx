import { useState, useEffect } from 'react';
import { FiMic, FiX, FiVolume2 } from 'react-icons/fi';

const VoiceSearchModal = ({ isOpen, onClose, onSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setErrorMsg('');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg('Voice recognition is not supported in this browser. Try Chrome, Edge, or mobile browser.');
      return;
    }

    let recognition;
    try {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        if (event.results[current].isFinal) {
          setTimeout(() => {
            onSearch(text);
            onClose();
          }, 600);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone permission was denied. Please allow microphone access in browser settings.');
        } else if (event.error === 'no-speech') {
          setErrorMsg('No speech detected. Please tap the mic and try speaking again.');
        } else {
          setErrorMsg(`Voice input error (${event.error}). You can try again or use quick search chips below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setErrorMsg('Could not initialize speech recognition.');
    }

    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch {}
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const quickPrompts = ['iPhone 15', 'Sony Headphones', 'Apple Watch', 'HP Laptop', 'PlayStation 5', 'Puma Shoes', 'Samsung TV'];

  const handlePromptClick = (text) => {
    setTranscript(text);
    setTimeout(() => {
      onSearch(text);
      onClose();
    }, 400);
  };

  const retryListening = () => {
    setErrorMsg('');
    setTranscript('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.lang = 'en-IN';
        rec.onstart = () => setIsListening(true);
        rec.onresult = (e) => {
          const text = e.results[0][0].transcript;
          setTranscript(text);
          setTimeout(() => {
            onSearch(text);
            onClose();
          }, 600);
        };
        rec.onerror = () => {
          setIsListening(false);
          setErrorMsg('Unable to capture voice. Try picking a search term below.');
        };
        rec.onend = () => setIsListening(false);
        rec.start();
      } catch {
        setErrorMsg('Microphone error.');
      }
    }
  };

  return (
    <div className="voice-modal-overlay" onClick={onClose}>
      <div className="voice-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="voice-modal-close" onClick={onClose} aria-label="Close voice search">
          <FiX />
        </button>

        <div className="voice-header">
          <span className="voice-tag">CRUSENT VOICE ASSISTANT</span>
          <h3>{isListening ? 'Listening...' : 'Search by Voice'}</h3>
          <p className="voice-instruction">
            {isListening
              ? 'Speak the product name, category, or brand'
              : transcript
              ? `Heard: "${transcript}"`
              : 'Tap the microphone and say what you are looking for'}
          </p>
        </div>

        <div className="voice-pulse-container" onClick={retryListening} role="button" tabIndex={0}>
          <div className={`voice-mic-bubble ${isListening ? 'listening' : ''}`}>
            <FiMic className="voice-mic-icon" />
          </div>
          {isListening && (
            <>
              <div className="voice-wave wave-1"></div>
              <div className="voice-wave wave-2"></div>
              <div className="voice-wave wave-3"></div>
            </>
          )}
        </div>

        {transcript && (
          <div className="voice-transcript-box">
            <FiVolume2 style={{ color: '#2874f0', marginRight: '8px' }} />
            <span>"{transcript}"</span>
          </div>
        )}

        {errorMsg && <div className="voice-error-text">{errorMsg}</div>}

        <div className="voice-quick-section">
          <span className="voice-quick-title">Or try saying:</span>
          <div className="voice-chips">
            {quickPrompts.map((p) => (
              <button key={p} className="voice-chip-btn" onClick={() => handlePromptClick(p)}>
                "{p}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSearchModal;
