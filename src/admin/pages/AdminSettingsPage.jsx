import React, { useState, useRef, useMemo } from 'react';
import { useNews } from '../../context/NewsContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  Download,
  Upload,
  RotateCcw,
  Save,
  Building,
  HardDrive,
  ShieldCheck,
  Globe,
  Activity,
  Search,
  Lock,
  Clock,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export const AdminSettingsPage = () => {
  const {
    adminUser,
    loginAdmin,
    resetAllDataToDefaults,
    exportBackupJSON,
    importBackupJSON,
    articles,
    auditLogs,
    logActivity,
    showToast
  } = useNews();

  // Settings State
  const [siteName, setSiteName] = useState('NEWS NOW');
  const [tagline, setTagline] = useState('South Asian Deep-Tech, Sovereign Hardware & Broadsheet Journalism');
  const [hqAddress, setHqAddress] = useState('4th Floor, Athulya Building, Infopark Phase I, Kakkanad, Ernakulam, Kerala 682042');
  const [editorEmail, setEditorEmail] = useState(adminUser?.email || 'editor@newsnow.in');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST)');
  const [dateFormat, setDateFormat] = useState('DD MMM YYYY, HH:mm [IST]');
  const [language, setLanguage] = useState('English (Broadsheet Master)');

  // Security & 2FA State
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('8 hours');
  const [ipAllowlist, setIpAllowlist] = useState(false);

  // Audit Log Filter & Search
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilterAction, setAuditFilterAction] = useState('ALL');

  // Reset confirmation modal state
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const fileInputRef = useRef(null);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    loginAdmin({
      ...adminUser,
      email: editorEmail
    });
    if (logActivity) {
      logActivity('SETTINGS_UPDATED', `Newsroom Masthead and Security policies updated by ${adminUser?.name || 'Chief Editor'}`);
    }
    showToast('Newsroom masthead and security settings saved! ⚙️', 'success');
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result);
        const success = importBackupJSON(json);
        if (success) {
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      } catch {
        showToast('Invalid JSON file format.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const filteredLogs = useMemo(() => {
    return (auditLogs || []).filter(log => {
      const matchesSearch =
        (log.user || '').toLowerCase().includes(auditSearch.toLowerCase()) ||
        (log.action || '').toLowerCase().includes(auditSearch.toLowerCase()) ||
        (log.target || '').toLowerCase().includes(auditSearch.toLowerCase());
      const matchesAction = auditFilterAction === 'ALL' || log.action === auditFilterAction;
      return matchesSearch && matchesAction;
    });
  }, [auditLogs, auditSearch, auditFilterAction]);

  const getActionBadgeColor = (action) => {
    if (action.includes('PUBLISH')) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
    if (action.includes('SUBMIT') || action.includes('REVIEW')) return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
    if (action.includes('MEDIA')) return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30';
    if (action.includes('COMMENT') || action.includes('BAN')) return 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30';
    if (action.includes('LAYOUT') || action.includes('TICKER')) return 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30';
    return 'bg-neutral-500/15 text-neutral-700 dark:text-neutral-400 border-neutral-500/30';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <div>
        <h2 className="font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white">
          Newsroom & Masthead Settings
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure publication masthead metadata, staff 2FA security, dateline localization, and inspect live activity audit logs.
        </p>
      </div>

      {/* 2. Masthead & Publication Settings Form */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <Building className="w-5 h-5 text-rose-600" />
          <div>
            <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
              Editorial Masthead & Bureau Identification
            </h3>
            <p className="text-xs text-neutral-500">
              Published on the newspaper cover, footer masthead, and syndication feeds.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Publication Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Executive Editor Contact
              </label>
              <input
                type="email"
                value={editorEmail}
                onChange={(e) => setEditorEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Masthead Tagline & Mission
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Headquarters Address
            </label>
            <input
              type="text"
              value={hqAddress}
              onChange={(e) => setHqAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs shadow-rose-600/30 transition-all hover:scale-102"
            >
              <Save className="w-4 h-4" />
              <span>Save Masthead Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Localization & Dateline Settings */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <Globe className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
              Localization & Dateline Standards
            </h3>
            <p className="text-xs text-neutral-500">
              Control dateline stamps on wire dispatches and reader language preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Primary Dateline Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
            >
              <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST, UTC+05:30)</option>
              <option value="UTC">Universal Coordinated Time (UTC+00:00)</option>
              <option value="Asia/Dubai (GST)">Asia/Dubai (GST, UTC+04:00)</option>
              <option value="America/New_York (EST)">America/New_York (EST, UTC-05:00)</option>
              <option value="Europe/London (GMT)">Europe/London (GMT/BST)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Dateline Date Format
            </label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
            >
              <option value="DD MMM YYYY, HH:mm [IST]">12 Oct 2026, 14:30 IST (Broadsheet Wire)</option>
              <option value="YYYY-MM-DD HH:mm:ss">2026-10-12 14:30:00 (ISO Standard)</option>
              <option value="MMM D, YYYY h:mm A">Oct 12, 2026 2:30 PM (US Format)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Editorial Language Switcher
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
            >
              <option value="English (Broadsheet Master)">English (Broadsheet Master)</option>
              <option value="Malayalam (കേരള ഡെസ്ക്)">Malayalam (കേരള ഡെസ്ക്)</option>
              <option value="Hindi (राष्ट्रीय संस्करण)">Hindi (राष्ट्रीय संस्करण)</option>
              <option value="Tamil (சென்னை பதிப்பு)">Tamil (சென்னை பதிப்பு)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Staff Security & Two-Factor Authentication (2FA) */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                Newsroom Security & Staff 2FA Policy
              </h3>
              <p className="text-xs text-neutral-500">
                Protect publishing credentials from unauthorized wire dispatches and account compromise.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>2FA Active for 8 Staff Members</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Enforce 2FA Switch */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  Mandatory 2FA
                </h4>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Require TOTP authenticator app or hardware FIDO2 key upon editorial login.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEnforce2FA(!enforce2FA);
                showToast(`Staff 2FA enforcement ${!enforce2FA ? 'enabled' : 'relaxed'}.`, 'info');
              }}
              className={`w-11 h-6 shrink-0 rounded-full transition-colors relative cursor-pointer ${
                enforce2FA ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  enforce2FA ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Session Timeout */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                Editorial Idle Timeout
              </h4>
            </div>
            <p className="text-[11px] text-neutral-500 mb-2">
              Auto-lock session when journalist is inactive:
            </p>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-hidden"
            >
              <option value="15 minutes">15 Minutes (Strict)</option>
              <option value="1 hour">1 Hour</option>
              <option value="8 hours">8 Hours (Working Shift)</option>
              <option value="24 hours">24 Hours</option>
            </select>
          </div>

          {/* Bureau IP Restriction */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  Bureau IP Allowlist
                </h4>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Restrict live dispatch publishing to registered Kochi & Delhi newsroom VPN IPs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIpAllowlist(!ipAllowlist);
                showToast(`Bureau IP restrictions ${!ipAllowlist ? 'enabled' : 'disabled'}.`, 'info');
              }}
              className={`w-11 h-6 shrink-0 rounded-full transition-colors relative cursor-pointer ${
                ipAllowlist ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  ipAllowlist ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* 5. Live Editorial Activity Audit Trail */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-600" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                  Newsroom Activity Audit Trail
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {auditLogs?.length || 0} events logged
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Immutable chronological log of all article publications, reviews, media uploads, and permission shifts.
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search staff or action..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 w-48 focus:outline-hidden"
              />
            </div>

            <select
              value={auditFilterAction}
              onChange={(e) => setAuditFilterAction(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-hidden"
            >
              <option value="ALL">All Actions</option>
              <option value="ARTICLE_PUBLISHED">ARTICLE_PUBLISHED</option>
              <option value="ARTICLE_SUBMITTED_FOR_REVIEW">ARTICLE_SUBMITTED</option>
              <option value="SETTINGS_UPDATED">SETTINGS_UPDATED</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto rounded-xl border border-neutral-200/80 dark:border-neutral-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/80 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 font-mono text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                <th className="py-2.5 px-4 font-semibold">Staff Actor</th>
                <th className="py-2.5 px-4 font-semibold">Action Trigger</th>
                <th className="py-2.5 px-4 font-semibold">Target Entity / Detail</th>
                <th className="py-2.5 px-4 font-semibold text-right">Bureau / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">
                    No activity logs match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.slice(0, 15).map((log, index) => (
                  <tr key={`${log.id || 'log'}-${index}`} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} •{' '}
                      {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">{log.user}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{log.role}</div>
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-neutral-700 dark:text-neutral-300 max-w-xs truncate" title={log.target}>
                      {log.target}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-neutral-400 text-right whitespace-nowrap">
                      {log.ip || '103.24.18.91 (Kochi HQ)'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Newsroom Database & Data Management */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <HardDrive className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
              Data Management & System Snapshots
            </h3>
            <p className="text-xs text-neutral-500">
              Export and restore all {articles.length} dispatches, breaking alerts, and staff roles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Export JSON */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 w-fit mb-2">
                <Download className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                Export JSON Backup
              </h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Download a full snapshot of all published articles, media assets, team roles, and settings as a JSON file.
              </p>
            </div>

            <button
              type="button"
              onClick={exportBackupJSON}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span>Download Backup</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 w-fit mb-2">
                <Upload className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                Restore from Backup
              </h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Restore articles, comments, and desk configurations from a previous JSON snapshot.
              </p>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 w-full py-2 px-3 rounded-lg bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-500" />
                <span>Upload JSON File</span>
              </button>
            </div>
          </div>

          {/* Reset Mock Data */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 w-fit mb-2">
                <RotateCcw className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                Factory Edition Reset
              </h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Restore default launch edition dispatches, breaking news tickers, and inbox leads.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setResetModalOpen(true)}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-400 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>

        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={resetModalOpen}
        title="Reset All Newsroom Data?"
        message="This will restore all articles, breaking alerts, categories, and settings back to the default launch edition. Any custom articles or drafts created in this session will be reverted."
        confirmText="Confirm Reset"
        confirmVariant="danger"
        onConfirm={resetAllDataToDefaults}
        onClose={() => setResetModalOpen(false)}
      />

    </div>
  );
};
