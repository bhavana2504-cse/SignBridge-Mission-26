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
  HelpCircle
} from '../common/Icons';
import { VideoPlayer } from '../common/VideoPlayer';
import { signService } from '../../services/signService';

export function PracticePage({ preselectedSignId = null }) {
  const allSigns = signService.getAllSigns();
  const [selectedSignId, setSelectedSignId] = useState(preselectedSignId || allSigns[0].id);
  const selectedSign = signService.getSignById(selectedSignId) || allSigns[0];

  // Camera & Recording states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);

  const videoStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const webcamPreviewRef = useRef(null);
  const userPlaybackRef = useRef(null);
  const referencePlayerRef = useRef(null);

  // If preselectedSignId changes from parent prop
  useEffect(() => {
    if (preselectedSignId) {
      setSelectedSignId(preselectedSignId);
    }
  }, [preselectedSignId]);

  // Clean up stream & timer on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
    };
  }, []);

  const stopCameraStream = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
    setIsCameraActive(false);
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

      // Attach stream to preview video
      if (webcamPreviewRef.current) {
        webcamPreviewRef.current.srcObject = stream;
        webcamPreviewRef.current.play().catch((err) => console.log('Autoplay handled:', err));
      }
    } catch (err) {
      console.error('Camera permission/access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in your browser settings to practice.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device was detected on your computer.');
      } else {
        setCameraError(`Unable to start camera: ${err.message || 'Unknown error'}`);
      }
      setIsCameraActive(false);
    }
  };

  const handleStartRecording = () => {
    if (!videoStreamRef.current) return;
    recordedChunksRef.current = [];
    setRecordedVideoUrl(null);
    setRecordingSeconds(0);

    try {
      const recorder = new MediaRecorder(videoStreamRef.current, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : ''
      });

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

      // Auto-stop after 10 seconds max
      let sec = 0;
      timerIntervalRef.current = setInterval(() => {
        sec += 1;
        setRecordingSeconds(sec);
        if (sec >= 10) {
          handleStopRecording();
        }
      }, 1000);
    } catch (err) {
      console.error('MediaRecorder initialization error:', err);
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
  };

  return (
    <div className="container practice-container" style={{ paddingTop: '2rem' }}>
      <div className="section-header">
        <span className="section-eyebrow">Self-Evaluation Studio</span>
        <h1 className="section-title">Camera Self-Practice</h1>
        <p className="section-subtitle">
          Compare your sign articulation side-by-side with the reference demonstration. Practice at your own pace without pressure.
        </p>
      </div>

      {/* Sign Picker Selector */}
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label htmlFor="sign-practice-select" style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
            Choose Sign to Practice:
          </label>
          <select
            id="sign-practice-select"
            className="speed-select"
            style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-medium)', fontSize: '0.95rem', padding: '0.4rem 0.85rem' }}
            value={selectedSignId}
            onChange={(e) => setSelectedSignId(e.target.value)}
          >
            {allSigns.map((s) => (
              <option key={s.id} value={s.id}>
                {s.word} ({s.category})
              </option>
            ))}
          </select>
        </div>

        <span className="category-badge">
          Category: {selectedSign.category}
        </span>
      </div>

      {/* Side-by-Side Dual Viewports */}
      <div className="practice-dual-grid">
        {/* Left Pane: Official Reference Video */}
        <section className="practice-pane" aria-labelledby="reference-video-heading">
          <div className="practice-pane-title">
            <h2 id="reference-video-heading" style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>
              1. Expert Reference: "{selectedSign.word}"
            </h2>
            <span className="category-badge teal">Verified ISL</span>
          </div>

          <VideoPlayer
            src={selectedSign.videoPath}
            title={selectedSign.word}
            autoPlay={true}
            loop={true}
          />

          <div style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>Visual Note:</strong> {selectedSign.description}
          </div>
        </section>

        {/* Right Pane: User Webcam / Recorded Video Playback */}
        <section className="practice-pane" aria-labelledby="user-practice-heading">
          <div className="practice-pane-title">
            <h2 id="user-practice-heading" style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>
              2. Your Practice Feed
            </h2>
            {isRecording && (
              <span className="record-indicator">
                ● Recording ({recordingSeconds}s / 10s)
              </span>
            )}
            {recordedVideoUrl && !isRecording && (
              <span className="category-badge" style={{ backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-800)' }}>
                Clip Ready for Review
              </span>
            )}
          </div>

          <div className="webcam-viewport">
            {!isCameraActive && !recordedVideoUrl && (
              <div className="webcam-inactive-placeholder">
                <Camera size={44} style={{ opacity: 0.8, marginBottom: '0.75rem' }} aria-hidden="true" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>Camera Not Enabled</h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '300px', margin: '0.25rem auto 1rem' }}>
                  Enable your webcam when you are ready to practice and record a clip.
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

            {cameraError && (
              <div className="video-error-fallback" role="alert">
                <AlertCircle size={36} color="#ef4444" aria-hidden="true" />
                <strong style={{ marginTop: '0.5rem' }}>Camera Notice</strong>
                <p>{cameraError}</p>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  style={{ marginTop: '1rem' }}
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
              aria-label="Your live webcam mirror"
            />

            {/* Recorded Video Playback Preview */}
            {recordedVideoUrl && (
              <video
                ref={userPlaybackRef}
                src={recordedVideoUrl}
                controls
                loop
                playsInline
                autoPlay
                aria-label="Playback of your recorded practice video"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="practice-action-bar">
            {isCameraActive && !isRecording && !recordedVideoUrl && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleStartRecording}
              >
                <Video size={18} />
                <span>Record Practice Clip (Max 10s)</span>
              </button>
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
                  onClick={handleStartRecording}
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
                style={{ fontSize: '0.85rem' }}
                onClick={stopCameraStream}
              >
                Turn off camera
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Privacy Notice & Technical Clarification */}
      <div className="privacy-notice" role="note">
        <ShieldCheck size={22} color="var(--color-primary-700)" aria-hidden="true" />
        <div>
          <strong>Privacy & Evaluation Notice:</strong> Your practice video is processed entirely inside your local browser memory. No recording or image data is ever sent to an external server or cloud service. This feature enables self-inspection alongside reference signing; it does not claim to automatically grade or recognize manual sign correctness.
        </div>
      </div>
    </div>
  );
}
