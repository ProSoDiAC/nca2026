import { Link } from 'react-router-dom';
import { useData } from '../lib/data';
import { strings } from '../strings';
import { PageHeader } from '../components/PageHeader';
import { CardNetwork } from '../components/NetworkMotif';
import { chipColors, newsDate } from '../components/NewsMeta';

const t = strings.news;

export function NewsPage() {
  const { news } = useData();
  // news.json is kept newest-first; items with a date are additionally sorted newest-first.
  const items = [...news]
    .map((n, i) => ({ n, i }))
    .sort((a, b) => (a.n.date && b.n.date ? b.n.date.localeCompare(a.n.date) : 0) || a.i - b.i)
    .map(({ n }) => n);

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <ul className="m-0 flex min-h-0 flex-1 list-none flex-col gap-3.5 overflow-y-auto px-5 pb-5 pt-2">
        {items.length === 0 && <li className="py-8 text-center text-sm text-muted">{t.empty}</li>}
        {items.map((n, i) =>
          i === 0 ? (
            <li key={n.id} className="flex-none">
              <Link
                to={`/news/${encodeURIComponent(n.id)}`}
                className="relative flex flex-col gap-2.5 overflow-hidden rounded-card-lg bg-night p-5 text-white"
              >
                <CardNetwork />
                <div className="relative flex items-center gap-2">
                  <span className={`rounded-chip px-2.5 py-1 text-xs font-semibold ${chipColors(n.category, true)}`}>{n.category}</span>
                  <span className="text-xs text-ice">{newsDate(n.date)}</span>
                </div>
                <h2 className="relative m-0 pt-7 font-sora text-xl font-semibold leading-[1.25]">{n.title}</h2>
                <p className="relative m-0 text-[14.5px] leading-[1.55] text-mist">{n.summary}</p>
              </Link>
            </li>
          ) : (
            <li key={n.id} className="flex-none">
              <Link to={`/news/${encodeURIComponent(n.id)}`} className="flex flex-col gap-2 rounded-card-lg bg-card p-[18px]">
                <div className="flex items-center gap-2">
                  <span className={`rounded-chip px-2.5 py-1 text-xs font-semibold ${chipColors(n.category, false)}`}>{n.category}</span>
                  <span className="text-xs text-tab">{newsDate(n.date)}</span>
                </div>
                <h2 className="m-0 font-sora text-[17px] font-semibold leading-[1.3]">{n.title}</h2>
                <p className="m-0 text-sm leading-normal text-sub">{n.summary}</p>
              </Link>
            </li>
          ),
        )}
      </ul>
    </>
  );
}
