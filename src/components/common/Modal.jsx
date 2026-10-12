import { X } from './Icons';

export function Modal({ isOpen, onClose, title, children, maxWidth = '640px' }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-backdrop" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-dialog-title"
    >
      <div 
        ref={modalRef}
        className="modal-container"
        style={{ maxWidth }}
      >
        <div className="modal-header">
          <h3 id="modal-dialog-title" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
            {title}
          </h3>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close modal dialog"
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
