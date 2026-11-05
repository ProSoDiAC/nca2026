import { Outlet } from 'react-router-dom';
import { TabBar } from './TabBar';
import { DataGate } from './DataGate';

export function Layout() {
  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-app flex-col overflow-hidden bg-page text-night">
      <main className="flex min-h-0 flex-1 flex-col">
        <DataGate>
          <Outlet />
        </DataGate>
      </main>
      <TabBar />
    </div>
  );
}
