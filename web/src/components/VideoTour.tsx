// Part of CaseFile Earth. Written with AI assistance; see docs/AI_USE.md.
// The narrated video tour of the whole site, featured on the Watch page. The site loads only its own files, so the
// card shows a local poster and loads the YouTube player only after the visitor presses play (or picks a chapter).
// The offline file shows a plain link instead: the video needs the internet.
import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ExternalLink, Play } from 'lucide-react';
import { useT } from '../i18n';
import { int } from '../i18n/format';
import { IS_OFFLINE_BUILD } from '../data/offline';
import { useLang } from '../state/prefs';
import { cn } from '../ui/common/utils';

export const TOUR_VIDEO_ID = 'e0cjM7Ls0KI';
export const TOUR_URL = `https://youtu.be/${TOUR_VIDEO_ID}`;

/** Chapter starts in seconds, as published in the video's description. */
export const TOUR_CHAPTERS: { at: number; key: string }[] = [
  { at: 0, key: 'case' },
  { at: 38, key: 'globe' },
  { at: 124, key: 'years' },
  { at: 152, key: 'place' },
  { at: 206, key: 'verdicts' },
  { at: 308, key: 'two' },
  { at: 343, key: 'ask' },
  { at: 378, key: 'trends' },
  { at: 419, key: 'bangla' },
  { at: 441, key: 'evidence' },
];

/** m:ss, with Bangla digits in Bangla. Layout text only: a time stamp, not a statistic. */
export function clock(sec: number, lang: 'en' | 'bn'): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${int(m, lang)}:${int(Math.floor(s / 10), lang)}${int(s % 10, lang)}`;
}

export function VideoTour() {
  const t = useT();
  const lang = useLang();
  const reduce = useReducedMotion();
  const [start, setStart] = useState<number | null>(null);
  const play = (at: number) => setStart(at);

  if (IS_OFFLINE_BUILD) {
    return (
      <section className="mb-12 rounded-card border border-line bg-surface p-5" aria-labelledby="video-tour-title" data-testid="video-tour">
        <p className="m-0 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-accent-ink">{t('site.tour.eyebrow')}</p>
        <h2 id="video-tour-title" className="mb-2 mt-1 font-display text-[28px] font-normal leading-tight">
          {t('site.tour.title')}
        </h2>
        <a href={TOUR_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold">
          {t('site.tour.youtube')}
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </section>
    );
  }

  return (
    <motion.section
      className="mb-14"
      aria-labelledby="video-tour-title"
      data-testid="video-tour"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-[70ch]">
          <p className="m-0 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-accent-ink">{t('site.tour.eyebrow')}</p>
          <h2 id="video-tour-title" className="m-0 mt-1 font-display text-[34px] font-normal leading-tight sm:text-[40px]">
            {t('site.tour.title')}
          </h2>
          <p className="m-0 mt-2 text-[15.5px] leading-relaxed text-muted">{t('site.tour.lead')}</p>
        </div>
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="relative aspect-video overflow-hidden rounded-card border border-line bg-[#020812] shadow-card">
            {start === null ? (
              <button
                type="button"
                onClick={() => play(0)}
                className="group absolute inset-0 block size-full cursor-pointer text-left"
                aria-label={t('site.tour.play')}
                data-testid="video-tour-play"
              >
                <img src="./video/tour-poster.jpg" alt="" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#020812]/90 via-[#020812]/25 to-transparent" aria-hidden="true" />
                <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center sm:size-24" aria-hidden="true">
                  {!reduce ? <span className="absolute inset-0 animate-ping rounded-full bg-accent/30 [animation-duration:2.4s]" /> : null}
                  <span className="relative grid size-full place-items-center rounded-full bg-accent text-ocean shadow-[0_10px_40px_-6px_rgb(233_180_76/0.7)] transition-transform group-hover:scale-110">
                    <Play className="ml-1 size-9 fill-current" />
                  </span>
                </span>
                <span className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-4 sm:p-6">
                  <span className="font-display text-[22px] leading-tight text-white sm:text-[28px]">{t('site.tour.play')}</span>
                  <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1 font-mono text-[12px] text-white/90 backdrop-blur">{t('site.tour.length')}</span>
                </span>
              </button>
            ) : (
              <iframe
                className="absolute inset-0 size-full"
                src={`https://www.youtube-nocookie.com/embed/${TOUR_VIDEO_ID}?autoplay=1&rel=0&start=${start}`}
                title={t('site.tour.title')}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                data-testid="video-tour-player"
              />
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[13px] text-muted">
            <span>{t('site.tour.voice')}</span>
            <a href={TOUR_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold" data-testid="video-tour-youtube">
              {t('site.tour.youtube')}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
        <nav aria-label={t('site.tour.chapters')} className="rounded-card border border-line bg-surface p-3 shadow-card">
          <p className="m-0 px-2 pb-2 pt-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{t('site.tour.chapter_hint')}</p>
          <ol className="m-0 flex list-none flex-col p-0" data-testid="video-tour-chapters">
            {TOUR_CHAPTERS.map((c, i) => (
              <li key={c.key}>
                <button
                  type="button"
                  onClick={() => play(c.at)}
                  className={cn(
                    'group flex min-h-10 w-full items-center gap-3 rounded-[10px] px-2 py-1.5 text-left text-[14px] transition-colors hover:bg-accent/10',
                    start === c.at && 'bg-accent/15',
                  )}
                  data-testid={`video-tour-chapter-${c.key}`}
                >
                  <span className="w-11 shrink-0 font-mono text-[12px] tabular-nums text-accent-ink">{clock(c.at, lang)}</span>
                  <span className="min-w-0 flex-1 font-medium leading-snug">{t(`site.tour.ch.${c.key}`)}</span>
                  <span className="font-mono text-[11px] text-muted opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
                    {int(i + 1, lang)}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </motion.section>
  );
}
