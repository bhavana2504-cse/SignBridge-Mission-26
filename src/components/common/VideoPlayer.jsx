import { Play, Pause, RotateCcw, Repeat, AlertCircle } from './Icons';

export function VideoPlayer({ 
  src, 
  title, 
  autoPlay = false, 
  loop = true, 
  showControls = true,
  className = ''
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(loop);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
      if (autoPlay) {
        videoRef.current.play().catch(() => {
          // Browser prevented autoplay without interaction, gracefully handle
          setIsPlaying(false);
        });
      }
    }
  }, [src]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const handleSpeedChange = (e) => {
    const rate = parseFloat(e.target.value);
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleLoop = () => {
    const next = !isLooping;
    setIsLooping(next);
    if (videoRef.current) {
      videoRef.current.loop = next;
    }
  };

  return (
    <div className={`video-player-box ${className}`} role="region" aria-label={`ISL sign video demonstration for ${title || 'sign'}`}>
      <div className="video-element-wrapper">
        {!hasError ? (
          <video
            ref={videoRef}
            src={src}
            loop={isLooping}
            playsInline
            muted
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              if (!isLooping) setIsPlaying(false);
            }}
            onError={() => {
              setHasError(true);
            }}
            aria-label={title ? `Video demonstrating ISL sign for ${title}` : 'Sign demonstration video'}
          />
        ) : (
          <div className="video-error-fallback" role="alert">
            <AlertCircle size={32} color="#f87171" aria-hidden="true" />
            <strong style={{ marginTop: '0.5rem' }}>Video Not Found</strong>
            <p>
              The reference video file for <strong>"{title}"</strong> could not be loaded. Please ensure the video is located in the <code>public/videos</code> folder.
            </p>
          </div>
        )}
      </div>

      {showControls && !hasError && (
        <div className="video-controls-bar" aria-label="Video playback options">
          <div className="video-ctrl-group">
            <button
              type="button"
              className="video-ctrl-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              type="button"
              className="video-ctrl-btn"
              onClick={handleReplay}
              aria-label="Replay sign video from start"
              title="Replay from start"
            >
              <RotateCcw size={16} aria-hidden="true" />
              <span>Replay</span>
            </button>
          </div>

          <div className="video-ctrl-group">
            <button
              type="button"
              className={`video-ctrl-btn ${isLooping ? 'active' : ''}`}
              onClick={toggleLoop}
              aria-pressed={isLooping}
              aria-label="Toggle video loop repetition"
              title="Loop continuously"
            >
              <Repeat size={15} aria-hidden="true" />
              <span>Loop</span>
            </button>

            <label htmlFor={`speed-${title || 'vid'}`} style={{ fontSize: '0.8rem', color: '#b9c7be' }}>
              Speed:
            </label>
            <select
              id={`speed-${title || 'vid'}`}
              className="speed-select"
              value={playbackRate}
              onChange={handleSpeedChange}
              aria-label="Playback speed"
            >
              <option value="0.5">0.5x (Slow)</option>
              <option value="0.75">0.75x</option>
              <option value="1">1.0x (Normal)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
