import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import AppLayout from '@/layout/AppLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import Home from '@/pages/Home';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import UploadDocumentsPage from '@/pages/UploadDocumentsPage';
import MyDocumentsPage from '@/pages/MyDocumentsPage';
import AIChatPage from '@/pages/AIChatPage';
import KnowledgeGraphPage from '@/pages/KnowledgeGraphPage';
import FlashcardsPage from '@/pages/FlashcardsPage';
import QuizGeneratorPage from '@/pages/QuizGeneratorPage';
import PlaceholderPage from '@/pages/PlaceholderPage';
import VerifyEmailPage from '@/pages/VerifyEmailPage';
import NotFound from '@/pages/NotFound';

export const AppRoutes = () => (
  <Routes>
    {/* Public Landing Page */}
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
    </Route>

    {/* Login / Signup (same page, mode toggle) */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<LoginPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />

    {/* Protected Application Pages — requires authentication */}
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/documents/upload" element={<UploadDocumentsPage />} />
        <Route path="/documents" element={<MyDocumentsPage />} />
        <Route path="/chat" element={<AIChatPage />} />
        <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/quizzes" element={<QuizGeneratorPage />} />

        {/* Secondary Sidebar Pages */}
        <Route
          path="/timeline"
          element={
            <PlaceholderPage
              title="Timeline"
              description="Chronological view of your document digestion and learning milestones."
              icon="⏱️"
            />
          }
        />
        <Route
          path="/analytics"
          element={
            <PlaceholderPage
              title="Analytics"
              description="Deep performance analytics on recall retention, study time, and quiz accuracy."
              icon="📈"
            />
          }
        />
        <Route
          path="/calendar"
          element={
            <PlaceholderPage
              title="Calendar"
              description="Scheduled study sessions and automated spaced-repetition reminders."
              icon="📅"
            />
          }
        />
        <Route
          path="/settings"
          element={
            <PlaceholderPage
              title="Settings"
              description="Manage your profile, API keys, AI model preferences, and sync integrations."
              icon="⚙️"
            />
          }
        />
        <Route
          path="/trash"
          element={
            <PlaceholderPage
              title="Trash"
              description="View and recover deleted documents or permanently erase them."
              icon="🗑️"
            />
          }
        />
      </Route>
    </Route>

    {/* 404 Fallback */}
    <Route path="404" element={<NotFound />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
