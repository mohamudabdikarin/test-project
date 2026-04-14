import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

const STATUS_PROGRESS = { PLANNING: 10, ACTIVE: 50, ON_HOLD: 25, COMPLETED: 100, CANCELLED: 0 };

export default function CreateProjectModal({ onClose, onCreated }) {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    location: '',
    budget: '',
    status: 'PLANNING',
    priority: 'MEDIUM',
    description: '',
    assigneeId: '',
    startDate: '',
    endDate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/company/members').then(({ data }) => {
      setMembers(data.data.members);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { ...form };
      if (payload.budget) payload.budget = Number(payload.budget);
      payload.progress = STATUS_PROGRESS[payload.status] ?? 0;
      if (!payload.assigneeId) delete payload.assigneeId;
      if (!payload.startDate) delete payload.startDate;
      if (!payload.endDate) delete payload.endDate;

      await api.post('/projects', payload);
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-8 pb-0">
          <div>
            <h2 className="text-xl font-bold text-dark">Create Project</h2>
            <p className="text-sm text-muted mt-1">Add a new project to your workspace</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-muted transition">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mx-8 mt-4 bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-medium text-dark mb-1.5">Project Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Skyline Tower"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          {/* Location + Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark mb-1.5">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark mb-1.5">Budget ($)</label>
              <input
                name="budget"
                type="number"
                value={form.budget}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark mb-1.5">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              >
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark mb-1.5">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-xs font-medium text-dark mb-1.5">Assignee</label>
            <select
              name="assigneeId"
              value={form.assigneeId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName} ({m.role})
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark mb-1.5">Start Date</label>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark mb-1.5">End Date</label>
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold text-dark rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-lg hover:opacity-90 transition disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>

        <div className="h-1.5 bg-gradient-to-r from-primary to-primary-light rounded-b-xl" />
      </div>
    </div>
  );
}
