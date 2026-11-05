import { Link, useParams } from 'react-router-dom';
import { useData } from '../lib/data';
import { strings } from '../strings';
import { IconChevronLeft } from '../components/icons';
import { chipColors, newsDate } from '../components/NewsMeta';

const t = strings.news;

export function NewsDetailPage() {
  const { id } = useParams();
  const { news } = useData();
  const item = news.find((n) => n.id === id);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="px-3 pt-4">
        <Link to="/news" className="inline-flex min-h-[44px] items-center gap-1 px-2 text-sm font-semibold text-teal-text">
          <IconChevronLeft />
          {t.back}
        </Link>
      </div>
      {item ? (
        <article className="flex flex-col gap-3 px-5 pb-8 pt-2">
          <div className="flex items-center gap-2">
            <span className={`rounded-chip px-2.5 py-1 text-xs font-semibold ${chipColors(item.category, false)}`}>{item.category}</span>
            <span className="text-xs text-tab">{newsDate(item.date)}</span>
          </div>
          <h1 className="m-0 font-sora text-[26px] font-bold leading-[1.2]">{item.title}</h1>
          <p className="m-0 text-[15px] font-medium leading-[1.55] text-body">{item.summary}</p>
          <div className="mt-1 flex flex-col gap-3 rounded-card-lg bg-card p-[18px]">
            {item.body.split(/\n{2,}/).map((para, i) => (
              <p key={i} className="m-0 whitespace-pre-line text-[15px] leading-[1.6] text-body">
                {para}
              </p>
            ))}
          </div>
        </article>
      ) : (
        <p className="px-5 py-8 text-sm text-muted" role="status">
          {t.notFound}
        </p>
      )}
    </div>
  );
}
