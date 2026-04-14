import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Settings, Search } from 'lucide-react';

export default function Topbar({ title }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : '';

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/projects?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <header className="flex items-center justify-between h-14 px-8 bg-white/60 backdrop-blur-sm border-b border-card-border">
      <div className="flex items-center gap-6">
        <span className="text-sm font-semibold text-primary">{title}</span>
        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-canvas rounded-lg px-3 py-1.5">
          <Search size={14} className="text-light-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="bg-transparent text-sm text-dark placeholder:text-gray-400 focus:outline-none w-40"
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-light-muted hover:text-dark transition">
          <Bell size={20} />
        </button>
        <button onClick={() => navigate('/settings')} className="p-2 text-light-muted hover:text-dark transition">
          <Settings size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center text-xs font-bold text-primary border border-card-border">
          {initials}
        </div>
      </div>
    </header>
  );
}
