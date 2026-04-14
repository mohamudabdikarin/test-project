import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FolderKanban, DollarSign, CheckSquare, ArrowRight } from 'lucide-react';
import api from '../services/api';
import useCountUp from '../hooks/useCountUp';

function StatCard({ icon: Icon, label, rawValue, prefix = '', suffix = '', sub, accent, progress }) {
  const animatedVal = useCountUp(rawValue);
  const animatedProgress = useCountUp(progress !== undefined ? Math.round(progress) : undefined, 1400);

  return (
    <div className="group bg-white rounded-xl border border-card-border p-6 flex flex-col gap-2 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-300 cursor-default">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-muted tracking-widest uppercase">{label}</span>
        <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-primary-bg transition-colors duration-300">
          <Icon size={18} className="text-light-muted group-hover:text-primary transition-colors duration-300" />
        </div>
      </div>
      <div className="flex items-end gap-1.5 pt-2">
        <span className="text-3xl font-bold text-dark tabular-nums">{prefix}{animatedVal}{suffix}</span>
        <span className="text-sm text-muted pb-1">{sub}</span>
      </div>
      {progress !== undefined && (
        <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${animatedProgress}%`, backgroundColor: accent || '#004ac6' }}
          />
        </div>
      )}
    </div>
  );
}

function ProjectRow({ project }) {
  const statusColors = {
    PLANNING: 'bg-amber-50 text-amber-700',
    ACTIVE: 'bg-blue-50 text-blue-700',
    ON_HOLD: 'bg-gray-100 text-gray-600',
    COMPLETED: 'bg-green-50 text-green-700',
    CANCELLED: 'bg-red-50 text-red-600',
  };

  return (
    <tr className="border-t border-gray-100 hover:bg-primary-bg/30 transition-colors duration-200 cursor-pointer group">
      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
        <p className="text-sm font-medium text-dark group-hover:text-primary transition-colors">{project.name}</p>
      </td>
      <td className="py-4 px-4 sm:px-6 text-sm text-muted whitespace-nowrap">
        {project.location || '–'}
      </td>
      <td className="py-4 px-4 sm:px-6 text-sm text-dark whitespace-nowrap">
        {project.budget ? `$${Number(project.budget).toLocaleString()}` : '–'}
      </td>
      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${statusColors[project.status] || 'bg-gray-100 text-gray-600'}`}>
          {project.status.replace('_', ' ')}
        </span>
      </td>
    </tr>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, projectsRes, companyRes] = await Promise.all([
          api.get('/projects/stats'),
          api.get('/projects?limit=5'),
          api.get('/company/profile'),
        ]);
        setStats(statsRes.data.data.stats);
        setProjects(projectsRes.data.data.projects);
        setCompany(companyRes.data.data.company);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl h-36 border border-card-border" />
        ))}
      </div>
    );
  }

  const totalBudget = stats ? Number(stats.totalBudget) : 0;
  const budgetRaw = totalBudget >= 1_000_000
    ? parseFloat((totalBudget / 1_000_000).toFixed(1))
    : Math.round(totalBudget / 1_000);
  const budgetPrefix = '$';
  const budgetSuffix = totalBudget >= 1_000_000 ? 'M' : 'K';

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Members"
          rawValue={company?._count?.users || 0}
          sub="team members"
        />
        <StatCard
          icon={FolderKanban}
          label="Projects"
          rawValue={company?._count?.projects || 0}
          sub={`${stats?.byStatus?.ACTIVE || 0} active`}
        />
        <StatCard
          icon={DollarSign}
          label="Total Budget"
          rawValue={budgetRaw}
          prefix={budgetPrefix}
          suffix={budgetSuffix}
          sub="allocated"
        />
        <StatCard
          icon={CheckSquare}
          label="Completed"
          rawValue={stats?.byStatus?.COMPLETED || 0}
          sub={`of ${stats?.total || 0} projects`}
          progress={stats?.total ? ((stats?.byStatus?.COMPLETED || 0) / stats.total) * 100 : 0}
        />
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-card-border">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-dark">Milestones & Tasks</h3>
            <Link to="/projects" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-bold text-muted tracking-wider uppercase">
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Project</th>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Location</th>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Budget</th>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-sm text-muted">No projects yet</td></tr>
              ) : (
                projects.map((p) => <ProjectRow key={p.id} project={p} />)
              )}
            </tbody>
          </table>
          </div>
      </div>
    </div>
  );
}
