import { strings } from '../strings';
import { Container } from './Container';

const h = strings.home;
const f = strings.footer;

/** Site footer for tablet and desktop. Phones have the same details in the Home page and the tab bar. */
export function Footer() {
  return (
    <footer className="hidden bg-night text-ice md:block">
      <Container className="grid gap-8 py-10 md:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-sora text-lg font-bold text-white">{strings.appName}</span>
          <span className="text-sm leading-relaxed">{f.fullName}</span>
          <span className="text-sm">{h.dates}</span>
        </div>
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-ochre">{h.whereTitle}</span>
          <span className="font-semibold text-white">{h.venueName}</span>
          <span>{h.venueAddress}</span>
          <a href={h.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4">
            {f.openInMaps}
          </a>
        </div>
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-ochre">{h.agencyEyebrow}</span>
          <span className="font-semibold text-white">{h.agencyName}</span>
          <a href={h.agencyTel} className="text-ice">
            {h.agencyPhone}
          </a>
          <a href={f.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4">
            {f.website}
          </a>
          <a href={h.photos.url} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4">
            {f.photos}
          </a>
        </div>
      </Container>
    </footer>
  );
}
