import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  UserPlus,
  Mail,
  MapPin,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  KeyRound,
  X
} from 'lucide-react';
import { ROLE_PERMISSIONS } from '../../data/mockCmsData';

export const AdminTeamPage = () => {
  const {
    teamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    currentRole,
    switchRole,
    showToast
  } = useNews();

  // Add / Edit Member Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('Reporter / Staff Writer');
  const [formBureau, setFormBureau] = useState('Kochi Infopark Bureau');
  const [formBio, setFormBio] = useState('');
  const [formHandle, setFormHandle] = useState('@');
  const [formAvatar, setFormAvatar] = useState('');

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormName('');
    setFormEmail('');
    setFormRole('Reporter / Staff Writer');
    setFormBureau('Kochi Infopark Bureau');
    setFormBio('');
    setFormHandle('@');
    setFormAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormEmail(member.email);
    setFormRole(member.role);
    setFormBureau(member.bureau);
    setFormBio(member.bio || '');
    setFormHandle(member.handle || '@');
    setFormAvatar(member.avatar || '');
    setIsModalOpen(true);
  };

  const handleSaveMember = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      showToast('Please provide a name and email address.', 'error');
      return;
    }

    if (editingMember) {
      updateTeamMember(editingMember.id, {
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        bureau: formBureau.trim(),
        bio: formBio.trim(),
        handle: formHandle.trim(),
        avatar: formAvatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
      });
    } else {
      addTeamMember({
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        bureau: formBureau.trim(),
        bio: formBio.trim(),
        handle: formHandle.trim(),
        avatar: formAvatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header with Add Staff CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold">
              Newsroom Staff & Bureau Governance
            </span>
          </div>
          <h2 className="mt-1 font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Staff Directory & Role Permissions (RBAC)
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage journalists, bureau editors, correspondent credentials, and role-based publishing authorization.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs shadow-rose-600/20 transition-all hover:scale-102 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Journalist</span>
        </button>
      </div>

      {/* 2. Interactive Live Role Switcher (Crucial for RBAC Testing) */}
      <div className="bg-gradient-to-r from-neutral-900 via-[#161822] to-neutral-900 text-white rounded-2xl p-5 border border-neutral-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-rose-400" />
              <span className="font-serif font-bold text-sm text-neutral-100">
                Interactive RBAC Role Simulator
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Switch your active staff identity to immediately preview how the CMS gates live publishing, settings, and review queues.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono">Current Session:</span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-600/30 text-rose-400 font-mono text-xs font-bold border border-rose-500/40">
              {currentRole}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-4">
          {Object.keys(ROLE_PERMISSIONS).map(role => {
            const isSelected = currentRole === role;
            return (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-500 shadow-sm shadow-rose-600/30'
                    : 'bg-neutral-800/60 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <div className="text-xs font-bold truncate">{role}</div>
                <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-rose-100' : 'text-neutral-400'}`}>
                  {role === 'Reporter / Staff Writer' ? 'Draft & Review Only' : (role === 'Guest Contributor' ? 'Draft Only' : 'Can Publish Live')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-[#111317] rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                    alt={member.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-neutral-200 dark:ring-neutral-800 shrink-0"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      {member.name}
                    </h3>
                    <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                      {member.handle}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${ROLE_PERMISSIONS[member.role]?.badge || 'bg-neutral-100 text-neutral-600'}`}>
                  {member.role.split(' ')[0]}
                </span>
              </div>

              <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {member.bio || 'Staff correspondent covering regional investigations and newsroom features.'}
              </p>

              <div className="mt-3 space-y-1.5 text-xs text-neutral-500">
                <div className="flex items-center gap-2 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{member.bureau}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="font-mono truncate">{member.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="font-mono text-neutral-400 text-[11px]">
                {member.storiesCount} Published Dispatches
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  title="Edit Profile"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, id: member.id, name: member.name })}
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:text-rose-600"
                  title="Remove from Directory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. RBAC Permissions Matrix Table */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 p-5 shadow-xs">
        <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white mb-1">
          Role-Based Access Control (RBAC) Matrix
        </h3>
        <p className="text-xs text-neutral-500 mb-4">
          Strict authorization hierarchy enforcing newsroom verification before public distribution.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200/80 dark:border-neutral-800/80 font-mono uppercase text-[10px] text-neutral-500">
              <tr>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-3 text-center">Publish Live</th>
                <th className="py-3 px-3 text-center">Approve Review Queue</th>
                <th className="py-3 px-3 text-center">Staff Management</th>
                <th className="py-3 px-3 text-center">Newsroom Settings & Backup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {Object.entries(ROLE_PERMISSIONS).map(([roleName, perms]) => (
                <tr key={roleName} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                  <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${perms.canPublishLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {roleName}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {perms.canPublishLive ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-neutral-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {perms.canApproveReviews ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-neutral-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {perms.canManageStaff ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-neutral-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {perms.canEditSettings ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-neutral-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#121418] rounded-2xl max-w-lg w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                {editingMember ? 'Edit Staff Profile' : 'Add Staff Journalist'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Arun Varma"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Newsroom Email *
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="journalist@newsnow.in"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Editorial Role (RBAC)
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    {Object.keys(ROLE_PERMISSIONS).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Bureau Assignment
                  </label>
                  <input
                    type="text"
                    value={formBureau}
                    onChange={(e) => setFormBureau(e.target.value)}
                    placeholder="Kochi Infopark Bureau"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Author Biography / Dateline Coverage
                </label>
                <textarea
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  rows={2}
                  placeholder="Specializes in deep-tech, semiconductor infrastructure, and public policy..."
                  className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Social Handle (@)
                  </label>
                  <input
                    type="text"
                    value={formHandle}
                    onChange={(e) => setFormHandle(e.target.value)}
                    placeholder="@arun_varma"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    value={formAvatar}
                    onChange={(e) => setFormAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Remove Staff Member?"
        message={`Are you sure you want to remove "${deleteModal.name}" from the newsroom staff directory?`}
        confirmText="Remove Member"
        confirmVariant="danger"
        onConfirm={() => {
          deleteTeamMember(deleteModal.id);
          setDeleteModal({ isOpen: false, id: null, name: '' });
        }}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, name: '' })}
      />
    </div>
  );
};
