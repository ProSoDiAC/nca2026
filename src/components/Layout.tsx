import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TabBar } from './TabBar';
import { DesktopNav } from './DesktopNav';
import { Footer } from './Footer';
import { DataGate } from './DataGate';

/** The page scrolls as a whole (no inner scroll areas), so restore the top when the route changes. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function Layout() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-page text-night">
      {/* Installed on iOS the status bar is translucent: keep a navy strip behind it. */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-[env(safe-area-inset-top)] bg-night md:hidden" />
      <ScrollToTop />
      <DesktopNav />
      <main className="flex flex-1 flex-col pb-[calc(64px+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] md:pb-0 md:pt-0">
        <DataGate>
          <Outlet />
        </DataGate>
      </main>
      <Footer />
      <TabBar />
    </div>
  );
}
