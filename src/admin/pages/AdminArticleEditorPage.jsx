import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Edit3,
  Image as ImageIcon,
  User,
  Star,
  Zap,
  CheckCircle2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link2,
  Layers,
  UploadCloud,
  Lock,
  Unlock,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Clock,
  X,
  Code,
  FileCode,
  SlidersHorizontal,
  Share2,
  Search,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Hash,
  History,
  MapPin,
  ShieldCheck,
  FileCheck2,
  Code2
} from 'lucide-react';

const PRESET_AUTHORS = [
  {
    name: 'Ananya Nambiar',
    role: 'Chief Technology Editor',
    bureau: 'Kochi Infopark HQ',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'
  },
  {
    name: 'Arun Varma',
    role: 'Editor-in-Chief',
    bureau: 'Executive Newsroom',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
  },
  {
    name: 'Rahul Menath',
    role: 'Senior Bureau Chief',
    bureau: 'Thiruvananthapuram & Technopark',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
  },
  {
    name: 'Dr. Priya Kurian',
    role: 'Science & Clean Transition Fellow',
    bureau: 'Arabian Sea Research Lab',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80'
  }
];

const PRESET_IMAGES = [
  {
    label: 'Kochi Photonic Cleanroom',
    url: '/cover-story.jpg',
    caption: 'Advanced photonics and sovereign semiconductor testing cleanroom overlooking the Kochi backwaters at Maker Village / Infopark.',
    credit: 'Maker Village Media Pool'
  },
  {
    label: 'Kochi Water Metro Transit',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    caption: 'Electric catamaran transit vessel docking at an island terminal in the Vembanad backwaters network.',
    credit: 'Kochi Metro Rail Limited (KMRL)'
  },
  {
    label: 'Silicon Wafer Microarchitecture',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sub-nanometer silicon wafer microarchitecture inspected under laser interferometry.',
    credit: 'MeitY Semiconductor Directorate'
  },
  {
    label: 'CIAL Solar & Green Hydrogen Field',
    url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Cochin International Airport 100% solar microgrid powering regional green hydrogen generation.',
    credit: 'CIAL Renewable Energy Division'
  }
];

const SUGGESTED_TAGS = [
  'Kerala Tech',
  'Semiconductors',
  'Clean Energy',
  'Artificial Intelligence',
  'Kochi Infopark',
  'Technopark',
  'Maritime Transit',
  'Public Policy'
];

const CORE_EDITORIAL_DESKS = [
  'Tech',
  'Kerala / Regional',
  'Business',
  'Politics',
  'Science',
  'Culture'
];

export const AdminArticleEditorPage = () => {
  const { id } = useParams();
  return <ArticleEditorForm key={id || 'new'} id={id} />;
};

const ArticleEditorForm = ({ id }) => {
  const navigate = useNavigate();
  const {
    articles,
    categories,
    addArticle,
    updateArticle,
    articleRevisions,
    restoreArticleRevision,
    currentRole,
    rolePermissions,
    showToast
  } = useNews();

  const isEditing = Boolean(id);
  const existingArticle = useMemo(() => {
    return isEditing ? articles.find(a => String(a.id) === String(id)) : null;
  }, [isEditing, id, articles]);

  const currentRevisions = useMemo(() => {
    return (id && articleRevisions?.[id]) ? articleRevisions[id] : [];
  }, [id, articleRevisions]);

  // Extended Editorial Metadata States
  const [dateline, setDateline] = useState(() => existingArticle?.dateline || 'Kochi, Kerala');
  const [sourceAttribution, setSourceAttribution] = useState(() => existingArticle?.sourceAttribution || 'Staff Investigation');
  const [license, setLicense] = useState(() => existingArticle?.license || 'Staff Wire Photography');
  const [scheduledDate, setScheduledDate] = useState(() => existingArticle?.scheduledDate || '');
  const [articleStatus, setArticleStatus] = useState(() => existingArticle?.status || 'draft');
  const [isRevisionsOpen, setIsRevisionsOpen] = useState(false);
  const [schemaType, setSchemaType] = useState('NewsArticle');
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Combined Desks list ensuring required options exist
  const combinedDesks = useMemo(() => {
    const list = [...CORE_EDITORIAL_DESKS];
    categories.forEach(c => {
      if (c !== 'All' && !list.includes(c) && !list.some(d => d.toLowerCase() === c.toLowerCase())) {
        list.push(c);
      }
    });
    return list;
  }, [categories]);

  // Form Field States
  const [title, setTitle] = useState(() => existingArticle?.title || '');
  const [slug, setSlug] = useState(() => existingArticle?.slug || '');
  const [isSlugLocked, setIsSlugLocked] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState(false);

  const [category, setCategory] = useState(() => existingArticle?.category || 'Tech');
  const [tags, setTags] = useState(() => existingArticle?.tags || ['Kerala Tech', 'Clean Energy']);
  const [tagInput, setTagInput] = useState('');

  const [excerpt, setExcerpt] = useState(() => existingArticle?.excerpt || '');

  // Cover Media
  const [imageUrl, setImageUrl] = useState(() => existingArticle?.imageUrl || '/cover-story.jpg');
  const [imageCaption, setImageCaption] = useState(() => existingArticle?.imageCaption || '');
  const [imageCredit, setImageCredit] = useState(() => existingArticle?.imageCredit || 'News Now Bureau');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Author Info
  const [selectedAuthorIndex, setSelectedAuthorIndex] = useState(() => {
    if (existingArticle?.author?.name) {
      const idx = PRESET_AUTHORS.findIndex(
        a => a.name.toLowerCase() === existingArticle.author.name.toLowerCase()
      );
      return idx !== -1 ? idx : -1;
    }
    return 0;
  });

  const [authorName, setAuthorName] = useState(() => existingArticle?.author?.name || PRESET_AUTHORS[0].name);
  const [authorRole, setAuthorRole] = useState(() => existingArticle?.author?.role || PRESET_AUTHORS[0].role);
  const [authorBureau, setAuthorBureau] = useState(() => existingArticle?.author?.bureau || PRESET_AUTHORS[0].bureau);
  const [authorAvatar, setAuthorAvatar] = useState(() => existingArticle?.author?.avatar || PRESET_AUTHORS[0].avatar);

  // Editorial Flags
  const [isBreaking, setIsBreaking] = useState(() => Boolean(existingArticle?.isBreaking));
  const [featured, setFeatured] = useState(() => Boolean(existingArticle?.featured));
  const [isCustomReadTime, setIsCustomReadTime] = useState(() => Boolean(existingArticle?.readTime));
  const [customReadTime, setCustomReadTime] = useState(() => existingArticle?.readTime || '');

  // Rich Content
  const [content, setContent] = useState(() => {
    if (existingArticle?.content) return existingArticle.content;
    if (isEditing) return '';
    return `<p class="lead">In an unprecedented development across the coastal economic corridor, key technological milestones were achieved today, marking a major turning point for regional infrastructure and sovereign research.</p>

<p>Engineering teams and government liaisons convened this morning to inaugurate the newly completed cluster facilities. The initiative is projected to reduce reliance on external imports while fostering localized research and high-density employment opportunities.</p>

<h2>Strategic Milestones and Technical Architecture</h2>
<p>Specialists in attendance emphasized the necessity of sustainable, fault-tolerant architectures designed specifically to withstand harsh regional monsoons and high thermal loads.</p>

<blockquote class="editorial-quote">
  "This marks the dawn of a self-sustaining technical ecosystem rooted in our own institutions, driven by domestic research and clean microgrid power."
</blockquote>

<p>As venture capital syndicates and international partners monitor these deployments, the regional administration confirmed ongoing expansion plans across adjacent districts over the coming fiscal quarter.</p>`;
  });

  // UI View Tab: 'editor' | 'preview'
  const [activeTab, setActiveTab] = useState('editor');
  // Preview Device Mode: 'desktop' | 'tablet' | 'mobile'
  const [previewDevice, setPreviewDevice] = useState('desktop');

  // Inspector Drawer State
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [activeInspectorTab, setActiveInspectorTab] = useState('metadata'); // 'metadata' | 'media' | 'byline' | 'seo'

  // Validation feedback state
  const [errors, setErrors] = useState({});

  // Discard Confirmation Modal
  const [discardModalOpen, setDiscardModalOpen] = useState(false);

  const contentTextareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Text metrics calculation
  const metrics = useMemo(() => {
    const plainText = content.replace(/<[^>]*>/g, ' ');
    const words = plainText.trim().split(/\s+/).filter(Boolean).length;
    const characters = plainText.length;
    const paragraphs = content.split(/<\/(?:p|h2|h3|blockquote)>/i).filter(p => p.trim()).length || 1;
    const calculatedMinutes = Math.max(1, Math.ceil(words / 200));
    const autoReadTime = `${calculatedMinutes} min read`;

    return {
      words,
      characters,
      paragraphs,
      autoReadTime,
      effectiveReadTime: isCustomReadTime && customReadTime.trim() ? customReadTime.trim() : autoReadTime
    };
  }, [content, isCustomReadTime, customReadTime]);

  const [todayDateline] = useState(() => {
    return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  });

  // SEO Headline Analysis
  const seoHeadlineAnalysis = useMemo(() => {
    const len = title.trim().length;
    if (len === 0) {
      return { status: 'empty', label: 'Headline required', color: 'text-neutral-400' };
    }
    if (len < 40) {
      return { status: 'short', label: 'Brief (50–65 chars recommended for search engines)', color: 'text-amber-500' };
    }
    if (len <= 65) {
      return { status: 'optimal', label: 'Optimal length for Google News & social cards (✓)', color: 'text-emerald-500 font-semibold' };
    }
    return { status: 'long', label: 'Long (>65 chars may truncate in search snippets)', color: 'text-amber-500' };
  }, [title]);

  // Lead Excerpt Analysis
  const excerptAnalysis = useMemo(() => {
    const len = excerpt.trim().length;
    if (len === 0) {
      return { status: 'empty', label: 'Teaser excerpt required', color: 'text-neutral-400' };
    }
    if (len < 100) {
      return { status: 'short', label: 'Brief (120–240 chars recommended for mobile cards)', color: 'text-amber-500' };
    }
    if (len <= 240) {
      return { status: 'optimal', label: 'Ideal card & feed teaser length (✓)', color: 'text-emerald-500 font-semibold' };
    }
    return { status: 'long', label: 'Long (>240 chars, may truncate on compact cards)', color: 'text-neutral-400' };
  }, [excerpt]);

  // Handle title change & auto slug
  const handleTitleChange = (val) => {
    setTitle(val);
    if (errors.title) setErrors(prev => ({ ...prev, title: null }));

    if (isSlugLocked) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const handleCopySlug = () => {
    const fullUrl = `https://newsnow.in/article/${slug || 'story'}`;
    navigator.clipboard?.writeText(fullUrl);
    setCopiedSlug(true);
    showToast('Canonical link copied to clipboard!', 'info');
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  // Tag helpers
  const handleAddTag = (rawTag) => {
    const clean = rawTag.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Preset Author Selection
  const handleSelectPresetAuthor = (idx) => {
    setSelectedAuthorIndex(idx);
    if (idx >= 0) {
      const p = PRESET_AUTHORS[idx];
      setAuthorName(p.name);
      setAuthorRole(p.role);
      setAuthorBureau(p.bureau);
      setAuthorAvatar(p.avatar);
    }
  };

  // Local Image Upload & Drag-and-Drop
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processLocalImage(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processLocalImage(file);
  };

  const processLocalImage = (file) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (JPG, PNG, WebP).', 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('Image size exceeds 8MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result);
        if (!imageCaption) {
          setImageCaption(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
        }
        showToast('Cover photo attached successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Toolbar formatting commands
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;
    const selected = current.substring(start, end) || 'text';

    const replacement = `${prefix}${selected}${suffix}`;
    const nextVal = current.substring(0, start) + replacement + current.substring(end);
    setContent(nextVal);

    if (errors.content) setErrors(prev => ({ ...prev, content: null }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  const handleInsertLink = () => {
    const url = window.prompt('Enter link URL (e.g. https://...):', 'https://');
    if (url) {
      insertFormatting(`<a href="${url}" class="text-rose-600 underline hover:text-rose-700" target="_blank" rel="noopener noreferrer">`, '</a>');
    }
  };

  const handleInsertCallout = () => {
    insertFormatting('<div class="callout-box">\n  <strong>Editorial Note:</strong> ', '\n</div>');
  };

  const handleInsertCode = () => {
    insertFormatting('<code>', '</code>');
  };

  const handleInsertFigure = () => {
    const url = window.prompt('Enter image URL for content figure:', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80');
    if (url) {
      const cap = window.prompt('Enter figure caption:', 'Technical cleanroom inspection');
      insertFormatting(`\n<figure class="my-6">\n  <img src="${url}" alt="${cap || ''}" class="rounded-xl w-full" />\n  <figcaption class="text-xs text-center text-neutral-500 mt-2">${cap || ''}</figcaption>\n</figure>\n`);
    }
  };

  // Validation
  const validatePublishForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Headline is required to publish.';
    if (!category.trim()) newErrors.category = 'Please select an editorial desk.';
    if (!excerpt.trim()) newErrors.excerpt = 'Lead summary teaser is required for cards.';
    if (!content.trim() || content.trim().length < 30) {
      newErrors.content = 'Story body must contain at least 30 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRestoreRevision = (revId) => {
    const targetRev = restoreArticleRevision(id, revId);
    if (targetRev) {
      if (targetRev.title) setTitle(targetRev.title);
      if (targetRev.excerpt) setExcerpt(targetRev.excerpt);
      if (targetRev.content) setContent(targetRev.content);
      setIsRevisionsOpen(false);
    }
  };

  const jsonLdSchemaString = useMemo(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "headline": title || "News Dispatch Headline",
      "description": excerpt || "Summary teaser text",
      "image": [imageUrl || "https://newsnow.in/cover-story.jpg"],
      "datePublished": existingArticle?.publishedAt || scheduledDate || "2026-10-12T14:30:00Z",
      "author": {
        "@type": "Person",
        "name": authorName || "Reporter",
        "jobTitle": authorRole
      },
      "publisher": {
        "@type": "NewsMediaOrganization",
        "name": "News Now / The Kochi Chronicle",
        "url": "https://newsnow.in"
      },
      "dateline": dateline,
      "license": license
    };
    return JSON.stringify(schema, null, 2);
  }, [schemaType, title, excerpt, imageUrl, existingArticle, scheduledDate, authorName, authorRole, dateline, license]);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(`<script type="application/ld+json">\n${jsonLdSchemaString}\n</script>`);
    setCopiedSchema(true);
    showToast('Schema.org JSON-LD tag copied to clipboard! 📜', 'success');
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  // Save / Publish
  const handleSaveArticle = (publishStatus = 'published') => {
    let finalStatus = publishStatus;

    if (publishStatus === 'published') {
      if (!rolePermissions.canPublishLive) {
        showToast(`Role "${currentRole}" cannot publish live directly. Submitting for Desk Editor review instead.`, 'info');
        finalStatus = 'in_review';
      }
      const isValid = validatePublishForm();
      if (!isValid) {
        showToast('Please complete all required editorial fields.', 'error');
        setActiveTab('editor');
        return;
      }
    } else if (publishStatus === 'in_review') {
      const isValid = validatePublishForm();
      if (!isValid) {
        showToast('Please complete required fields before submitting for review.', 'error');
        setActiveTab('editor');
        return;
      }
      finalStatus = 'in_review';
    } else {
      // Draft mode: Require at least headline
      if (!title.trim()) {
        setErrors({ title: 'Please provide at least a story headline to save a draft.' });
        showToast('Headline is required to save a draft.', 'error');
        setActiveTab('editor');
        return;
      }
      finalStatus = 'draft';
    }

    setErrors({});

    const authorPayload = {
      name: authorName.trim() || 'Staff Correspondent',
      role: authorRole.trim() || 'Desk Reporter',
      bureau: authorBureau.trim() || 'Central Newsroom',
      avatar: authorAvatar.trim() || PRESET_AUTHORS[0].avatar
    };

    const payload = {
      title: title.trim(),
      slug: slug.trim() || 'dispatch-' + Date.now(),
      excerpt: excerpt.trim(),
      category,
      tags,
      content,
      readTime: metrics.effectiveReadTime,
      author: authorPayload,
      imageUrl: imageUrl.trim() || '/cover-story.jpg',
      imageCaption: imageCaption.trim(),
      imageCredit: imageCredit.trim(),
      featured,
      isBreaking,
      status: finalStatus,
      dateline: dateline.trim(),
      sourceAttribution: sourceAttribution.trim(),
      license,
      scheduledDate
    };

    if (isEditing) {
      updateArticle(id, payload);
    } else {
      addArticle(payload);
    }

    navigate('/admin/articles');
  };

  // Discard / Reset
  const handleResetForm = () => {
    setTitle('');
    setSlug('');
    setCategory('Tech');
    setExcerpt('');
    setContent('');
    setImageUrl('/cover-story.jpg');
    setImageCaption('');
    setImageCredit('News Now Bureau');
    setTags(['Kerala Tech']);
    setFeatured(false);
    setIsBreaking(false);
    setIsCustomReadTime(false);
    setCustomReadTime('');
    setErrors({});
    setDiscardModalOpen(false);
    showToast('Editorial form reset.', 'info');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">

      {/* 1. Sleek Newsroom Header Ribbon */}
      <div className="sticky top-16 z-20 -mx-4 -mt-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-white/90 dark:bg-[#0c0e12]/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        
        {/* Left: Breadcrumb & Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/articles"
            className="p-1.5 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Return to Articles Manager"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {isEditing ? 'Editing Story' : 'New Dispatch'}
              </span>
              <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
                {metrics.words} words • {metrics.effectiveReadTime}
              </span>
            </div>
            <h2 className="font-serif font-black text-lg sm:text-xl text-neutral-900 dark:text-white line-clamp-1">
              {title || (isEditing ? 'Edit Dispatch' : 'Untitled Story Dispatch')}
            </h2>
          </div>
        </div>

        {/* Center: Write vs Live Preview Tab & Device Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-[#16181f] border border-neutral-200 dark:border-neutral-800 text-xs shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'editor'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-rose-500" />
              <span>Live Preview</span>
            </button>
          </div>

          {/* Device Viewport Selector (Active when in Preview mode) */}
          {activeTab === 'preview' && (
            <div className="hidden md:flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-[#16181f] border border-neutral-200 dark:border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-colors ${previewDevice === 'desktop' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
                title="Desktop Broadsheet View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-lg transition-colors ${previewDevice === 'tablet' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
                title="Tablet Gazette View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-colors ${previewDevice === 'mobile' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'}`}
                title="Mobile Smartphone Reader View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Inspector Toggle & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Revisions History Button */}
          <button
            type="button"
            onClick={() => setIsRevisionsOpen(true)}
            className="px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-300 transition-colors flex items-center gap-1.5"
            title="Browse revision snapshots"
          >
            <History className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Revisions ({currentRevisions.length})</span>
          </button>

          {activeTab === 'editor' && (
            <button
              type="button"
              onClick={() => setIsInspectorOpen(!isInspectorOpen)}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isInspectorOpen
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                  : 'bg-white dark:bg-[#121418] border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
              title="Toggle Editorial Settings Inspector"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Settings Drawer</span>
            </button>
          )}

          {/* Discard Form Action */}
          <button
            type="button"
            onClick={() => setDiscardModalOpen(true)}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Discard or Reset Form"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={() => handleSaveArticle('draft')}
            className="px-3.5 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors flex items-center gap-1.5"
            title="Save changes as unpublished draft"
          >
            <Save className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          {/* Submit Review Button */}
          <button
            type="button"
            onClick={() => handleSaveArticle('in_review')}
            className="hidden sm:flex px-3.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-colors items-center gap-1.5"
            title="Submit dispatch to Desk Editor review queue"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Submit Review</span>
          </button>

          {/* Publish Live / Update Button */}
          <button
            type="button"
            onClick={() => handleSaveArticle('published')}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-md shadow-rose-900/30 transition-all flex items-center gap-1.5 hover:scale-102"
            title={isEditing ? 'Update published dispatch' : (rolePermissions.canPublishLive ? 'Publish dispatch live' : 'Submit for review')}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Update Dispatch' : (rolePermissions.canPublishLive ? 'Publish Live' : 'Submit Review')}</span>
          </button>
        </div>
      </div>

      {/* 2. Validation Missing Fields Alert */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <div className="flex-1">
            <span className="font-bold">Missing Required Fields: </span>
            <span>{Object.values(errors).join(' ')}</span>
          </div>
        </div>
      )}

      {/* 3. Main Workspace Canvas & Inspector Layout */}
      {activeTab === 'editor' ? (
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          
          {/* Main Editorial Canvas Sheet */}
          <div className="flex-1 w-full space-y-6">
            
            <div className="bg-white dark:bg-[#111317] rounded-3xl p-6 sm:p-10 border border-neutral-200/80 dark:border-neutral-800/80 shadow-md shadow-neutral-900/5 dark:shadow-none space-y-6">
              
              {/* Category Desk Pill & Dateline Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800/80 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20">
                    {category} Desk
                  </span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-500 dark:text-neutral-400">{todayDateline}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>{metrics.effectiveReadTime}</span>
                </div>
              </div>

              {/* Headline / Story Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                    Headline Title <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className={seoHeadlineAnalysis.color}>{seoHeadlineAnalysis.label}</span>
                    <span className="text-neutral-400">({title.length} chars)</span>
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter headline... (e.g. Sovereign Silicon: Inside Kochi’s New Photonic Chip Fab)"
                  className="w-full font-serif font-black text-2xl sm:text-4xl text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 bg-transparent border-0 focus:outline-hidden leading-tight resize-none"
                />

                {errors.title && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1.5 pt-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.title}</span>
                  </p>
                )}

                {/* Canonical Slug Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 text-xs">
                  <span className="font-mono text-[11px] text-neutral-400 shrink-0">Permalink:</span>
                  <div className="flex-1 flex items-center gap-1.5 font-mono text-[11px] bg-neutral-50 dark:bg-neutral-900/90 px-3 py-1.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                    <span className="text-neutral-400 select-none">newsnow.in/article/</span>
                    <input
                      type="text"
                      value={slug}
                      readOnly={isSlugLocked}
                      onChange={(e) => setSlug(e.target.value)}
                      className="bg-transparent border-0 focus:outline-hidden flex-1 font-mono text-[11px] text-neutral-800 dark:text-neutral-200"
                    />

                    <button
                      type="button"
                      onClick={() => setIsSlugLocked(!isSlugLocked)}
                      className="p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-colors"
                      title={isSlugLocked ? 'Click to manually override slug' : 'Locked to auto title'}
                    >
                      {isSlugLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 text-rose-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleCopySlug}
                      className="p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-colors"
                      title="Copy Canonical URL"
                    >
                      {copiedSlug ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Standfirst / Lead Summary */}
              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                    Standfirst / Lead Summary <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className={excerptAnalysis.color}>{excerptAnalysis.label}</span>
                    <span className="text-neutral-400">({excerpt.length} chars)</span>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    if (errors.excerpt) setErrors(prev => ({ ...prev, excerpt: null }));
                  }}
                  placeholder="2-3 sentence teaser text shown on cards, broadsheet grids, and social search previews..."
                  className="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-serif italic text-sm sm:text-base text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-hidden focus:border-rose-500 leading-relaxed transition-colors resize-y border-l-4 border-l-rose-500"
                />

                {errors.excerpt && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1.5 pt-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.excerpt}</span>
                  </p>
                )}
              </div>

              {/* Cover Media Section */}
              <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                    <span>Cover Photography</span>
                  </label>
                  <span className="text-[10px] font-mono text-neutral-400">Drag file or provide web URL</span>
                </div>

                {imageUrl ? (
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-2xl overflow-hidden ring-1 ring-neutral-200 dark:ring-neutral-800 bg-neutral-100 dark:bg-neutral-900 group">
                      <img
                        src={imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/70 text-white hover:bg-rose-600 transition-colors shadow-lg"
                        title="Remove cover photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <input
                          type="text"
                          value={imageCaption}
                          onChange={(e) => setImageCaption(e.target.value)}
                          placeholder="Photo Scene Caption..."
                          className="w-full px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={imageCredit}
                          onChange={(e) => setImageCredit(e.target.value)}
                          placeholder="Photo Credit / Source (e.g. Maker Village Media Pool)..."
                          className="w-full px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(true);
                    }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDraggingOver
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 scale-102'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/40'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <UploadCloud className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Drag and drop cover image, or <span className="text-rose-600 dark:text-rose-400 underline">browse file</span>
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400 mt-1">
                      Supports JPG, PNG, WebP up to 8MB
                    </div>
                  </div>
                )}
              </div>

              {/* Story Content Editor Box with Toolbar */}
              <div className={`rounded-2xl border shadow-xs overflow-hidden transition-colors ${
                errors.content ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-neutral-200/80 dark:border-neutral-800/80'
              }`}>
                {/* Floating Rich Formatting Toolbar */}
                <div className="p-2.5 bg-neutral-50 dark:bg-neutral-900/90 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center gap-1 flex-wrap text-neutral-600 dark:text-neutral-300 text-xs">
                  <button
                    type="button"
                    onClick={() => insertFormatting('<h2>', '</h2>')}
                    className="px-2 py-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1 font-serif font-bold"
                    title="Section Heading (H2)"
                  >
                    <Heading2 className="w-4 h-4" />
                    <span>H2</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => insertFormatting('<h3>', '</h3>')}
                    className="px-2 py-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1 font-serif font-bold"
                    title="Subsection (H3)"
                  >
                    <Heading3 className="w-4 h-4" />
                    <span>H3</span>
                  </button>

                  <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />

                  <button
                    type="button"
                    onClick={() => insertFormatting('<strong>', '</strong>')}
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors font-bold"
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => insertFormatting('<em>', '</em>')}
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors italic"
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => insertFormatting('<u>', '</u>')}
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors underline"
                    title="Underline"
                  >
                    <Underline className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => insertFormatting('<s>', '</s>')}
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors line-through"
                    title="Strikethrough"
                  >
                    <Strikethrough className="w-4 h-4" />
                  </button>

                  <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />

                  <button
                    type="button"
                    onClick={() => insertFormatting('<blockquote class="editorial-quote">\n  "', '"\n</blockquote>')}
                    className="px-2 py-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1"
                    title="Editorial Pull-Quote"
                  >
                    <Quote className="w-4 h-4" />
                    <span className="hidden sm:inline">Quote</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInsertCallout}
                    className="px-2 py-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold"
                    title="Editorial Callout Box"
                  >
                    <FileCode className="w-4 h-4" />
                    <span className="hidden sm:inline">Callout</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInsertCode}
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors font-mono"
                    title="Inline Code"
                  >
                    <Code className="w-4 h-4" />
                  </button>

                  <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />

                  <button
                    type="button"
                    onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => insertFormatting('<ol>\n  <li>', '</li>\n</ol>')}
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => insertFormatting('<p class="lead">', '</p>')}
                    className="px-2 py-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors font-mono font-bold text-rose-500"
                    title="Drop Cap Lead Paragraph"
                  >
                    Lead
                  </button>

                  <button
                    type="button"
                    onClick={handleInsertFigure}
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                    title="Embed Photo Figure with Caption"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleInsertLink}
                    className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                    title="Embed Hyperlink"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Textarea */}
                <div className="p-4 sm:p-6 bg-white dark:bg-[#111317]">
                  <textarea
                    ref={contentTextareaRef}
                    rows={18}
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      if (errors.content) setErrors(prev => ({ ...prev, content: null }));
                    }}
                    placeholder="Draft the article body in HTML or multi-paragraph broadsheet copy..."
                    className="w-full font-serif text-base sm:text-lg leading-relaxed text-neutral-900 dark:text-neutral-100 bg-transparent border-0 focus:outline-hidden resize-y min-h-[380px]"
                  />
                </div>

                {errors.content && (
                  <div className="px-6 pb-3">
                    <p className="text-xs text-rose-500 font-medium flex items-center gap-1.5 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.content}</span>
                    </p>
                  </div>
                )}

                {/* Text Stats Footer Bar */}
                <div className="px-5 py-2.5 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-4">
                    <span>{metrics.words} words</span>
                    <span>{metrics.characters} chars</span>
                    <span>{metrics.paragraphs} paragraphs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{metrics.effectiveReadTime}</span>
                  </div>
                </div>

                {/* Editorial Canvas Action Footer */}
                <div className="p-4 sm:p-5 bg-neutral-50/80 dark:bg-[#14161d] border-t border-neutral-200/80 dark:border-neutral-800 rounded-b-3xl flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setDiscardModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-500 hover:text-rose-600 dark:text-neutral-400 dark:hover:text-rose-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-xl transition-colors flex items-center gap-1.5"
                    title="Reset all form inputs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Discard Draft</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveArticle('draft')}
                      className="px-3.5 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Save Draft</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveArticle('in_review')}
                      className="px-3.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                      title="Submit dispatch to Desk Editor review queue"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Submit Review</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveArticle('published')}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-md shadow-rose-900/30 transition-all flex items-center gap-1.5 hover:scale-102"
                      title={isEditing ? 'Update published dispatch' : (rolePermissions.canPublishLive ? 'Publish dispatch live' : 'Submit for review')}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isEditing ? 'Update Dispatch' : (rolePermissions.canPublishLive ? 'Publish Live' : 'Submit Review')}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Inspector Side Drawer (Collapsible) */}
          {isInspectorOpen && (
            <aside className="w-full xl:w-88 space-y-4 shrink-0 animate-in fade-in slide-in-from-right-4 duration-200">
              
              {/* Tab Navigation in Inspector */}
              <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-[#111317] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('metadata')}
                  className={`flex-1 py-1.5 text-center rounded-xl transition-all ${
                    activeInspectorTab === 'metadata'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Meta
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('byline')}
                  className={`flex-1 py-1.5 text-center rounded-xl transition-all ${
                    activeInspectorTab === 'byline'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Byline
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('seo')}
                  className={`flex-1 py-1.5 text-center rounded-xl transition-all ${
                    activeInspectorTab === 'seo'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  SEO Preview
                </button>
              </div>

              {/* Inspector Content Panes */}
              {activeInspectorTab === 'metadata' && (
                <div className="bg-white dark:bg-[#111317] rounded-3xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-5">
                  
                  {/* Editorial Desk */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-rose-500" />
                      <span>Editorial Desk Beat</span>
                    </label>

                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        if (errors.category) setErrors(prev => ({ ...prev, category: null }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                    >
                      {combinedDesks.map(c => (
                        <option key={c} value={c}>{c} Desk</option>
                      ))}
                    </select>

                    {errors.category && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1.5 pt-1 animate-in fade-in">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.category}</span>
                      </p>
                    )}
                  </div>

                  {/* Topic Tags */}
                  <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-rose-500" />
                      <span>Topic Tags</span>
                    </label>

                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Add tag and press Enter..."
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                    />

                    <div className="flex flex-wrap gap-1.5">
                      {tags.map(t => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[10px] font-medium"
                        >
                          #{t}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="hover:text-rose-500 text-neutral-400 ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                      <span className="text-[10px] font-mono text-neutral-400 block mb-1">Suggestions:</span>
                      <div className="flex flex-wrap gap-1">
                        {SUGGESTED_TAGS.filter(st => !tags.includes(st)).slice(0, 6).map(st => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleAddTag(st)}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800"
                          >
                            +{st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dateline & Geographic Location */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>Dateline Location</span>
                    </label>
                    <input
                      type="text"
                      value={dateline}
                      onChange={(e) => setDateline(e.target.value)}
                      placeholder="e.g. Kochi, Kerala or New Delhi"
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                    />
                  </div>

                  {/* Source Attribution */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                      <span>Source Attribution</span>
                    </label>
                    <select
                      value={sourceAttribution}
                      onChange={(e) => setSourceAttribution(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                    >
                      <option value="Staff Investigation">Staff Investigation (Exclusive)</option>
                      <option value="Reuters / AP Wire">Reuters / Associated Press Wire</option>
                      <option value="Whistleblower Leak">Verified Whistleblower Leak</option>
                      <option value="Government Press Release">Government Gazette / Press Release</option>
                      <option value="Bureau Special Report">Bureau Special Correspondent</option>
                    </select>
                  </div>

                  {/* Publication Lifecycle Status & Scheduled Release */}
                  <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Workflow Status & Scheduling</span>
                    </label>
                    <select
                      value={articleStatus}
                      onChange={(e) => setArticleStatus(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                    >
                      <option value="draft">Draft (In-progress memo)</option>
                      <option value="in_review">In Editorial Review (Awaiting Desk Editor)</option>
                      <option value="published">Published (Live to global readership)</option>
                      <option value="archived">Archived (Delisted from active index)</option>
                    </select>

                    <div className="pt-1">
                      <label className="text-[10px] font-mono text-neutral-400 block mb-1">
                        Scheduled Release (Optional Timed Release):
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Media Licensing Disclosure */}
                  <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                      <span>Cover Licensing Disclosure</span>
                    </label>
                    <select
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                    >
                      <option value="Staff Wire Photography">Staff Wire Photography</option>
                      <option value="Licensed / Associated Press">Licensed / Associated Press</option>
                      <option value="Creative Commons BY-SA">Creative Commons BY-SA 4.0</option>
                      <option value="Exclusive Newsroom Copyright">Exclusive Newsroom Copyright</option>
                      <option value="Editorial Fair Use">Editorial Fair Use</option>
                      <option value="Public Domain / Open Data">Public Domain / Open Data</option>
                    </select>
                  </div>

                  {/* Editorial Flags */}
                  <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                      Editorial Flags & Depth
                    </label>

                    {/* Cover Story Feature Checkbox */}
                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>Cover Hero Feature</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          Pins story to homepage hero banner.
                        </div>
                      </div>
                    </label>

                    {/* Breaking Alert Checkbox */}
                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={isBreaking}
                        onChange={(e) => setIsBreaking(e.target.checked)}
                        className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-rose-500" />
                          <span>Mark as Breaking News</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          Broadcasts to continuous live wire ticker.
                        </div>
                      </div>
                    </label>

                    {/* Estimated Read Time Override */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[11px] font-mono text-neutral-400">Read Time:</span>
                        <button
                          type="button"
                          onClick={() => setIsCustomReadTime(!isCustomReadTime)}
                          className="text-[10px] font-mono text-rose-600 dark:text-rose-400 hover:underline"
                        >
                          {isCustomReadTime ? 'Auto Calc' : 'Manual Override'}
                        </button>
                      </div>

                      {isCustomReadTime ? (
                        <input
                          type="text"
                          value={customReadTime}
                          onChange={(e) => setCustomReadTime(e.target.value)}
                          placeholder="e.g. 5 min read"
                          className="w-full px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white font-mono"
                        />
                      ) : (
                        <div className="px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300">
                          {metrics.autoReadTime} ({metrics.words} words)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photo Presets Gallery Shortcut */}
                  <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                      Newsroom Photo Presets
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PRESET_IMAGES.map((img) => (
                        <button
                          key={img.label}
                          type="button"
                          onClick={() => {
                            setImageUrl(img.url);
                            setImageCaption(img.caption);
                            setImageCredit(img.credit);
                          }}
                          className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            imageUrl === img.url
                              ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30'
                              : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                          }`}
                        >
                          <img
                            src={img.url}
                            alt=""
                            className="w-7 h-7 rounded-lg object-cover shrink-0"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300 truncate">
                            {img.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {activeInspectorTab === 'byline' && (
                <div className="bg-white dark:bg-[#111317] rounded-3xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-rose-500" />
                      <span>Reporter Attribution</span>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    {PRESET_AUTHORS.map((auth, idx) => (
                      <div
                        key={auth.name}
                        onClick={() => handleSelectPresetAuthor(idx)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                          selectedAuthorIndex === idx
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500'
                            : 'border-neutral-200/60 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                        }`}
                      >
                        <img src={auth.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-neutral-300 dark:ring-neutral-700" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                            {auth.name}
                          </div>
                          <div className="text-[10px] text-neutral-400 truncate font-mono">
                            {auth.bureau}
                          </div>
                        </div>
                        {selectedAuthorIndex === idx && <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />}
                      </div>
                    ))}

                    {/* Custom Byline Accordion */}
                    <div
                      onClick={() => setSelectedAuthorIndex(-1)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        selectedAuthorIndex === -1
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500'
                          : 'border-neutral-200/60 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white">
                        <span>Custom Guest Reporter</span>
                        {selectedAuthorIndex === -1 && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
                      </div>

                      {selectedAuthorIndex === -1 && (
                        <div className="mt-2 space-y-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="Reporter Name..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={authorRole}
                            onChange={(e) => setAuthorRole(e.target.value)}
                            placeholder="Role (e.g. Senior Economic Fellow)..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={authorBureau}
                            onChange={(e) => setAuthorBureau(e.target.value)}
                            placeholder="Bureau (e.g. Kochi / Delhi)..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={authorAvatar}
                            onChange={(e) => setAuthorAvatar(e.target.value)}
                            placeholder="Avatar Image URL..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white font-mono text-[10px]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeInspectorTab === 'seo' && (
                <div className="bg-white dark:bg-[#111317] rounded-3xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-rose-500" />
                      <span>Google Search Simulator</span>
                    </label>
                  </div>

                  {/* Google Search Result Card Mockup */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono truncate">
                      <Globe className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span>https://newsnow.in &gt; article &gt; {slug || 'dispatch'}</span>
                    </div>
                    <div className="font-sans font-semibold text-blue-600 dark:text-blue-400 line-clamp-2 hover:underline cursor-pointer">
                      {title || 'Headline title appears in Google results...'}
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {excerpt || 'Lead excerpt summary teaser text appears as the search description snippet for users...'}
                    </p>
                  </div>

                  {/* Social Share / Twitter Card Simulator */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Social Feed Card Mockup</span>
                    </label>

                    <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80">
                      <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                        <img
                          src={imageUrl || '/cover-story.jpg'}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />
                      </div>
                      <div className="p-2.5 space-y-1">
                        <div className="text-[10px] font-mono text-neutral-400 uppercase">
                          newsnow.in • {category} Desk
                        </div>
                        <div className="font-bold text-xs text-neutral-900 dark:text-white line-clamp-1">
                          {title || 'Headline'}
                        </div>
                        <div className="text-[11px] text-neutral-500 line-clamp-2">
                          {excerpt || 'Lead summary'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schema.org JSON-LD Generator */}
                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Schema.org JSON-LD</span>
                      </label>
                      <select
                        value={schemaType}
                        onChange={(e) => setSchemaType(e.target.value)}
                        className="px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono"
                      >
                        <option value="NewsArticle">NewsArticle</option>
                        <option value="LiveBlogPosting">LiveBlogPosting</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <pre className="p-2.5 rounded-xl bg-neutral-900 text-neutral-300 font-mono text-[10px] overflow-x-auto max-h-32 scrollbar-thin">
                        {`<script type="application/ld+json">\n${jsonLdSchemaString}\n</script>`}
                      </pre>
                      <button
                        type="button"
                        onClick={handleCopySchema}
                        className="w-full py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSchema ? 'Copied to Clipboard!' : 'Copy Schema Script Tag'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </aside>
          )}

        </div>
      ) : (
        /* 4. Live Editorial Preview Mode (with Multi-Device Viewports) */
        <div className="space-y-6">
          <div
            className={`mx-auto transition-all duration-300 ${
              previewDevice === 'mobile'
                ? 'max-w-[400px] border-8 border-neutral-800 rounded-[44px] p-4 shadow-2xl bg-white dark:bg-[#0c0e12]'
                : previewDevice === 'tablet'
                ? 'max-w-[768px] border-4 border-neutral-700/60 rounded-3xl p-6 shadow-xl bg-white dark:bg-[#111317]'
                : 'max-w-4xl bg-white dark:bg-[#111317] rounded-3xl p-6 sm:p-14 border border-neutral-200/80 dark:border-neutral-800/80 shadow-md'
            }`}
          >
            {/* Mobile simulated dynamic island / status bar */}
            {previewDevice === 'mobile' && (
              <div className="flex items-center justify-between pb-4 pt-1 px-2 border-b border-neutral-100 dark:border-neutral-800 text-[10px] font-mono text-neutral-400">
                <span>9:41</span>
                <div className="w-16 h-3.5 bg-neutral-900 dark:bg-neutral-700 rounded-full mx-auto" />
                <span>5G 100%</span>
              </div>
            )}

            <article className="space-y-8 animate-in fade-in pt-4">
              
              {/* Dateline & Desk Meta */}
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                    {category} Desk
                  </span>
                  <span>•</span>
                  <span>{todayDateline}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>{metrics.effectiveReadTime}</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="font-serif font-black text-2xl sm:text-4xl md:text-5xl text-neutral-950 dark:text-neutral-50 leading-tight">
                {title || 'Headline will appear here...'}
              </h1>

              {/* Standfirst Excerpt */}
              {excerpt && (
                <p className="font-serif italic text-base sm:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed border-l-4 border-rose-600 pl-4 py-1">
                  {excerpt}
                </p>
              )}

              {/* Author Byline */}
              <div className="flex items-center justify-between py-4 border-y border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <img
                    src={authorAvatar}
                    alt=""
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
                  />
                  <div>
                    <div className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                      By {authorName}
                    </div>
                    <div className="text-xs text-neutral-500 font-mono">
                      {authorRole} • {authorBureau}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-neutral-400 font-mono hidden sm:inline">
                  NEWS NOW Editorial Edition
                </div>
              </div>

              {/* Cover Photo */}
              {imageUrl && (
                <div className="space-y-2">
                  <div className="aspect-video rounded-2xl overflow-hidden ring-1 ring-neutral-200 dark:ring-neutral-800 bg-neutral-100 dark:bg-neutral-900">
                    <img
                      src={imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-neutral-500 gap-1">
                    <span className="italic">{imageCaption}</span>
                    <span className="font-semibold text-neutral-600 dark:text-neutral-400">Photo: {imageCredit}</span>
                  </div>
                </div>
              )}

              {/* Body Content in Tailwind Typography */}
              <div
                className="prose prose-rose dark:prose-invert max-w-none font-serif text-base sm:text-lg leading-relaxed pt-2"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {/* Topic Tags */}
              {tags.length > 0 && (
                <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-neutral-400">Filed under:</span>
                  {tags.map(t => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-xs font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Live Preview Action Footer */}
              <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Return to Compose</span>
                </button>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSaveArticle('draft')}
                    className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Save Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveArticle('in_review')}
                    className="px-4 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    title="Submit dispatch to Desk Editor review queue"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Submit Review</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveArticle('published')}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-md shadow-rose-900/30 transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Update Dispatch' : (rolePermissions.canPublishLive ? 'Publish Live' : 'Submit Review')}</span>
                  </button>
                </div>
              </div>

            </article>
          </div>
        </div>
      )}

      {/* 6. Discard Form Confirmation Modal */}
      <ConfirmationModal
        isOpen={discardModalOpen}
        title="Discard Editorial Draft?"
        message="Are you sure you want to discard your changes? All unsaved inputs in this compose session will be cleared."
        confirmText="Yes, Discard Form"
        confirmVariant="danger"
        onConfirm={handleResetForm}
        onClose={() => setDiscardModalOpen(false)}
      />

      {/* 7. Revision History Modal */}
      {isRevisionsOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#121418] rounded-2xl max-w-lg w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                  Story Revision Snapshots ({currentRevisions.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRevisionsOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {currentRevisions.length > 0 ? (
              <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {currentRevisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                        {rev.title || 'Untitled Draft'}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                        {rev.timestamp} • {rev.author} ({rev.role || 'Staff'}) • {rev.wordCount || 0} words
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRestoreRevision(rev.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] shrink-0"
                    >
                      Restore Version
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-neutral-500">
                <History className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                <p>No previous revision snapshots recorded yet.</p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Revisions are automatically captured each time you save a draft, submit for review, or publish.
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsRevisionsOpen(false)}
                className="px-4 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
