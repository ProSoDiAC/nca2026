import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useData } from '../lib/data';
import { dayNumber } from '../lib/dates';
import { strings } from '../strings';
import { HeroNetwork } from '../components/NetworkMotif';
import { Container } from '../components/Container';
import { IconCalendar, IconCamera, IconChevronRight, IconNews, IconPeople, IconPin } from '../components/icons';
import { ImportantChip, newsDate } from '../components/NewsMeta';

const s = strings.home;

const logoHeight = (size?: string) => (size === 'lg' ? 'max-h-[60px]' : size === 'sm' ? 'max-h-[34px]' : 'max-h-[44px]');

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="m-0 font-sora text-lg font-semibold md:text-xl">{children}</h2>;
}

const tileClass =
  'flex min-h-[112px] flex-col justify-between gap-3 rounded-card bg-card p-4 transition-shadow hover:shadow-[0_2px_12px_rgba(10,37,64,0.08)] md:p-5';

function TileText({ title, sub }: { title: string; sub: string }) {
  return (
    <span className="flex flex-col gap-0.5">
      <span className="font-sora text-[15px] font-semibold md:text-base">{title}</span>
      <span className="text-[12.5px] text-muted md:text-[13px]">{sub}</span>
    </span>
  );
}

function TileIcon({ bg, fg, children }: { bg: string; fg: string; children: ReactNode }) {
  return <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${fg}`}>{children}</span>;
}

export function HomePage() {
  const { news, program } = useData();
  const dowByDate = new Map(program.days.map((d) => [d.date, d.dow]));
  const keynotes = program.entries.filter((e) => e.type === 'keynote');
  const important = news.filter((n) => n.important);
  const latest = news.filter((n) => !n.important);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-night">
        <HeroNetwork />
        <Container className="relative flex flex-col gap-5 pb-7 pt-12 md:gap-6 md:pb-14 md:pt-16 lg:pb-20 lg:pt-20">
          <div className="mt-9 flex flex-col gap-2 md:mt-0 md:max-w-[640px]">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.08em] text-ochre md:text-[13px]">{s.eyebrow}</p>
            <h1 className="m-0 font-sora text-[56px] font-bold leading-none text-white md:text-[72px] lg:text-[84px]">
              {s.title}
            </h1>
            <p className="m-0 font-sora text-[19px] font-medium leading-[1.3] text-ice md:text-[24px]">{s.subtitle}</p>
          </div>
          <div className="flex flex-col gap-2.5 text-sm text-white md:flex-row md:gap-8 md:text-[15px]">
            <div className="flex items-center gap-2.5">
              <IconCalendar size={20} className="text-ochre" />
              <span>{s.dates}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <IconPin size={20} className="text-ochre" />
              <span>{s.place}</span>
            </div>
          </div>
          <div className="flex gap-2.5 md:max-w-[440px]">
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
        </Container>
      </section>

      <Container className="flex flex-col gap-7 pb-7 pt-6 md:gap-12 md:pb-14 md:pt-10">
        {/* Important announcements, right under the hero */}
        {important.length > 0 && (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {important.map((n) => (
              <li key={n.id}>
                <Link
                  to={`/news/${encodeURIComponent(n.id)}`}
                  className="flex flex-col gap-1.5 rounded-card border-2 border-alert bg-card p-4 md:flex-row md:items-center md:gap-5 md:p-5"
                >
                  <span className="flex flex-none items-center gap-2">
                    <ImportantChip />
                    <span className="text-xs text-tab">{newsDate(n.date)}</span>
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-sora text-base font-semibold">{n.title}</span>
                    <span className="text-sm leading-normal text-sub">{n.summary}</span>
                  </span>
                  <IconChevronRight className="hidden flex-none text-alert md:ml-auto md:block" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Quick access */}
        <section className="flex flex-col gap-3 md:gap-4">
          <SectionTitle>{s.quickAccess}</SectionTitle>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
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

        {/* Photo gallery (external site) */}
        <section className="flex flex-col gap-3 md:gap-4">
          <SectionTitle>{s.photos.title}</SectionTitle>
          <a
            href={s.photos.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex flex-col gap-4 overflow-hidden rounded-card-lg bg-night p-5 text-white md:flex-row md:items-center md:justify-between md:p-7"
          >
            <span className="flex items-center gap-4">
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-white/10 text-ochre">
                <IconCamera size={26} />
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-sora text-[17px] font-semibold leading-[1.25] md:text-xl">{s.photos.heading}</span>
                <span className="text-sm text-ice">{s.photos.sub}</span>
              </span>
            </span>
            <span className="flex min-h-[48px] flex-none items-center justify-center gap-2 rounded-[14px] bg-ochre px-5 text-[15px] font-semibold text-night">
              {s.photos.cta}
              <IconChevronRight />
            </span>
          </a>
        </section>

        {/* About + Where */}
        <div className="grid gap-7 md:gap-8 lg:grid-cols-3 lg:gap-10">
          <section className="flex flex-col gap-3 lg:col-span-2">
            <SectionTitle>{s.aboutTitle}</SectionTitle>
            <p className="m-0 max-w-[68ch] text-[14.5px] leading-[1.55] text-body md:text-[15.5px] md:leading-[1.65]">{s.about}</p>
          </section>
          <section className="flex flex-col gap-3">
            <SectionTitle>{s.whereTitle}</SectionTitle>
            <address className="flex flex-col gap-1 rounded-card bg-card p-4 not-italic md:p-5">
              <span className="text-[15px] font-semibold">{s.venueName}</span>
              <span className="text-sm text-muted">{s.venueAddress}</span>
            </address>
          </section>
        </div>

        {/* Keynotes */}
        {keynotes.length > 0 && (
          <section className="flex flex-col gap-3 md:gap-4">
            <SectionTitle>{s.keynotesTitle}</SectionTitle>
            <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-3 md:gap-4">
              {keynotes.map((k) => (
                <li key={`${k.day}-${k.start}`} className="flex flex-col gap-2 rounded-card bg-ochre-soft p-4 md:p-5">
                  <span className="text-xs font-semibold text-ochre-text">
                    {dowByDate.get(k.day)} {dayNumber(k.day)} Nov · {k.start} – {k.end}
                  </span>
                  {'title' in k && k.title && (
                    <span className="font-sora text-[15px] font-semibold leading-[1.3]">{k.title}</span>
                  )}
                  {'speaker' in k && k.speaker && <span className="text-[13.5px] text-sub">{k.speaker}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Latest news: 1 on phones, up to 3 from tablet up */}
        {latest.length > 0 && (
          <section className="flex flex-col gap-3 md:gap-4">
            <div className="flex items-baseline justify-between">
              <SectionTitle>{s.latestNews}</SectionTitle>
              <Link to="/news" className="flex min-h-[44px] items-center text-sm font-semibold text-teal-text">
                {s.seeAll}
              </Link>
            </div>
            <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {latest.slice(0, 3).map((n, i) => (
                <li key={n.id} className={i === 0 ? 'flex' : 'hidden md:flex'}>
                  <Link
                    to={`/news/${encodeURIComponent(n.id)}`}
                    className="flex w-full flex-col gap-1.5 rounded-card bg-card p-4 md:p-5"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.06em] text-teal-text">{n.category}</span>
                    <span className="font-sora text-base font-semibold">{n.title}</span>
                    <span className="text-sm leading-normal text-muted">{n.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Sponsors & patronage */}
        <section className="flex flex-col gap-3 md:gap-4">
          <SectionTitle>{s.sponsorsTitle}</SectionTitle>
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
            {s.sponsors.map((sp) => (
              <li key={sp.name} className="flex h-[84px] items-center justify-center rounded-card bg-card px-4 py-3 md:h-[96px]">
                <img
                  src={`${import.meta.env.BASE_URL}logos/${sp.logo}`}
                  alt={sp.name}
                  loading="lazy"
                  className={`${logoHeight('size' in sp ? sp.size : undefined)} max-w-full object-contain`}
                />
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4 rounded-card bg-card p-4 md:max-w-[420px]">
            <img
              src={`${import.meta.env.BASE_URL}logos/${s.patronage.logo}`}
              alt=""
              loading="lazy"
              className="h-16 w-auto flex-none object-contain"
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-[0.06em] text-teal-text">{s.patronageTitle}</span>
              <span className="text-[15px] font-semibold">{s.patronage.name}</span>
            </span>
          </div>
        </section>

        {/* Agency: on tablet/desktop it is in the footer */}
        <section className="flex flex-col gap-1.5 rounded-card bg-night p-4 text-white md:hidden">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.06em] text-ochre">{s.agencyEyebrow}</p>
          <h2 className="m-0 font-sora text-base font-semibold">{s.agencyName}</h2>
          <a href={s.agencyTel} className="flex min-h-[44px] items-center text-sm text-ice">
            {s.agencyPhone}
          </a>
        </section>
      </Container>
    </div>
  );
}
