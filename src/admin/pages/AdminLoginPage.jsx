import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import {
  ArrowRight,
  ShieldCheck,
  UserCheck,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { getLiveSiteUrl } from '../../utils/siteUrl';

export const AdminLoginPage = () => {
  const { adminUser, loginAdmin, showToast } = useNews();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const destination = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (adminUser) {
      navigate('/admin', { replace: true });
    }
  }, [adminUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter an editor email address.', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginAdmin({
        email: email.trim(),
        name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
        role: 'Desk Editor',
        bureau: 'Kochi HQ'
      });
      setLoading(false);
      showToast('Welcome to the News Now Editorial Desk!', 'success');
      navigate(destination, { replace: true });
    }, 450);
  };

  const handleQuickLogin = (roleType) => {
    setLoading(true);
    setTimeout(() => {
      if (roleType === 'chief') {
        loginAdmin({
          name: 'Arun Varma',
          email: 'editor@newsnow.in',
          role: 'Chief Editor',
          bureau: 'Kochi HQ',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
        });
      } else {
        loginAdmin({
          name: 'Ananya Nambiar',
          email: 'ananya@newsnow.in',
          role: 'Senior Tech Desk Editor',
          bureau: 'Maker Village / Infopark',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
        });
      }
      setLoading(false);
      showToast('Authenticated as Editorial Lead!', 'success');
      navigate(destination, { replace: true });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-neutral-100">
      {/* Subtle ambient newsroom glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Masthead */}
        <div className="text-center">
          <a
            href={getLiveSiteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 group"
            title="Open Live Public Newspaper"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-rose-700 text-white rounded-2xl flex items-center justify-center font-sans font-black text-xl tracking-tight shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-all">
              NN
            </div>
          </a>
          <h2 className="mt-4 font-serif font-black text-3xl tracking-tight text-white">
            NEWS NOW
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              Editorial CMS Desk
            </span>
            <span className="w-1 h-1 rounded-full bg-rose-500" />
            <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold">
              Restricted Portal
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="mt-8 bg-[#121419] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* 1-Click Quick Demo Sign In Options */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quick Editorial Sign-In:
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                Instant Access
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('chief')}
                disabled={loading}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-rose-500/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
                    alt="Arun Varma"
                    className="w-9 h-9 rounded-lg object-cover ring-1 ring-neutral-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                      Arun Varma
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      Chief Editor • Executive Newsroom
                    </div>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-neutral-500 group-hover:text-rose-400 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('tech')}
                disabled={loading}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-rose-500/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80"
                    alt="Ananya Nambiar"
                    className="w-9 h-9 rounded-lg object-cover ring-1 ring-neutral-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                      Ananya Nambiar
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      Senior Tech Desk Editor • Kochi Infopark
                    </div>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-neutral-500 group-hover:text-rose-400 transition-colors" />
              </button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#121419] px-3 font-mono text-[10px] text-neutral-400 tracking-wider">
                Or Sign In with Credentials
              </span>
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Editor Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editor@newsnow.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-rose-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-hidden focus:border-rose-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold tracking-wide shadow-md shadow-rose-900/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
            >
              <span>{loading ? 'Authenticating...' : 'Access Admin Workspace'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Secure Notice */}
          <div className="mt-6 pt-5 border-t border-neutral-800/80 flex items-start gap-2.5 text-[11px] text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              End-to-end editorial audit trail active. All dispatch changes and headline retractions are recorded under journalistic compliance guidelines.
            </span>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href={getLiveSiteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <span>Return to Live Public Newspaper</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
