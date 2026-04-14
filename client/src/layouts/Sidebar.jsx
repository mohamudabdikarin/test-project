import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '';

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 w-64 h-screen bg-sidebar border-r border-gray-200/60 flex flex-col p-4 z-30
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-2 pb-8">
          <div>
            <h1 className="text-xl font-bold text-primary-light tracking-tight leading-7">ProManager</h1>
            <p className="text-[10px] font-semibold text-muted tracking-widest uppercase">Enterprise Admin</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-light-muted hover:text-dark hover:bg-white/60 transition lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium tracking-tight transition ${
                  isActive
                    ? 'bg-white text-primary-light shadow-sm'
                    : 'text-light-muted hover:bg-white/60'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-200/10 pt-4 space-y-4">
          <button
            onClick={() => { logout(); onClose(); }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-light-muted hover:bg-white/60 transition w-full"
          >
            <LogOut size={18} />
            Logout
          </button>

          {user && (
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center text-xs font-bold text-primary">
                {initials}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-dark truncate">{user.name}</p>
                <p className="text-[10px] text-muted truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
