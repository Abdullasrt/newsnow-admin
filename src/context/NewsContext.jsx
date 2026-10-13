import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ARTICLES, BREAKING_NEWS, CATEGORIES, POPULAR_TAGS } from '../data/mockData';
import { INITIAL_ENQUIRIES } from '../data/mockEnquiries';
import {
  INITIAL_MEDIA_ASSETS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_COMMENTS,
  INITIAL_AUDIT_LOGS,
  ROLE_PERMISSIONS
} from '../data/mockCmsData';

const NewsContext = createContext(null);

export const NewsProvider = ({ children }) => {
  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('newsnow-theme') || localStorage.getItem('chronicle-theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply theme to html root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('newsnow-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Admin authentication & RBAC state
  const [adminUser, setAdminUser] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('newsnow-admin-user');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      name: 'Arun Varma',
      email: 'editor@newsnow.in',
      role: 'Chief Editor',
      bureau: 'Kochi HQ',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
    };
  });

  const [currentRole, setCurrentRole] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('newsnow-current-role') || 'Chief Editor';
    }
    return 'Chief Editor';
  });

  const switchRole = useCallback((newRole) => {
    setCurrentRole(newRole);
    setAdminUser(prev => ({
      ...prev,
      role: newRole
    }));
    try {
      localStorage.setItem('newsnow-current-role', newRole);
    } catch {
      // ignore
    }
  }, []);

  const loginAdmin = useCallback((user) => {
    const defaultUser = {
      name: 'Arun Varma',
      email: 'editor@newsnow.in',
      role: currentRole || 'Chief Editor',
      bureau: 'Kochi HQ',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      ...user
    };
    setAdminUser(defaultUser);
    localStorage.setItem('newsnow-admin-user', JSON.stringify(defaultUser));
  }, [currentRole]);

  const logoutAdmin = useCallback(() => {
    setAdminUser(null);
    localStorage.removeItem('newsnow-admin-user');
  }, []);

  // Articles state persisted in localStorage
  const [articles, setArticles] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('newsnow-articles');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Sanitize any stale Unsplash 404 URLs from prior sessions
            return parsed.map(a => {
              if (a.imageUrl && a.imageUrl.includes('1509391365360')) {
                return {
                  ...a,
                  imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1400&q=80'
                };
              }
              return a;
            });
          }
        }
      } catch (e) {
        console.error('Failed to parse articles from localStorage', e);
      }
    }
    return ARTICLES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('newsnow-articles', JSON.stringify(articles));
    } catch (e) {
      console.error('Failed to save articles to localStorage', e);
    }
  }, [articles]);

  // Breaking news state persisted in localStorage
  const [breakingNews, setBreakingNews] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('newsnow-breaking');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Failed to parse breaking news from localStorage', e);
      }
    }
    return BREAKING_NEWS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('newsnow-breaking', JSON.stringify(breakingNews));
    } catch (e) {
      console.error('Failed to save breaking news to localStorage', e);
    }
  }, [breakingNews]);

  // Categories list persisted in localStorage
  const [categories, setCategories] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('newsnow-categories');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return CATEGORIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('newsnow-categories', JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  // Reader Enquiries state persisted in localStorage
  const [enquiries, setEnquiries] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('newsnow-enquiries');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_ENQUIRIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('newsnow-enquiries', JSON.stringify(enquiries));
    } catch {
      // ignore
    }
  }, [enquiries]);

  // Media Assets Repository
  const [mediaAssets, setMediaAssets] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('newsnow-media-assets');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map(m => {
              if (m.url && m.url.includes('1509391365360')) {
                return {
                  ...m,
                  url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
                  thumbnail: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=400&q=80'
                };
              }
              return m;
            });
          }
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_MEDIA_ASSETS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('newsnow-media-assets', JSON.stringify(mediaAssets));
    } catch {
      // ignore
    }
  }, [mediaAssets]);

  // Newsroom Team Members
  const [teamMembers, setTeamMembers] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('newsnow-team');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_TEAM_MEMBERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('newsnow-team', JSON.stringify(teamMembers));
    } catch {
      // ignore
    }
  }, [teamMembers]);

  // Reader Comments & Moderation
  const [comments, setComments] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('newsnow-comments');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_COMMENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('newsnow-comments', JSON.stringify(comments));
    } catch {
      // ignore
    }
  }, [comments]);

  // Curated Homepage Layout
  const [curatedLayout, setCuratedLayout] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('newsnow-curated-layout');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      heroArticleId: '1',
      subLeadArticleIds: ['2', '3', '4'],
      opinionArticleIds: ['5', '6'],
      sectionOrder: ['Kerala', 'Tech', 'Business', 'Politics', 'Science', 'Culture']
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('newsnow-curated-layout', JSON.stringify(curatedLayout));
    } catch {
      // ignore
    }
  }, [curatedLayout]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('newsnow-audit-logs');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('newsnow-audit-logs', JSON.stringify(auditLogs));
    } catch {
      // ignore
    }
  }, [auditLogs]);

  // Article Revisions Map (articleId -> array of snapshots)
  const [articleRevisions, setArticleRevisions] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('newsnow-revisions');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem('newsnow-revisions', JSON.stringify(articleRevisions));
    } catch {
      // ignore
    }
  }, [articleRevisions]);

  // Bookmarks state persisted in localStorage
  const [bookmarks, setBookmarks] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('newsnow-bookmarks') || localStorage.getItem('chronicle-bookmarks');
        return saved ? JSON.parse(saved) : ['1', '2'];
      } catch (e) {
        console.error('Failed to parse bookmarks from localStorage', e);
        return ['1', '2'];
      }
    }
    return ['1', '2'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('newsnow-bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarks]);

  // Recent searches state
  const [recentSearches, setRecentSearches] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('newsnow-recent-searches');
        return saved ? JSON.parse(saved) : ['Kerala', 'Silicon', 'Water Metro', 'AI'];
      } catch {
        return ['Kerala', 'Silicon', 'Water Metro', 'AI'];
      }
    }
    return ['Kerala', 'Silicon', 'Water Metro', 'AI'];
  });

  const addRecentSearch = useCallback((query) => {
    if (!query || !query.trim()) return;
    const clean = query.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('newsnow-recent-searches', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('newsnow-recent-searches');
    } catch {
      // ignore
    }
  }, []);

  // Toast notification state
  const [toasts, setToasts] = useState([]);
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'info') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts([{ id, message, type }]);
    toastTimeoutRef.current = setTimeout(() => {
      setToasts([]);
    }, 3200);
  }, []);

  const removeToast = useCallback((id) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Helper: Log Activity to Audit Trail
  const logActivity = useCallback((action, target, type = 'general') => {
    const entry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: 'Just now',
      user: `${adminUser?.name || 'Chief Editor'} (${currentRole})`,
      action,
      target,
      type
    };
    setAuditLogs(prev => [entry, ...prev].slice(0, 50));
  }, [adminUser, currentRole]);

  // Bookmark actions
  const isBookmarked = useCallback((articleId) => {
    return bookmarks.includes(String(articleId));
  }, [bookmarks]);

  const toggleBookmark = useCallback((articleId) => {
    const idStr = String(articleId);
    const exists = bookmarks.includes(idStr);

    if (exists) {
      setBookmarks(prev => prev.filter(id => id !== idStr));
      showToast('Article removed from saved reading list', 'info');
    } else {
      setBookmarks(prev => [...prev, idStr]);
      showToast('Article saved to reading list! 📑', 'success');
    }
  }, [bookmarks, showToast]);

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
    showToast('Saved reading list cleared', 'info');
  }, [showToast]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');

  // UI Drawer / Modal states
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isBookmarkDrawerOpen, setIsBookmarkDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openSearchModal = useCallback(() => setIsSearchModalOpen(true), []);
  const closeSearchModal = useCallback(() => setIsSearchModalOpen(false), []);

  const triggerReload = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, []);

  // Revision History Handlers
  const saveArticleRevision = useCallback((articleId, snapshot) => {
    const rev = {
      id: `rev-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      author: adminUser?.name || 'Staff Editor',
      role: currentRole,
      ...snapshot
    };
    setArticleRevisions(prev => {
      const existing = prev[articleId] || [];
      return {
        ...prev,
        [articleId]: [rev, ...existing].slice(0, 15) // Keep last 15 revisions
      };
    });
  }, [adminUser, currentRole]);

  const restoreArticleRevision = useCallback((articleId, revisionId) => {
    const list = articleRevisions[articleId] || [];
    const targetRev = list.find(r => r.id === revisionId);
    if (!targetRev) return null;
    showToast(`Restored revision from ${targetRev.timestamp} 🔄`, 'info');
    return targetRev;
  }, [articleRevisions, showToast]);

  // Article CRUD Operations
  const addArticle = useCallback((newArticle) => {
    const id = String(Date.now());
    const status = newArticle.status || 'draft';
    const isDraft = status === 'draft';
    const isReview = status === 'in_review';
    
    const article = {
      id,
      slug: (newArticle.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      publishedAt: isDraft || isReview
        ? (isReview ? 'In Editorial Review' : 'Draft (Unpublished)')
        : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      views: '0',
      claps: 0,
      readTime: newArticle.readTime || '4 min read',
      tags: [],
      status,
      dateline: newArticle.dateline || 'Kochi, Kerala',
      sourceAttribution: newArticle.sourceAttribution || 'Staff Investigation',
      license: newArticle.license || 'Staff Wire Photography',
      ...newArticle
    };

    setArticles(prev => [article, ...prev]);

    // Save initial revision
    saveArticleRevision(id, {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      wordCount: (article.content || '').split(/\s+/).filter(Boolean).length,
      status: article.status
    });

    logActivity(`Created ${status === 'published' ? 'Live Story' : (isReview ? 'Review Submission' : 'Draft')}`, article.title, 'article');

    // If marked as breaking and published, automatically prepend to breaking news
    if (newArticle.isBreaking && status === 'published') {
      setBreakingNews(prev => [
        {
          id: `breaking-${id}`,
          title: article.title,
          category: article.category,
          time: 'Just now',
          articleId: id,
          priority: 'Urgent',
          expiresIn: '4 hours'
        },
        ...prev
      ]);
    }

    if (isReview) {
      showToast('Dispatch submitted to Desk Editor review queue 📋', 'success');
    } else if (isDraft) {
      showToast('Draft saved locally', 'info');
    } else {
      showToast('Story published to live feed', 'success');
    }
    return article;
  }, [saveArticleRevision, logActivity, showToast]);

  const updateArticle = useCallback((id, updatedFields) => {
    const status = updatedFields.status;
    const isDraft = status === 'draft';
    const isReview = status === 'in_review';

    setArticles(prev => prev.map(a => {
      if (String(a.id) === String(id)) {
        const nextStatus = status || a.status;
        const updated = {
          ...a,
          ...updatedFields,
          status: nextStatus,
          publishedAt: nextStatus === 'draft'
            ? 'Draft (Unpublished)'
            : (nextStatus === 'in_review'
              ? 'In Editorial Review'
              : (a.publishedAt && a.publishedAt !== 'Draft (Unpublished)' && a.publishedAt !== 'In Editorial Review'
                ? a.publishedAt
                : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })))
        };

        // Snapshot revision if content or title changed
        if (updatedFields.content !== undefined || updatedFields.title !== undefined) {
          saveArticleRevision(id, {
            title: updated.title,
            excerpt: updated.excerpt,
            content: updated.content,
            wordCount: (updated.content || '').split(/\s+/).filter(Boolean).length,
            status: updated.status
          });
        }

        return updated;
      }
      return a;
    }));

    // If breaking status changed on a published article, sync to breaking news ticker
    if (updatedFields.isBreaking !== undefined) {
      if (updatedFields.isBreaking && status === 'published') {
        setBreakingNews(prev => {
          if (prev.some(b => String(b.articleId) === String(id))) {
            return prev.map(b => String(b.articleId) === String(id)
              ? { ...b, title: updatedFields.title || b.title, category: updatedFields.category || b.category }
              : b
            );
          }
          return [
            {
              id: `breaking-${id}`,
              title: updatedFields.title || 'Breaking Alert',
              category: updatedFields.category || 'Tech',
              time: 'Just now',
              articleId: String(id),
              priority: 'Urgent',
              expiresIn: '4 hours'
            },
            ...prev
          ];
        });
      } else if (!updatedFields.isBreaking) {
        setBreakingNews(prev => prev.filter(b => String(b.articleId) !== String(id)));
      }
    }

    if (isReview) {
      showToast('Dispatch submitted to Desk Editor review queue 📋', 'success');
      logActivity('Submitted for Review', updatedFields.title || 'Dispatch', 'review');
    } else if (isDraft) {
      showToast('Draft saved locally', 'info');
      logActivity('Saved Draft', updatedFields.title || 'Dispatch', 'draft');
    } else {
      showToast('Story published to live feed', 'success');
      logActivity('Published Story Live', updatedFields.title || 'Dispatch', 'publish');
    }
  }, [saveArticleRevision, logActivity, showToast]);

  const deleteArticle = useCallback((id) => {
    const target = articles.find(a => String(a.id) === String(id));
    setArticles(prev => prev.filter(a => String(a.id) !== String(id)));
    setBreakingNews(prev => prev.filter(b => String(b.articleId) !== String(id)));
    setBookmarks(prev => prev.filter(bId => String(bId) !== String(id)));
    logActivity('Deleted Article', target?.title || `ID ${id}`, 'delete');
    showToast('Article deleted from newsroom', 'info');
  }, [articles, logActivity, showToast]);

  const duplicateArticle = useCallback((id) => {
    const target = articles.find(a => String(a.id) === String(id));
    if (!target) return;
    const newId = String(Date.now());
    const duplicated = {
      ...target,
      id: newId,
      title: `${target.title} (Copy)`,
      slug: `${target.slug}-copy`,
      publishedAt: 'Draft (Unpublished)',
      views: '0',
      claps: 0,
      featured: false,
      status: 'draft'
    };
    setArticles(prev => [duplicated, ...prev]);
    logActivity('Duplicated Article', duplicated.title, 'draft');
    showToast('Article duplicated as new draft dispatch', 'success');
    return duplicated;
  }, [articles, logActivity, showToast]);

  const toggleArticleFeatured = useCallback((id) => {
    setArticles(prev => prev.map(a => {
      if (String(a.id) === String(id)) {
        const nextVal = !a.featured;
        logActivity(nextVal ? 'Promoted to Cover Feature' : 'Unpinned from Cover', a.title, 'featured');
        showToast(nextVal ? 'Story promoted to Cover Feature ⭐' : 'Story unpinned from Cover', 'info');
        return { ...a, featured: nextVal };
      }
      return a;
    }));
  }, [logActivity, showToast]);

  // Editorial Review Workflow Actions
  const submitArticleForReview = useCallback((articleId, reviewNotes) => {
    updateArticle(articleId, {
      status: 'in_review',
      reviewNotes: reviewNotes || 'Submitted for editorial desk verification'
    });
  }, [updateArticle]);

  const approveArticle = useCallback((articleId) => {
    const target = articles.find(a => String(a.id) === String(articleId));
    updateArticle(articleId, {
      status: 'published',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      reviewNotes: ''
    });
    logActivity('Approved & Published', target?.title || `ID ${articleId}`, 'publish');
    showToast('Dispatch approved and published live! 🚀', 'success');
  }, [articles, updateArticle, logActivity, showToast]);

  const rejectArticle = useCallback((articleId, feedback) => {
    const target = articles.find(a => String(a.id) === String(articleId));
    updateArticle(articleId, {
      status: 'draft',
      reviewNotes: feedback || 'Revisions requested by desk editor'
    });
    logActivity('Requested Revisions', target?.title || `ID ${articleId}`, 'review');
    showToast('Revision notes sent back to reporter ✍️', 'info');
  }, [articles, updateArticle, logActivity, showToast]);

  // Breaking News CRUD Operations
  const addBreakingNews = useCallback((item) => {
    const newItem = {
      id: `breaking-${Date.now()}`,
      time: 'Just now',
      priority: item.priority || 'Urgent',
      expiresIn: item.expiresIn || '4 hours',
      active: true,
      ...item
    };
    setBreakingNews(prev => [newItem, ...prev]);
    logActivity('Pushed Breaking News Marquee', newItem.title, 'breaking');
    showToast('Breaking alert pushed to live ticker ⚡', 'success');
    return newItem;
  }, [logActivity, showToast]);

  const updateBreakingNews = useCallback((id, updatedFields) => {
    setBreakingNews(prev => prev.map(b => (b.id === id ? { ...b, ...updatedFields } : b)));
    showToast('Breaking alert updated', 'success');
  }, [showToast]);

  const deleteBreakingNews = useCallback((id) => {
    setBreakingNews(prev => prev.filter(b => b.id !== id));
    showToast('Breaking alert removed from marquee', 'info');
  }, [showToast]);

  // Categories CRUD Operations
  const addCategory = useCallback((catName) => {
    const trimmed = catName.trim();
    if (!trimmed) return;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Desk already exists', 'error');
      return;
    }
    setCategories(prev => [...prev, trimmed]);
    logActivity('Created Editorial Desk', trimmed, 'desk');
    showToast(`New Desk "${trimmed}" created`, 'success');
  }, [categories, logActivity, showToast]);

  const deleteCategory = useCallback((catName) => {
    if (catName === 'All') {
      showToast('Cannot delete default "All" desk', 'error');
      return;
    }
    setCategories(prev => prev.filter(c => c !== catName));
    logActivity('Removed Editorial Desk', catName, 'desk');
    showToast(`Desk "${catName}" removed`, 'info');
  }, [logActivity, showToast]);

  // Media Library Operations
  const addMediaAsset = useCallback((asset) => {
    const newAsset = {
      id: `media-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      ...asset
    };
    setMediaAssets(prev => [newAsset, ...prev]);
    logActivity('Uploaded Media Asset', newAsset.title, 'media');
    showToast('Asset uploaded to newsroom media repository! 🖼️', 'success');
    return newAsset;
  }, [logActivity, showToast]);

  const deleteMediaAsset = useCallback((id) => {
    setMediaAssets(prev => prev.filter(m => m.id !== id));
    showToast('Asset deleted from media repository', 'info');
  }, [showToast]);

  // Team & Author Operations
  const addTeamMember = useCallback((member) => {
    const newMember = {
      id: `team-${Date.now()}`,
      status: 'active',
      storiesCount: 0,
      ...member
    };
    setTeamMembers(prev => [...prev, newMember]);
    logActivity('Added Staff Member', `${newMember.name} (${newMember.role})`, 'team');
    showToast(`Added ${newMember.name} to newsroom staff directory! 👤`, 'success');
    return newMember;
  }, [logActivity, showToast]);

  const updateTeamMember = useCallback((id, updatedFields) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
    showToast('Author profile updated', 'success');
  }, [showToast]);

  const deleteTeamMember = useCallback((id) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    showToast('Team member removed', 'info');
  }, [showToast]);

  // Reader Comments Operations
  const approveComment = useCallback((id) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    showToast('Comment approved for publication! 💬', 'success');
  }, [showToast]);

  const rejectComment = useCallback((id) => {
    setComments(prev => prev.filter(c => c.id !== id));
    showToast('Comment deleted from reader thread', 'info');
  }, [showToast]);

  const togglePinComment = useCallback((id) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
    showToast('Editorial comment pin toggled 📌', 'info');
  }, [showToast]);

  const toggleBanUser = useCallback((userEmail) => {
    setComments(prev => prev.map(c => c.email === userEmail ? { ...c, status: 'flagged' } : c));
    showToast(`User ${userEmail} banned from commenting`, 'error');
  }, [showToast]);

  // Homepage Curation Layout
  const updateCuratedLayout = useCallback((newLayout) => {
    setCuratedLayout(prev => ({
      ...prev,
      ...newLayout
    }));
    logActivity('Curated Frontpage Hierarchy', 'Lead Cover & Section Priority Updated', 'curation');
    showToast('Broadsheet frontpage layout updated & published! 📰', 'success');
  }, [logActivity, showToast]);

  // Newsletter & Syndication Operations
  const triggerNewsletter = useCallback((type = 'Morning Dispatch') => {
    logActivity('Triggered Newsletter Dispatch', `${type} (14,820 Subscribers)`, 'newsletter');
    showToast(`"${type}" scheduled and dispatched to 14,820 subscribers! 📬`, 'success');
  }, [logActivity, showToast]);

  const triggerPushNotification = useCallback((alertTitle) => {
    logActivity('Broadcasted Push Notification', alertTitle, 'push');
    showToast(`Push alert sent to mobile & browser readers! 🔔`, 'success');
  }, [logActivity, showToast]);

  // Enquiries CRUD Operations
  const addEnquiry = useCallback((enquiryData) => {
    const ticketId = enquiryData.id || `NN-ENQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEnquiry = {
      id: ticketId,
      status: 'unread',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      editorialNotes: '',
      anonymity: enquiryData.anonymity || 'Cryptographically Encrypted',
      attachment: enquiryData.attachment || null,
      ...enquiryData
    };
    setEnquiries(prev => [newEnquiry, ...prev]);
    return newEnquiry;
  }, []);

  const updateEnquiryStatus = useCallback((id, status, notes) => {
    setEnquiries(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          ...(status ? { status } : {}),
          ...(notes !== undefined ? { editorialNotes: notes } : {})
        };
      }
      return e;
    }));
    showToast('Enquiry status updated', 'success');
  }, [showToast]);

  const deleteEnquiry = useCallback((id) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
    showToast('Inquiry removed from editorial inbox', 'info');
  }, [showToast]);

  // Full System Reset / Backup
  const resetAllDataToDefaults = useCallback(() => {
    setArticles(ARTICLES);
    setBreakingNews(BREAKING_NEWS);
    setCategories(CATEGORIES);
    setEnquiries(INITIAL_ENQUIRIES);
    setMediaAssets(INITIAL_MEDIA_ASSETS);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setComments(INITIAL_COMMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setArticleRevisions({});
    localStorage.removeItem('newsnow-articles');
    localStorage.removeItem('newsnow-breaking');
    localStorage.removeItem('newsnow-categories');
    localStorage.removeItem('newsnow-enquiries');
    localStorage.removeItem('newsnow-media-assets');
    localStorage.removeItem('newsnow-team');
    localStorage.removeItem('newsnow-comments');
    localStorage.removeItem('newsnow-curated-layout');
    localStorage.removeItem('newsnow-audit-logs');
    localStorage.removeItem('newsnow-revisions');
    showToast('Newsroom data restored to default edition', 'info');
  }, [showToast]);

  const exportBackupJSON = useCallback(() => {
    const backup = {
      exportedAt: new Date().toISOString(),
      articles,
      breakingNews,
      categories,
      enquiries,
      mediaAssets,
      teamMembers,
      comments,
      curatedLayout,
      auditLogs
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `news-now-cms-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Newsroom backup exported to JSON 📥', 'success');
  }, [articles, breakingNews, categories, enquiries, mediaAssets, teamMembers, comments, curatedLayout, auditLogs, showToast]);

  const importBackupJSON = useCallback((jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (parsed.articles && Array.isArray(parsed.articles)) setArticles(parsed.articles);
      if (parsed.breakingNews && Array.isArray(parsed.breakingNews)) setBreakingNews(parsed.breakingNews);
      if (parsed.categories && Array.isArray(parsed.categories)) setCategories(parsed.categories);
      if (parsed.enquiries && Array.isArray(parsed.enquiries)) setEnquiries(parsed.enquiries);
      if (parsed.mediaAssets && Array.isArray(parsed.mediaAssets)) setMediaAssets(parsed.mediaAssets);
      if (parsed.teamMembers && Array.isArray(parsed.teamMembers)) setTeamMembers(parsed.teamMembers);
      if (parsed.comments && Array.isArray(parsed.comments)) setComments(parsed.comments);
      if (parsed.curatedLayout) setCuratedLayout(parsed.curatedLayout);
      if (parsed.auditLogs && Array.isArray(parsed.auditLogs)) setAuditLogs(parsed.auditLogs);
      showToast('Newsroom data successfully restored from backup! 📦', 'success');
      return true;
    } catch {
      showToast('Failed to import backup JSON. Invalid format.', 'error');
      return false;
    }
  }, [showToast]);

  // Computed bookmarked articles
  const bookmarkedArticles = useMemo(() => {
    return articles.filter(article => bookmarks.includes(String(article.id)));
  }, [articles, bookmarks]);

  // Computed filtered articles based on search, category, tag
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Exclude drafts and unapproved stories from public reader feeds
      if (article.status === 'draft' || article.status === 'in_review' || article.status === 'archived') {
        return false;
      }
      // Category match
      if (selectedCategory !== 'All') {
        const catA = (article.category || '').toLowerCase();
        const catB = selectedCategory.toLowerCase();
        const isKeralaMatch = (catA.includes('kerala') || catA.includes('regional')) && (catB.includes('kerala') || catB.includes('regional'));
        if (catA !== catB && !isKeralaMatch) {
          return false;
        }
      }
      // Tag match
      if (selectedTag && (!article.tags || !article.tags.includes(selectedTag))) {
        return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = article.title?.toLowerCase().includes(query);
        const matchExcerpt = article.excerpt?.toLowerCase().includes(query);
        const matchContent = article.content?.toLowerCase().includes(query);
        const matchAuthor = article.author?.name?.toLowerCase().includes(query);
        const matchCategory = article.category?.toLowerCase().includes(query);
        const matchTags = article.tags?.some(t => t.toLowerCase().includes(query));
        return matchTitle || matchExcerpt || matchContent || matchAuthor || matchCategory || matchTags;
      }
      return true;
    });
  }, [articles, selectedCategory, selectedTag, searchQuery]);

  const value = {
    theme,
    toggleTheme,
    bookmarks,
    bookmarkedArticles,
    isBookmarked,
    toggleBookmark,
    clearBookmarks,
    searchQuery,
    setSearchQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    isSearchModalOpen,
    setIsSearchModalOpen,
    openSearchModal,
    closeSearchModal,
    isBookmarkDrawerOpen,
    setIsBookmarkDrawerOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    // Articles & Data
    articles,
    breakingNews,
    categories,
    popularTags: POPULAR_TAGS,
    filteredArticles,
    toasts,
    showToast,
    removeToast,
    isLoading,
    triggerReload,
    // RBAC & Roles
    adminUser,
    currentRole,
    switchRole,
    rolePermissions: ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS['Chief Editor'],
    allRoles: Object.keys(ROLE_PERMISSIONS),
    loginAdmin,
    logoutAdmin,
    // Article CRUD & Revisions
    addArticle,
    updateArticle,
    deleteArticle,
    duplicateArticle,
    toggleArticleFeatured,
    articleRevisions,
    saveArticleRevision,
    restoreArticleRevision,
    // Editorial Review Queue
    submitArticleForReview,
    approveArticle,
    rejectArticle,
    // Breaking News
    addBreakingNews,
    updateBreakingNews,
    deleteBreakingNews,
    // Categories
    addCategory,
    deleteCategory,
    // Media Library
    mediaAssets,
    addMediaAsset,
    deleteMediaAsset,
    // Staff & Team
    teamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    // Comments & Moderation
    comments,
    approveComment,
    rejectComment,
    togglePinComment,
    toggleBanUser,
    // Curation
    curatedLayout,
    updateCuratedLayout,
    // Newsletter & Push
    triggerNewsletter,
    triggerPushNotification,
    // Audit Logs
    auditLogs,
    logActivity,
    // Enquiries / Tips
    enquiries,
    addEnquiry,
    updateEnquiryStatus,
    deleteEnquiry,
    // Backup & Restore
    resetAllDataToDefaults,
    exportBackupJSON,
    importBackupJSON
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
