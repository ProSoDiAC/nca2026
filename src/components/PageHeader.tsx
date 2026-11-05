import type { ReactNode } from 'react';

export function PageHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return (
    <header className="flex flex-none flex-col gap-4 px-5 pb-3 pt-7">
      <div className="flex flex-col gap-0.5">
        <h1 className="m-0 font-sora text-[28px] font-bold">{title}</h1>
        <p className="m-0 text-[13.5px] text-muted">{subtitle}</p>
      </div>
      {children}
    </header>
  );
}
