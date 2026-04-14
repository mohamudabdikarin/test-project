import { useState, useEffect } from 'react';
import { Save, Building2, Settings, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <div className="bg-white rounded-xl border border-card-border">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="p-2 rounded-lg bg-primary-bg">
          <Icon size={18} className="text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-dark">{title}</h3>
          <p className="text-xs text-muted">{description}</p>
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-dark mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const INPUT_CLS = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition";

export default function SettingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [company, setCompany] = useState({ name: '', email: '', phone: '' });
  const [config, setConfig] = useState({ construction_enabled: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/company/profile');
        const c = data.data.company;
        setCompany({
          name: c.name || '',
          email: c.email || '',
          phone: c.phone || '',
        });
        if (c.config) {
          setConfig({
            construction_enabled: c.config.construction_enabled ?? true,
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const saveCompany = async (e) => {
    e.preventDefault();
    setSaving('company');
    try {
      await api.patch('/company/profile', company);
      showSuccess('Company profile saved');
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving('');
    }
  };

  const saveConfig = async (e) => {
    e.preventDefault();
    setSaving('config');
    try {
      await api.patch('/company/config', config);
      showSuccess('System settings saved');
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving('');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2].map((i) => <div key={i} className="bg-white rounded-xl h-48 border border-card-border" />)}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-dark tracking-tight">Settings</h1>
        <p className="text-sm text-muted">Manage company profile and system configuration</p>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3 rounded-lg border border-green-100 animate-in">
          {success}
        </div>
      )}

      {/* Company Profile */}
      <form onSubmit={saveCompany}>
        <SectionCard icon={Building2} title="Company Profile" description="General information about your organization">
          <Field label="Company Name">
            <input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} disabled={!isAdmin} className={INPUT_CLS} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email">
              <input type="email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} disabled={!isAdmin} className={INPUT_CLS} />
            </Field>
            <Field label="Phone">
              <input value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} disabled={!isAdmin} className={INPUT_CLS} />
            </Field>
          </div>
          {isAdmin && (
            <div className="pt-2">
              <button type="submit" disabled={saving === 'company'} className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 shadow-sm">
                <Save size={16} />
                {saving === 'company' ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}
        </SectionCard>
      </form>

      {/* System Configuration */}
      <form onSubmit={saveConfig}>
        <SectionCard icon={Settings} title="System Configuration" description="System-wide preferences">
          <div className="flex items-center justify-between py-2 px-1">
            <div>
              <p className="text-sm font-medium text-dark">Construction Enabled</p>
              <p className="text-xs text-muted">Enable construction module features</p>
            </div>
            <button
              type="button"
              disabled={!isAdmin}
              onClick={() => setConfig({ ...config, construction_enabled: !config.construction_enabled })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${config.construction_enabled ? 'bg-primary' : 'bg-gray-300'} ${!isAdmin ? 'opacity-50' : ''}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${config.construction_enabled ? 'translate-x-5' : ''}`} />
            </button>
          </div>
          {isAdmin && (
            <div className="pt-2">
              <button type="submit" disabled={saving === 'config'} className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 shadow-sm">
                <Save size={16} />
                {saving === 'config' ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          )}
        </SectionCard>
      </form>

      {!isAdmin && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          <Shield size={18} className="text-amber-600" />
          <p className="text-sm text-amber-700">Only administrators can modify settings. Contact your admin for changes.</p>
        </div>
      )}
    </div>
  );
}
