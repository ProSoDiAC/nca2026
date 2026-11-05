import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DataProvider } from './lib/data';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ProgramPage } from './pages/ProgramPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { SessionsPage } from './pages/SessionsPage';

export function App() {
  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="program" element={<ProgramPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news/:id" element={<NewsDetailPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </DataProvider>
  );
}
