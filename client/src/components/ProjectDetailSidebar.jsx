import { X, MapPin, DollarSign } from 'lucide-react';

const STATUS_COLORS = {
  PLANNING: 'bg-amber-50 text-amber-700 border-amber-200',
  ACTIVE: 'bg-blue-50 text-blue-700 border-blue-200',
  ON_HOLD: 'bg-gray-100 text-gray-600 border-gray-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
};

function DetailRow({ icon: Icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon size={16} className="text-light-muted mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted uppercase tracking-wider font-medium">{label}</p>
        <p className="text-sm text-dark mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function ProjectDetailSidebar({ project, onClose }) {
  if (!project) return null;

  const formatBudget = (b) => {
    if (!b) return null;
    const n = Number(b);
    return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${n.toLocaleString()}`;
  };

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-screen w-[420px] bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
          <div className="min-w-0 pr-4">
            <h2 className="text-lg font-bold text-dark truncate">{project.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${STATUS_COLORS[project.status]}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-muted transition shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Details</h4>
            <div className="divide-y divide-gray-50">
              <DetailRow icon={MapPin} label="Location" value={project.location} />
              <DetailRow icon={DollarSign} label="Budget" value={formatBudget(project.budget)} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
