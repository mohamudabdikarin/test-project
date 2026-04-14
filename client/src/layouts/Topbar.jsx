import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Search } from 'lucide-react';

export default function Topbar({ title, onMenuToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '';

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/projects?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <header className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-sm border-b border-card-border">
      <div className="flex items-center gap-3 sm:gap-6">
        <button onClick={onMenuToggle} className="p-1.5 rounded-lg text-light-muted hover:text-dark hover:bg-gray-100 transition lg:hidden">
          <Menu size={22} />
        </button>
        <span className="text-sm font-semibold text-primary hidden sm:inline">{title}</span>
        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-canvas rounded-lg px-3 py-1.5">
          <Search size={14} className="text-light-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="bg-transparent text-sm text-dark placeholder:text-gray-400 focus:outline-none w-28 sm:w-40"
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center text-xs font-bold text-primary border border-card-border">
          {initials}
        </div>
      </div>
    </header>
  );
}
