import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CreateProjectModal from '../components/CreateProjectModal';
import EditProjectModal from '../components/EditProjectModal';
import ConfirmModal from '../components/ConfirmModal';
import ProjectDetailSidebar from '../components/ProjectDetailSidebar';

const STATUS_COLORS = {
  PLANNING: 'bg-amber-50 text-amber-700',
  ACTIVE: 'bg-blue-50 text-blue-700',
  ON_HOLD: 'bg-gray-100 text-gray-600',
  COMPLETED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-600',
};

const PRIORITY_COLORS = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-50 text-blue-600',
  HIGH: 'bg-orange-50 text-orange-600',
  CRITICAL: 'bg-red-50 text-red-600',
};

const STATUS_PROGRESS = {
  PLANNING: 10,
  ACTIVE: 50,
  ON_HOLD: 25,
  COMPLETED: 100,
  CANCELLED: 0,
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const canWrite = ['ADMIN', 'MANAGER'].includes(user?.role);
  const canDelete = user?.role === 'ADMIN';

  const fetchProjects = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/projects', { params });
      setProjects(data.data.projects);
      setPagination(data.data.pagination);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchProjects(1);
  }, [fetchProjects]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/projects/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchProjects(pagination.page);
    } catch {}
  };

  const handleCreated = () => {
    setShowModal(false);
    fetchProjects(1);
  };

  const handleUpdated = () => {
    setEditProject(null);
    fetchProjects(pagination.page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">Projects</h1>
          <p className="text-sm text-muted">{pagination.total} total projects</p>
        </div>
        {canWrite && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition shadow-sm"
          >
            <Plus size={16} />
            New Project
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white rounded-lg border border-card-border px-3 py-2 flex-1 max-w-xs">
          <Search size={16} className="text-light-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm focus:outline-none w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-card-border rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Status</option>
          <option value="PLANNING">Planning</option>
          <option value="ACTIVE">Active</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-card-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-bold text-muted tracking-wider uppercase border-b border-gray-100">
              <th className="px-6 py-3">Project</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3">Progress</th>
              <th className="px-6 py-3">Assignee</th>
              <th className="px-6 py-3">Due Date</th>
              {canWrite && <th className="px-6 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-t border-gray-50">
                <td colSpan={canWrite ? 7 : 6} className="py-5 px-6">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                </td>
              </tr>
            ))}
            {!loading && projects.length === 0 && (
              <tr>
                <td colSpan={canWrite ? 7 : 6} className="text-center py-12 text-sm text-muted">
                  No projects found
                </td>
              </tr>
            )}
            {!loading && projects.map((p) => {
              const progress = STATUS_PROGRESS[p.status] ?? 0;
              return (
                <tr
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="border-t border-gray-50 hover:bg-primary-bg/20 transition cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-dark">{p.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${STATUS_COLORS[p.status]}`}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${PRIORITY_COLORS[p.priority]}`}>
                      {p.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted">{progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark">
                    {p.assignee ? `${p.assignee.firstName} ${p.assignee.lastName[0]}.` : '–'}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    {p.endDate ? new Date(p.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '–'}
                  </td>
                  {canWrite && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditProject(p); }}
                          className="p-1.5 text-light-muted hover:text-primary transition rounded-md hover:bg-primary-bg"
                        >
                          <Pencil size={14} />
                        </button>
                        {canDelete && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
                            className="p-1.5 text-light-muted hover:text-red-500 transition rounded-md hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => fetchProjects(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-card-border text-muted hover:bg-white disabled:opacity-40 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => fetchProjects(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-card-border text-muted hover:bg-white disabled:opacity-40 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}
      {editProject && <EditProjectModal project={editProject} onClose={() => setEditProject(null)} onUpdated={handleUpdated} />}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Project"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      <ProjectDetailSidebar project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
