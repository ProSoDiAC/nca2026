import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useData } from '../lib/data';
import { strings } from '../strings';
import { HeroNetwork } from '../components/NetworkMotif';
import { IconCalendar, IconNews, IconPeople, IconPin } from '../components/icons';

const s = strings.home;

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="m-0 font-sora text-lg font-semibold">{children}</h2>;
}

const tileClass = 'flex min-h-[112px] flex-col justify-between gap-3 rounded-card bg-card p-4';

function TileText({ title, sub }: { title: string; sub: string }) {
  return (
    <span className="flex flex-col gap-0.5">
      <span className="font-sora text-[15px] font-semibold">{title}</span>
      <span className="text-[12.5px] text-muted">{sub}</span>
    </span>
  );
}

function TileIcon({ bg, fg, children }: { bg: string; fg: string; children: ReactNode }) {
  return (
    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${fg}`}>{children}</span>
  );
}

export function HomePage() {
  const { news } = useData();
  const latest = news[0];

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <section className="relative flex flex-col gap-5 overflow-hidden bg-night px-5 pb-7 pt-12">
        <HeroNetwork />
        <div className="relative mt-9 flex flex-col gap-2">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.08em] text-ochre">{s.eyebrow}</p>
          <h1 className="m-0 font-sora text-[56px] font-bold leading-none text-white">{s.title}</h1>
          <p className="m-0 font-sora text-[19px] font-medium leading-[1.3] text-ice">{s.subtitle}</p>
        </div>
        <div className="relative flex flex-col gap-2.5 text-sm text-white">
          <div className="flex items-center gap-2.5">
            <IconCalendar size={20} className="text-ochre" />
            <span>{s.dates}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <IconPin size={20} className="text-ochre" />
            <span>{s.place}</span>
          </div>
        </div>
        <div className="relative flex gap-2.5">
          <Link
            to="/program"
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-[14px] bg-ochre text-[15px] font-semibold text-night"
          >
            {s.ctaProgram}
          </Link>
          <Link
            to="/news"
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-[14px] border-[1.5px] border-teal-light text-[15px] font-semibold text-white"
          >
            {s.ctaNews}
          </Link>
        </div>
      </section>

      <div className="flex flex-col gap-7 px-5 pb-7 pt-6">
        <section className="flex flex-col gap-3">
          <SectionTitle>{s.quickAccess}</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/program" className={tileClass}>
              <TileIcon bg="bg-teal-soft" fg="text-teal-text">
                <IconCalendar />
              </TileIcon>
              <TileText {...s.quick.program} />
            </Link>
            <Link to="/sessions" className={tileClass}>
              <TileIcon bg="bg-ochre-soft" fg="text-ochre-text">
                <IconPeople />
              </TileIcon>
              <TileText {...s.quick.sessions} />
            </Link>
            <Link to="/news" className={tileClass}>
              <TileIcon bg="bg-indigo-soft" fg="text-indigo-text">
                <IconNews />
              </TileIcon>
              <TileText {...s.quick.news} />
            </Link>
            <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className={tileClass}>
              <TileIcon bg="bg-leaf-soft" fg="text-leaf-text">
                <IconPin />
              </TileIcon>
              <TileText {...s.quick.venue} />
            </a>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <SectionTitle>{s.aboutTitle}</SectionTitle>
          <p className="m-0 text-[14.5px] leading-[1.55] text-body">{s.about}</p>
        </section>

        <section className="flex flex-col gap-3">
          <SectionTitle>{s.whereTitle}</SectionTitle>
          <address className="flex flex-col gap-1 rounded-card bg-card p-4 not-italic">
            <span className="text-[15px] font-semibold">{s.venueName}</span>
            <span className="text-sm text-muted">{s.venueAddress}</span>
          </address>
        </section>

        {latest && (
          <section className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <SectionTitle>{s.latestNews}</SectionTitle>
              <Link to="/news" className="flex min-h-[44px] items-center text-sm font-semibold text-teal-text">
                {s.seeAll}
              </Link>
            </div>
            <Link to={`/news/${encodeURIComponent(latest.id)}`} className="flex flex-col gap-1.5 rounded-card bg-card p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.06em] text-teal-text">{latest.category}</span>
              <span className="font-sora text-base font-semibold">{latest.title}</span>
              <span className="text-sm leading-normal text-muted">{latest.summary}</span>
            </Link>
          </section>
        )}

        <section className="flex flex-col gap-3">
          <SectionTitle>{s.sponsorsTitle}</SectionTitle>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {s.sponsors.map((name) => (
              <li key={name} className="rounded-chip bg-card px-3 py-2 text-[13px] font-medium">
                {name}
              </li>
            ))}
            <li className="rounded-chip bg-teal-soft px-3 py-2 text-[13px] font-medium">{s.patronage}</li>
          </ul>
        </section>

        <section className="flex flex-col gap-1.5 rounded-card bg-night p-4 text-white">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.06em] text-ochre">{s.agencyEyebrow}</p>
          <h2 className="m-0 font-sora text-base font-semibold">{s.agencyName}</h2>
          <a href={s.agencyTel} className="flex min-h-[44px] items-center text-sm text-ice">
            {s.agencyPhone}
          </a>
        </section>
      </div>
    </div>
  );
}
