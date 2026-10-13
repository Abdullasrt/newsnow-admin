import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import { Toast } from './components/Toast';

// Admin CMS Components & Pages
import { AdminRouteGuard } from './admin/components/AdminRouteGuard';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminArticlesPage } from './admin/pages/AdminArticlesPage';
import { AdminArticleEditorPage } from './admin/pages/AdminArticleEditorPage';
import { AdminBreakingNewsPage } from './admin/pages/AdminBreakingNewsPage';
import { AdminCategoriesPage } from './admin/pages/AdminCategoriesPage';
import { AdminEnquiriesPage } from './admin/pages/AdminEnquiriesPage';
import { AdminAnalyticsPage } from './admin/pages/AdminAnalyticsPage';
import { AdminSettingsPage } from './admin/pages/AdminSettingsPage';
import { AdminReviewQueuePage } from './admin/pages/AdminReviewQueuePage';
import { AdminTeamPage } from './admin/pages/AdminTeamPage';
import { AdminNewsletterPage } from './admin/pages/AdminNewsletterPage';

// Scroll to top automatically on route changes
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <NewsProvider>
      <BrowserRouter>
        <ScrollToTopOnNavigate />
        {/* Global Toast System */}
        <Toast />
        <Routes>
          {/* Admin Login routes */}
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Root redirect to /admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Protected Admin CMS Panel */}
          <Route
            path="/admin"
            element={
              <AdminRouteGuard>
                <AdminLayout />
              </AdminRouteGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="articles" element={<AdminArticlesPage />} />
            <Route path="articles/new" element={<AdminArticleEditorPage />} />
            <Route path="articles/edit/:id" element={<AdminArticleEditorPage />} />
            <Route path="breaking" element={<AdminBreakingNewsPage />} />
            <Route path="review-queue" element={<AdminReviewQueuePage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="newsletter" element={<AdminNewsletterPage />} />
            <Route path="team" element={<AdminTeamPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Catch-all redirect to /admin */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </NewsProvider>
  );
}

export default App;
