import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Video, 
  Square, 
  RotateCcw, 
  Trash2, 
  Play, 
  Pause, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Info
} from '../common/Icons';
import { signService } from '../../services/signService';

export function PracticePage({ preselectedSignId = null }) {
  const allSigns = signService.getAllSigns();
  const categories = ['All', ...signService.getCategories()];

  // Selection states
  const [selectedSignId, setSelectedSignId] = useState(preselectedSignId || allSigns[0].id);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const selectedSign = signService.getSignById(selectedSignId) || allSigns[0];

  // Camera & Recording states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);

  // Overlay & Visual Tools
  const [showAlignmentGuide, setShowAlignmentGuide] = useState(true);
  const [showMotionMeter, setShowMotionMeter] = useState(false);
  const [motionLevel, setMotionLevel] = useState(0);
  const [showTechDetails, setShowTechDetails] = useState(false);

  // Comparison & Sync States
  const [isSyncPlaying, setIsSyncPlaying] = useState(false);
  const [syncSpeed, setSyncSpeed] = useState(1);

  // Element Refs
  const videoStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const motionAnimFrameRef = useRef(null);
  const prevFrameCanvasRef = useRef(null);

  // Video Element Refs for direct synchronized playback
  const refVideoElement = useRef(null);
  const userPlaybackRef = useRef(null);
  const webcamPreviewRef = useRef(null);
  const overlayCanvasRef = useRef(null);

  // Handle preselectedSignId prop changes
  useEffect(() => {
    if (preselectedSignId) {
      setSelectedSignId(preselectedSignId);
    }
  }, [preselectedSignId]);

  // Clean up streams, timers, and object URLs on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (motionAnimFrameRef.current) cancelAnimationFrame(motionAnimFrameRef.current);
      if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
    };
  }, []);

  // Filtered signs list for quick selection
  const filteredSigns = allSigns.filter((s) => {
    const matchesCat = categoryFilter === 'All' || s.category === categoryFilter;
    const matchesSearch = s.word.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const stopCameraStream = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
    setIsCameraActive(false);
    if (motionAnimFrameRef.current) {
      cancelAnimationFrame(motionAnimFrameRef.current);
    }
  };

  const handleEnableCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser environment.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });

      videoStreamRef.current = stream;
      setIsCameraActive(true);

      // Attach to preview video element
      if (webcamPreviewRef.current) {
        webcamPreviewRef.current.srcObject = stream;
        webcamPreviewRef.current.play().catch((err) => console.log('Autoplay handled:', err));
      }

      // Start experimental optical motion loop if enabled
      startMotionDetection();
    } catch (err) {
      console.error('Camera permission/access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please click the camera icon in your browser URL bar to allow access.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No webcam device was detected on your machine.');
      } else {
        setCameraError(`Camera initialization failed: ${err.message || 'Unknown error'}`);
      }
      setIsCameraActive(false);
    }
  };

  // Experimental Optical Motion Differencing using standard HTML5 Canvas 2D
  const startMotionDetection = () => {
    const processFrame = () => {
      if (!webcamPreviewRef.current || !isCameraActive) return;
      const video = webcamPreviewRef.current;
      if (video.readyState >= 2) {
        if (!prevFrameCanvasRef.current) {
          prevFrameCanvasRef.current = document.createElement('canvas');
          prevFrameCanvasRef.current.width = 64;
          prevFrameCanvasRef.current.height = 48;
        }
        const smallCanvas = prevFrameCanvasRef.current;
        const sCtx = smallCanvas.getContext('2d', { willReadFrequently: true });
        if (sCtx) {
          const prevImgData = sCtx.getImageData(0, 0, 64, 48);
          sCtx.drawImage(video, 0, 0, 64, 48);
          const currentImgData = sCtx.getImageData(0, 0, 64, 48);

          // Calculate average pixel delta
          let deltaSum = 0;
          const len = currentImgData.data.length;
          for (let i = 0; i < len; i += 4) {
            const diff = Math.abs(currentImgData.data[i] - prevImgData.data[i]) +
                         Math.abs(currentImgData.data[i + 1] - prevImgData.data[i + 1]);
            deltaSum += diff;
          }
          const avgDiff = deltaSum / (len / 4);
          const level = Math.min(100, Math.round(avgDiff * 2.5));
          setMotionLevel(level);
        }
      }
      motionAnimFrameRef.current = requestAnimationFrame(processFrame);
    };

    motionAnimFrameRef.current = requestAnimationFrame(processFrame);
  };

  // Draw Posture Alignment Guide
  useEffect(() => {
    if (!overlayCanvasRef.current || !showAlignmentGuide) return;
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    ctx.strokeStyle = 'rgba(92, 84, 229, 0.45)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);

    // Head oval guide
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.32, w * 0.16, h * 0.22, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Shoulders guide curve
    ctx.beginPath();
    ctx.moveTo(w * 0.18, h * 0.65);
    ctx.quadraticCurveTo(w / 2, h * 0.52, w * 0.82, h * 0.65);
    ctx.stroke();

    // Designated signing box (chest zone)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.strokeRect(w * 0.24, h * 0.54, w * 0.52, h * 0.4);

    // Guide label
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Align Head & Signing Zone', w / 2, 24);
  }, [showAlignmentGuide, isCameraActive]);

  // Initiate Recording with 3-Second Countdown
  const handleInitiateCountdown = () => {
    setIsCountingDown(true);
    setCountdownValue(3);

    let count = 3;
    countdownIntervalRef.current = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(countdownIntervalRef.current);
        setIsCountingDown(false);
        beginActualRecording();
      } else {
        setCountdownValue(count);
      }
    }, 1000);
  };

  const beginActualRecording = () => {
    if (!videoStreamRef.current) return;
    recordedChunksRef.current = [];
    setRecordedVideoUrl(null);
    setRecordingSeconds(0);

    try {
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : '';

      const recorder = new MediaRecorder(videoStreamRef.current, mime ? { mimeType: mime } : undefined);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecording(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      // Auto-stop after 10 seconds
      let sec = 0;
      timerIntervalRef.current = setInterval(() => {
        sec += 1;
        setRecordingSeconds(sec);
        if (sec >= 10) {
          handleStopRecording();
        }
      }, 1000);
    } catch (err) {
      console.error('MediaRecorder error:', err);
      setCameraError('Recording format is not supported by your browser.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
  };

  const handleDiscardRecording = () => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedVideoUrl(null);
    setRecordingSeconds(0);
    setIsSyncPlaying(false);
  };

  // Synchronized Dual Playback Handlers
  const handleSyncPlayBoth = () => {
    if (!refVideoElement.current || !userPlaybackRef.current) return;
    
    // Synchronize both positions to 0
    refVideoElement.current.currentTime = 0;
    userPlaybackRef.current.currentTime = 0;

    refVideoElement.current.playbackRate = syncSpeed;
    userPlaybackRef.current.playbackRate = syncSpeed;

    Promise.all([
      refVideoElement.current.play(),
      userPlaybackRef.current.play()
    ])
      .then(() => setIsSyncPlaying(true))
      .catch((err) => console.log('Sync play handled:', err));
  };

  const handleSyncPauseBoth = () => {
    if (refVideoElement.current) refVideoElement.current.pause();
    if (userPlaybackRef.current) userPlaybackRef.current.pause();
    setIsSyncPlaying(false);
  };

  const handleSyncSpeedChange = (speed) => {
    setSyncSpeed(speed);
    if (refVideoElement.current) refVideoElement.current.playbackRate = speed;
    if (userPlaybackRef.current) userPlaybackRef.current.playbackRate = speed;
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <div className="section-header">
        <span className="practice-hero-badge">
          <span>📹</span>
          <span>Interactive Sign Lab</span>
        </span>
        <h1 className="section-title">Sign Practice & Side-by-Side Comparison</h1>
        <p className="section-subtitle">
          Select any standardized Indian Sign Language entry, record your attempt using your webcam, and compare your signing posture and movement side-by-side with verified expert demonstrations.
        </p>
      </div>

      {/* 1. Sign Selection Area */}
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Practicing Sign: "{selectedSign.word}"
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {selectedSign.description}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="category-badge purple">{selectedSign.category}</span>
            <span className="category-badge teal">Source: {selectedSign.sourceDataset || 'ISL'}</span>
          </div>
        </div>

        {/* Search & Quick Pick Dropdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label htmlFor="sign-category-filter" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Filter by Category:
            </label>
            <select
              id="sign-category-filter"
              className="speed-select"
              style={{ width: '100%', padding: '0.55rem 0.85rem', backgroundColor: 'var(--bg-subtle)' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sign-direct-select" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Select Sign to Practice ({filteredSigns.length} available):
            </label>
            <select
              id="sign-direct-select"
              className="speed-select"
              style={{ width: '100%', padding: '0.55rem 0.85rem', backgroundColor: 'var(--bg-subtle)' }}
              value={selectedSignId}
              onChange={(e) => setSelectedSignId(e.target.value)}
            >
              {filteredSigns.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.word} ({s.category})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side Dual Viewports */}
      <div className="practice-dual-grid">
        {/* Left Pane: Official Reference Video */}
        <section className="practice-pane" aria-labelledby="reference-sign-heading">
          <div className="practice-pane-title">
            <h2 id="reference-sign-heading" style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
              1. Expert Demonstration: "{selectedSign.word}"
            </h2>
            <span className="category-badge teal">Standard ISL</span>
          </div>

          {/* Reference Video Player */}
          <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', backgroundColor: '#0f0d22', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <video
              ref={refVideoElement}
              src={selectedSign.videoPath}
              controls
              playsInline
              loop
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
              aria-label={`Official ISL sign video for ${selectedSign.word}`}
            />
          </div>

          {/* Video Metadata & Controls Guide */}
          <div style={{ marginTop: '1rem', padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <strong style={{ color: 'var(--text-main)' }}>Movement Notes:</strong>
              <span style={{ color: 'var(--text-muted)' }}>CISLR Benchmark</span>
            </div>
            <p style={{ color: 'var(--text-body)', margin: 0, lineHeight: '1.5' }}>
              Observe the dominant hand articulation, shoulder line, and palm orientation.
            </p>
          </div>
        </section>

        {/* Right Pane: Learner Webcam / Recorded Playback */}
        <section className="practice-pane" aria-labelledby="learner-mirror-heading">
          <div className="practice-pane-title">
            <h2 id="learner-mirror-heading" style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
              2. Your Practice Feed
            </h2>
            {isRecording && (
              <span className="record-indicator">
                ● Recording ({recordingSeconds}s / 10s)
              </span>
            )}
            {recordedVideoUrl && !isRecording && (
              <span className="sync-badge">
                ✓ Recording Ready to Compare
              </span>
            )}
          </div>

          <div className="webcam-viewport">
            {/* Countdown Overlay */}
            {isCountingDown && (
              <div className="countdown-overlay">
                <span style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Get Ready!</span>
                <span className="countdown-number">{countdownValue}</span>
                <span style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.5rem' }}>Position your hands in frame</span>
              </div>
            )}

            {/* Inactive Camera Fallback */}
            {!isCameraActive && !recordedVideoUrl && (
              <div className="webcam-inactive-placeholder">
                <Camera size={44} style={{ opacity: 0.85, marginBottom: '0.75rem' }} aria-hidden="true" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>Webcam Off</h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '300px', margin: '0.35rem auto 1.25rem' }}>
                  Enable your webcam to self-inspect your hand signs and record your practice.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleEnableCamera}
                >
                  <Camera size={18} />
                  <span>Enable Webcam</span>
                </button>
              </div>
            )}

            {/* Error Message */}
            {cameraError && (
              <div className="video-error-fallback" role="alert">
                <AlertCircle size={36} color="#ef4444" aria-hidden="true" />
                <strong style={{ marginTop: '0.5rem' }}>Camera Notice</strong>
                <p style={{ fontSize: '0.85rem' }}>{cameraError}</p>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  style={{ marginTop: '0.85rem' }}
                  onClick={handleEnableCamera}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Live Camera Stream */}
            <video
              ref={webcamPreviewRef}
              playsInline
              muted
              style={{
                display: isCameraActive && !recordedVideoUrl ? 'block' : 'none'
              }}
              aria-label="Your live webcam feed mirror"
            />

            {/* Alignment Guide Canvas */}
            {isCameraActive && !recordedVideoUrl && showAlignmentGuide && (
              <canvas
                ref={overlayCanvasRef}
                width={640}
                height={480}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none'
                }}
              />
            )}

            {/* Experimental Motion Meter Tag */}
            {isCameraActive && !recordedVideoUrl && showMotionMeter && (
              <div className="motion-meter-box">
                <span>Motion:</span>
                <div className="motion-bar-track">
                  <div className="motion-bar-fill" style={{ width: `${motionLevel}%` }}></div>
                </div>
                <span>{motionLevel}%</span>
              </div>
            )}

            {/* Recorded Video Playback */}
            {recordedVideoUrl && (
              <video
                ref={userPlaybackRef}
                src={recordedVideoUrl}
                controls
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                aria-label="Playback of your recorded practice video"
              />
            )}
          </div>

          {/* Camera Action Buttons & Controls */}
          <div className="practice-action-bar">
            {isCameraActive && !isRecording && !recordedVideoUrl && !isCountingDown && (
              <>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleInitiateCountdown}
                >
                  <Video size={18} />
                  <span>Start 3s Countdown & Record (Max 10s)</span>
                </button>

                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setShowAlignmentGuide(!showAlignmentGuide)}
                  title="Toggle Posture & Signing Zone Outline"
                >
                  <span>{showAlignmentGuide ? 'Hide Guide' : 'Show Guide'}</span>
                </button>

                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setShowMotionMeter(!showMotionMeter)}
                  title="Toggle Experimental Optical Motion Meter"
                >
                  <span>{showMotionMeter ? 'Hide Motion' : 'Motion Meter'}</span>
                </button>
              </>
            )}

            {isRecording && (
              <button
                type="button"
                className="btn-primary"
                style={{ backgroundColor: '#dc2626' }}
                onClick={handleStopRecording}
              >
                <Square size={18} />
                <span>Stop Recording ({recordingSeconds}s)</span>
              </button>
            )}

            {recordedVideoUrl && (
              <>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => {
                    handleDiscardRecording();
                    handleInitiateCountdown();
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Record Again</span>
                </button>

                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                  onClick={handleDiscardRecording}
                >
                  <Trash2 size={16} />
                  <span>Discard Clip</span>
                </button>
              </>
            )}

            {isCameraActive && (
              <button
                type="button"
                className="footer-btn-link"
                style={{ fontSize: '0.85rem', marginLeft: 'auto' }}
                onClick={stopCameraStream}
              >
                Turn off camera
              </button>
            )}
          </div>
        </section>
      </div>

      {/* 3. Synchronized Dual Playback Comparison Bar */}
      {recordedVideoUrl && (
        <section className="sync-comparison-card" aria-labelledby="sync-comparison-heading">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="sync-badge">⚡ Synchronized Review Mode</span>
              <h2 id="sync-comparison-heading" style={{ fontSize: '1.35rem', fontWeight: '800', marginTop: '0.35rem', color: 'var(--text-main)' }}>
                Compare Demonstrator & Your Clip Side-by-Side
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                Play both clips in tandem or at half-speed to compare finger formation, palm angle, and signing cadence.
              </p>
            </div>

            {/* Speed Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>Playback Rate:</span>
              <button
                type="button"
                className={`btn-secondary btn-sm ${syncSpeed === 0.5 ? 'active' : ''}`}
                style={{ backgroundColor: syncSpeed === 0.5 ? 'var(--color-primary-100)' : 'transparent', fontWeight: '700' }}
                onClick={() => handleSyncSpeedChange(0.5)}
              >
                0.5x Slow-Mo
              </button>
              <button
                type="button"
                className={`btn-secondary btn-sm ${syncSpeed === 1 ? 'active' : ''}`}
                style={{ backgroundColor: syncSpeed === 1 ? 'var(--color-primary-100)' : 'transparent', fontWeight: '700' }}
                onClick={() => handleSyncSpeedChange(1)}
              >
                1.0x Normal
              </button>
            </div>
          </div>

          <div className="sync-controls-row">
            <div className="sync-btn-group">
              <button
                type="button"
                className="btn-primary"
                onClick={handleSyncPlayBoth}
              >
                <Play size={18} />
                <span>Play Both Synchronously</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleSyncPauseBoth}
              >
                <Pause size={18} />
                <span>Pause Both</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleSyncPlayBoth}
              >
                <RotateCcw size={16} />
                <span>Restart Both from 0:00</span>
              </button>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Independent native controls on either video remain active.
            </div>
          </div>
        </section>
      )}

      {/* 4. Linguistic Correctness vs Visual Similarity Distinction (Requirement 7) */}
      <div className="notice-box warning" role="note">
        <AlertCircle size={26} color="#d97706" style={{ flexShrink: 0, marginTop: '0.15rem' }} aria-hidden="true" />
        <div>
          <strong style={{ fontSize: '1rem', color: '#92400e' }}>
            Linguistic Accuracy vs. Movement Similarity Notice
          </strong>
          <p style={{ fontSize: '0.875rem', color: '#78350f', marginTop: '0.35rem', lineHeight: '1.55' }}>
            Visual side-by-side replay allows you to self-evaluate hand orientation, facial expression, and trajectory against expert demonstrators. However, <strong>visual optical motion is not equivalent to validated ISL correctness</strong>. Indian Sign Language involves complex 3D hand shapes, spatial orientation, and non-manual grammatical cues. SignBridge does not label signs as "Correct" or "Incorrect" without certified 3D landmark evaluation.
          </p>
        </div>
      </div>

      {/* 5. Requirements for Automatic Evaluation (Requirement 8) */}
      <div className="notice-box info" role="region" aria-labelledby="ai-eval-heading">
        <Info size={26} color="var(--color-primary-600)" style={{ flexShrink: 0, marginTop: '0.15rem' }} aria-hidden="true" />
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong id="ai-eval-heading" style={{ fontSize: '1rem', color: 'var(--color-primary-900)' }}>
              Technical Requirements for Automated ISL Evaluation
            </strong>
            <button
              type="button"
              className="footer-btn-link"
              style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--color-primary-700)' }}
              onClick={() => setShowTechDetails(!showTechDetails)}
            >
              {showTechDetails ? 'Hide Architecture' : 'View Architecture'}
            </button>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', marginTop: '0.35rem', lineHeight: '1.55' }}>
            Automatic landmark recognition is not feasible with the current zero-dependency local setup. To support certified offline AI evaluation in the future, the following components would be required:
          </p>

          {showTechDetails && (
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: '1.6' }}>
              <li><strong>Local Pose & Hand Estimator:</strong> Bundled offline landmark tracking (e.g. MediaPipe Holistic or TensorFlow.js) to extract 21 finger joints per hand and 33 body posture coordinates at 30 FPS.</li>
              <li><strong>Spatial Calibration & Normalization:</strong> Mathematical coordinate normalization to ensure evaluation is invariant to learner height, camera distance, and perspective distortion.</li>
              <li><strong>Temporal Sequence Classifier:</strong> A Dynamic Time Warping (DTW) or Transformer-based temporal model trained on standardized CISLR/ISL500 sign sequences.</li>
              <li><strong>Zero-Cloud Guarantee:</strong> Pre-compiled client-side WebAssembly weights (.onnx or .tflite) loaded from local public assets to preserve privacy.</li>
            </ul>
          )}
        </div>
      </div>

      {/* 6. Privacy & Offline Data Assurance */}
      <div className="privacy-notice" style={{ marginTop: '1.5rem' }} role="note">
        <ShieldCheck size={22} color="var(--color-primary-700)" aria-hidden="true" />
        <div>
          <strong>Privacy & Security:</strong> Your webcam video stream and practice clips are processed strictly inside your local browser memory using HTML5 MediaRecorder. No video files or personal images are ever recorded to disks or transmitted over the internet.
        </div>
      </div>
    </div>
  );
}

export default PracticePage;
