// Part of CaseFile Earth. Written with AI assistance; see docs/AI_USE.md.
// The video tour on the Watch page: chapter times format in both languages, run in order, and every chapter has a
// title in English and Bangla.
import { describe, expect, it } from 'vitest';
import { hasKey, translate } from '../../src/i18n';
import { TOUR_CHAPTERS, TOUR_URL, clock } from '../../src/components/VideoTour';

describe('video tour', () => {
  it('formats chapter times as m:ss, with Bangla digits in Bangla', () => {
    expect(clock(0, 'en')).toBe('0:00');
    expect(clock(124, 'en')).toBe('2:04');
    expect(clock(441, 'en')).toBe('7:21');
    expect(clock(441, 'bn')).toBe('৭:২১');
  });

  it('lists chapters from the start of the video, in order', () => {
    expect(TOUR_CHAPTERS[0].at).toBe(0);
    for (let i = 1; i < TOUR_CHAPTERS.length; i++) expect(TOUR_CHAPTERS[i].at).toBeGreaterThan(TOUR_CHAPTERS[i - 1].at);
  });

  it('names every chapter in both languages', () => {
    for (const c of TOUR_CHAPTERS) {
      const key = `site.tour.ch.${c.key}`;
      expect(hasKey(key), c.key).toBe(true);
      expect(translate('bn', key), c.key).toMatch(/[ঀ-৿]/);
    }
  });

  it('links to the video on YouTube', () => {
    expect(TOUR_URL).toMatch(/^https:\/\/youtu\.be\/[\w-]{11}$/);
  });
});
