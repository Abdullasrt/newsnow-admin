import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  FolderKanban,
  PlusCircle,
  FileText,
  Trash2,
  ExternalLink,
  MapPin,
  Cpu,
  TrendingUp,
  Landmark,
  Palette,
  FlaskConical
} from 'lucide-react';

const DESK_METADATA = {
  Kerala: {
    lead: 'Ananya Nambiar',
    bureau: 'Kochi & Trivandrum',
    desc: 'Local South Indian coverage, sovereign startups, deep-tech hardware, and maritime transit.',
    icon: MapPin,
    color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
  },
  Tech: {
    lead: 'Dr. Madhavan Pillai',
    bureau: 'Infopark Kakkanad',
    desc: 'Artificial intelligence, photonic silicon, fabless semiconductors, and developer ecosystems.',
    icon: Cpu,
    color: 'border-blue-500/30 bg-blue-500/10 text-blue-400'
  },
  Business: {
    lead: 'Rahul Menath',
    bureau: 'National & Global Desk',
    desc: 'Venture capital flows, port logistics, banking cooperatives, and global South Asian trade.',
    icon: TrendingUp,
    color: 'border-amber-500/30 bg-amber-500/10 text-amber-400'
  },
  Politics: {
    lead: 'Sujata Nair',
    bureau: 'Trivandrum Press Club',
    desc: 'Legislative developments, decentralized governance, municipal policy, and electoral analyses.',
    icon: Landmark,
    color: 'border-rose-500/30 bg-rose-500/10 text-rose-400'
  },
  Culture: {
    lead: 'Meera Namboodiri',
    bureau: 'Kozhikode Malabar Desk',
    desc: 'Arts, literature, coastal foodways, cinema, and heritage restoration across the Malabar coast.',
    icon: Palette,
    color: 'border-purple-500/30 bg-purple-500/10 text-purple-400'
  },
  Science: {
    lead: 'Dr. Priya Kurian',
    bureau: 'Arabian Sea Research Lab',
    desc: 'Climate resilience, solar microgrids, green hydrogen aviation, and coastal biotechnology.',
    icon: FlaskConical,
    color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
  }
};

export const AdminCategoriesPage = () => {
  const { categories, addCategory, deleteCategory, articles, showToast } = useNews();
  const [newDeskName, setNewDeskName] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    categoryName: ''
  });

  const handleAddDesk = (e) => {
    e.preventDefault();
    if (!newDeskName.trim()) {
      showToast('Please specify a desk name.', 'error');
      return;
    }
    addCategory(newDeskName.trim());
    setNewDeskName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header with Add Form */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Editorial Desks & Sections
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Organize journalistic beats, assign bureau leads, and monitor coverage depth.
          </p>
        </div>

        {/* Inline Add Desk Form */}
        <form onSubmit={handleAddDesk} className="flex items-center gap-2">
          <input
            type="text"
            value={newDeskName}
            onChange={(e) => setNewDeskName(e.target.value)}
            placeholder="New Desk name (e.g. Climate, Sports)..."
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#111317] border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs shadow-rose-600/20 transition-all flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Desk</span>
          </button>
        </form>
      </div>

      {/* 2. Grid of Desks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.filter(c => c !== 'All').map((cat) => {
          const count = articles.filter(a => a.category.toLowerCase() === cat.toLowerCase()).length;
          const meta = DESK_METADATA[cat] || {
            lead: 'Assigned Staff Editor',
            bureau: 'Central Newsroom',
            desc: `Dedicated journalistic beat covering ${cat} developments across Kerala and South Asia.`,
            icon: FolderKanban,
            color: 'border-neutral-500/30 bg-neutral-500/10 text-neutral-400'
          };
          const IconComp = meta.icon;

          return (
            <div
              key={cat}
              className="bg-white dark:bg-[#111317] rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex flex-col justify-between group hover:border-neutral-400 dark:hover:border-neutral-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${meta.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>

                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {count} Stories
                  </span>
                </div>

                <h3 className="font-serif font-black text-lg text-neutral-900 dark:text-white">
                  {cat} Desk
                </h3>
                <div className="text-[11px] font-mono text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
                  Lead: {meta.lead} • {meta.bureau}
                </div>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {meta.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                <Link
                  to={`/admin/articles`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Dispatches ({count})</span>
                </Link>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/category/${cat.toLowerCase()}`}
                    target="_blank"
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
                    title="View Public Desk Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => setDeleteModal({ isOpen: true, categoryName: cat })}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete Desk"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title={`Delete "${deleteModal.categoryName}" Desk?`}
        message={`Are you sure you want to remove the ${deleteModal.categoryName} category from News Now? Articles currently filed under this desk will remain intact but may need reassignment.`}
        confirmText="Delete Desk"
        confirmVariant="danger"
        onConfirm={() => {
          if (deleteModal.categoryName) {
            deleteCategory(deleteModal.categoryName);
          }
        }}
        onClose={() => setDeleteModal({ isOpen: false, categoryName: '' })}
      />

    </div>
  );
};
