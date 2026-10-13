import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  Inbox,
  Lock,
  Search,
  Send,
  Trash2,
  Paperclip,
  MessageSquare,
  FilePlus
} from 'lucide-react';

export const AdminEnquiriesPage = () => {
  const navigate = useNavigate();
  const { enquiries, updateEnquiryStatus, deleteEnquiry, addArticle, showToast } = useNews();

  // Filters
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Detail Item
  const [activeItem, setActiveItem] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    subject: ''
  });

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(item => {
      if (selectedDept !== 'All' && item.dept !== selectedDept) return false;
      if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchSubj = item.subject?.toLowerCase().includes(q);
        const matchMsg = item.message?.toLowerCase().includes(q);
        const matchSender = item.senderName?.toLowerCase().includes(q);
        const matchId = item.id?.toLowerCase().includes(q);
        return matchSubj || matchMsg || matchSender || matchId;
      }
      return true;
    });
  }, [enquiries, selectedDept, selectedStatus, searchTerm]);

  const handleSelectItem = (item) => {
    setActiveItem(item);
    setNotesDraft(item.editorialNotes || '');
    setShowReplyBox(false);
    setReplyText('');

    // Mark as in_review if it was unread
    if (item.status === 'unread') {
      updateEnquiryStatus(item.id, 'in_review');
    }
  };

  const handleSaveNotes = () => {
    if (activeItem) {
      updateEnquiryStatus(activeItem.id, activeItem.status, notesDraft);
      setActiveItem({ ...activeItem, editorialNotes: notesDraft });
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      showToast('Please type a response.', 'error');
      return;
    }
    if (activeItem) {
      updateEnquiryStatus(activeItem.id, 'replied', notesDraft);
      setActiveItem({ ...activeItem, status: 'replied', editorialNotes: notesDraft });
      setShowReplyBox(false);
      setReplyText('');
      showToast(`Reply dispatched to ${activeItem.senderEmail}`, 'success');
    }
  };

  const handleConvertTipToDraft = (tip) => {
    addArticle({
      title: `Investigation: ${tip.subject}`,
      excerpt: tip.message.substring(0, 160) + '...',
      content: `<p class="lead">Following an encrypted tip submitted to the News Now Whistleblower Desk, reporters initiated verification into the following matters:</p>\n\n<blockquote class="editorial-quote">"${tip.message}"</blockquote>\n\n<p>Investigation ongoing by the regional investigative bureau.</p>`,
      category: tip.dept || 'Tech',
      status: 'draft',
      sourceAttribution: 'Whistleblower Leak'
    });
    navigate('/admin/articles');
    showToast('Tip successfully converted into story draft! 📝', 'success');
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/30 text-[10px] font-mono font-bold uppercase">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">High</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-mono uppercase">Standard</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'unread':
        return <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px] font-mono uppercase">New</span>;
      case 'in_review':
        return <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold uppercase">In Review</span>;
      case 'replied':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">Replied</span>;
      case 'archived':
        return <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-[10px] font-mono uppercase">Archived</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
              Reader Tips & Dispatches
            </span>
          </div>
          <h2 className="mt-1 font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Editorial Inbox
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage incoming reader scoops, errata requests, Op-Ed manuscripts, and commercial inquiries.
          </p>
        </div>

        <div className="text-xs font-mono text-neutral-500 bg-white dark:bg-[#111317] px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs self-start sm:self-auto">
          {enquiries.filter(e => e.status === 'unread').length} Unread Leads • {enquiries.length} Total
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl p-4 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by subject, whistleblower name, reference ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:border-rose-500"
          >
            <option value="All">All Departments</option>
            <option value="scoop">Confidential Scoops (🔒)</option>
            <option value="correction">Editorial Errata</option>
            <option value="letters">Op-Eds & Letters</option>
            <option value="partnerships">Brand Partnerships</option>
            <option value="press">Press Releases</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:border-rose-500"
          >
            <option value="All">All Statuses</option>
            <option value="unread">Unread (New)</option>
            <option value="in_review">In Review</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* 3. Main Split View: Left List, Right Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left: Enquiries List (3 cols on desktop) */}
        <div className="lg:col-span-3 space-y-2.5">
          {filteredEnquiries.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#111317] rounded-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-400">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="font-serif font-bold text-sm">No inquiries match this filter</div>
            </div>
          ) : (
            filteredEnquiries.map((item) => {
              const isSelected = activeItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-500/60 shadow-xs'
                      : 'bg-white dark:bg-[#111317] border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(item.status)}
                      {getUrgencyBadge(item.urgency)}
                      <span className="text-[10px] font-mono text-neutral-400">
                        {item.id}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {item.date}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white line-clamp-1">
                    {item.subject}
                  </h4>

                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                      {item.isAnonymous && <Lock className="w-3 h-3 text-rose-500" />}
                      <span className="truncate">{item.senderName}</span>
                      <span className="text-neutral-400">• {item.deptName}</span>
                    </div>

                    {item.attachmentName && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-neutral-400">
                        <Paperclip className="w-3 h-3" />
                        Attached
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Detail Drawer (2 cols on desktop) */}
        <div className="lg:col-span-2">
          {activeItem ? (
            <div className="bg-white dark:bg-[#111317] rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-6 sticky top-20">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-mono text-neutral-400 font-bold">
                      {activeItem.id}
                    </span>
                    {getUrgencyBadge(activeItem.urgency)}
                  </div>
                  <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white leading-snug">
                    {activeItem.subject}
                  </h3>
                </div>

                <button
                  onClick={() =>
                    setDeleteModal({
                      isOpen: true,
                      id: activeItem.id,
                      subject: activeItem.subject
                    })
                  }
                  className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg"
                  title="Delete Lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Sender Details Card */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase">Sender:</span>
                  <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                    {activeItem.isAnonymous && <Lock className="w-3 h-3 text-rose-500" />}
                    {activeItem.senderName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase">Email:</span>
                  <span className="font-mono text-[11px] text-rose-600 dark:text-rose-400">
                    {activeItem.senderEmail}
                  </span>
                </div>

                {activeItem.senderPhone && (
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-neutral-400 uppercase">Phone:</span>
                    <span className="font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
                      {activeItem.senderPhone}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase">Bureau Desk:</span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300 capitalize">
                    {activeItem.desk || 'Kochi HQ'}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                  Message Content:
                </div>
                <div className="p-4 rounded-xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/60 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-serif whitespace-pre-wrap">
                  {activeItem.message}
                </div>
              </div>

              {/* Attachment if present */}
              {activeItem.attachmentName && (
                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 truncate">
                    <Paperclip className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{activeItem.attachmentName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold shrink-0">Encrypted</span>
                </div>
              )}

              {/* Status Update Dropdown */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-neutral-400">Workflow Status:</span>
                <select
                  value={activeItem.status}
                  onChange={(e) => {
                    const nextSt = e.target.value;
                    updateEnquiryStatus(activeItem.id, nextSt, notesDraft);
                    setActiveItem({ ...activeItem, status: nextSt });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-hidden"
                >
                  <option value="unread">Unread / New</option>
                  <option value="in_review">Under Investigation</option>
                  <option value="replied">Replied & Logged</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Convert Tip to Story Draft CTA */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={() => handleConvertTipToDraft(activeItem)}
                  className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs shadow-rose-600/20"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Convert Tip into Story Draft</span>
                </button>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                    Internal Newsroom Notes:
                  </label>
                  <button
                    onClick={handleSaveNotes}
                    className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold hover:underline"
                  >
                    Save Notes
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Internal editorial notes, corroboration leads, or verification status..."
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
                />
              </div>

              {/* Quick Reply Trigger */}
              <div className="pt-2">
                {!showReplyBox ? (
                  <button
                    type="button"
                    onClick={() => setShowReplyBox(true)}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Compose Editorial Response</span>
                  </button>
                ) : (
                  <form onSubmit={handleSendReply} className="space-y-3 animate-in fade-in">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Draft formal newsroom response to ${activeItem.senderEmail}...`}
                      className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowReplyBox(false)}
                        className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                      >
                        Send & Mark Replied
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#111317] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <div className="font-serif font-bold text-sm">Select an inquiry from the list</div>
              <p className="text-xs text-neutral-500 mt-1">
                View message details, whistleblower attachments, and reply directly.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* 4. Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Inquiry?"
        message={`Are you sure you want to permanently delete inquiry "${deleteModal.subject}"?`}
        confirmText="Delete Inquiry"
        confirmVariant="danger"
        onConfirm={() => {
          if (deleteModal.id) {
            deleteEnquiry(deleteModal.id);
            if (activeItem?.id === deleteModal.id) {
              setActiveItem(null);
            }
          }
        }}
        onClose={() => setDeleteModal({ isOpen: false, id: null, subject: '' })}
      />

    </div>
  );
};
