import { AlertTriangle, Info } from 'lucide-react';

export default function ConfirmModal({ title, message, confirmLabel = 'Confirm', variant = 'danger', onConfirm, onCancel }) {
  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onCancel}>
      <div
        className="bg-white rounded-xl w-full max-w-sm shadow-xl animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 pb-6 text-center">
          <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isDanger ? 'bg-red-50' : 'bg-primary-bg'}`}>
            {isDanger
              ? <AlertTriangle size={28} className="text-red-500" />
              : <Info size={28} className="text-primary" />
            }
          </div>
          <h3 className="text-lg font-bold text-dark mb-2">{title}</h3>
          <p className="text-sm text-muted leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 px-8 pb-8">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-sm font-semibold text-dark rounded-lg border border-gray-200 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-sm font-semibold text-white rounded-lg transition shadow-sm ${
              isDanger
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90'
                : 'bg-gradient-to-r from-primary to-primary-light hover:opacity-90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>

        <div className={`h-1.5 rounded-b-xl ${isDanger ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-primary to-primary-light'}`} />
      </div>
    </div>
  );
}
