import type { ReactNode } from 'react';
import { Container } from './Container';

export function PageHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return (
    <Container className="flex flex-none flex-col gap-4 pb-1 pt-7 md:flex-row md:items-end md:justify-between md:pb-2 md:pt-10">
      <div className="flex flex-col gap-0.5">
        <h1 className="m-0 font-sora text-[28px] font-bold md:text-[34px]">{title}</h1>
        <p className="m-0 text-[13.5px] text-muted md:text-[15px]">{subtitle}</p>
      </div>
      {children}
    </Container>
  );
}
