import { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus(); 
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 font-text"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-surface rounded-lg shadow-xl ${size === 'lg' ? 'max-w-lg' : 'max-w-md'} w-full max-h-[80vh] flex flex-col`}
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center p-4 border-b border-neutral-light">
          <h2 id="modal-title" className="text-lg font-semibold font-headings">
            {title}
          </h2>
          <button
            onClick={onClose}
            onKeyDown={handleKeyDown}
            className="text-neutral hover:text-neutral-dark"
            aria-label="Close modal"
            tabIndex={0}
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-t border-neutral-light flex justify-end space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;