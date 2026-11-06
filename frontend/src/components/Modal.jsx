import React from "react";

const Modal = ({ title, onClose, children }) => (
  <div
    className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="bg-card rounded-3xl shadow-2xl animate-fade-up w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xl font-bold text-ink">{title}</p>
        <button onClick={onClose} className="text-ink-muted hover:text-ink text-xl" aria-label="Close">
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
