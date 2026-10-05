import React from 'react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className={`relative ${maxWidth} w-full bg-white border border-slate-200/60 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-scaleIn`}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-slate-100 p-5 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-2xl z-10">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        {/* Content */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
