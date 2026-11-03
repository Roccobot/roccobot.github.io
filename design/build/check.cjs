// Checks the generated page in Chromium with the real fonts, in both languages: no sideways
// scroll, the T and L keys, and the line breaks of every paragraph (no short word left alone at
// either end of a line).
// Author: Rocco Casadei, a.k.a. Roccobot
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Run build.py, then fonts.py, then this script: the fonts and mark.json live in build/.cache/.
const cache = path.join(__dirname, '.cache');
const doc = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const fontsCss = fs.readFileSync(path.join(cache, 'fonts', 'fonts.css'), 'utf8');

(async () => {
  const browser = await chromium.launch();
  const report = [];
  for (const [w, h] of [[390, 844], [1280, 900]]) {
    for (const scheme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: 2 });
      await ctx.route('https://fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css', body: fontsCss }));
      await ctx.route('https://fonts.gstatic.com/local/**', r => r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(path.join(cache, 'fonts', path.basename(r.request().url()))) }));
      await ctx.route('https://page.local/**', r => r.fulfill({ contentType: 'text/html', body: doc }));
      const p = await ctx.newPage();
      const errors = [];
      p.on('pageerror', e => errors.push(e.message));
      await p.goto('https://page.local/');
      await p.evaluate(() => document.fonts.ready);
      const fontsLoaded = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family).filter((v, i, a) => a.indexOf(v) === i));
      const mk = JSON.parse(fs.readFileSync(path.join(cache, 'mark.json'), 'utf8'));
      const measure = async () => ({
        overflow: await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
        lines: await lineCheck(p),
        marks: await markCheck(p, mk),
        // the other language must be hidden everywhere: a visible element of it is a leak
        leaks: await p.evaluate(() => {
          const other = document.documentElement.getAttribute('data-lang') === 'en' ? 'it' : 'en';
          return [...document.querySelectorAll(`body [lang="${other}"]`)].filter(el => el.getClientRects().length).length;
        }),
      });
      const it = await measure();
      // L key: switches to English, and does nothing while typing in a field
      await p.keyboard.press('l');
      const toEn = await p.evaluate(() => [document.documentElement.lang, document.getElementById('h-come').innerText.replace(/\s+/g, ' ').trim()]);
      const en = await measure();
      await p.evaluate(() => { const i = document.createElement('input'); i.id = 'probe-l'; document.body.prepend(i); i.focus(); });
      await p.keyboard.press('l');
      const lTyped = await p.evaluate(() => [document.documentElement.lang, document.getElementById('probe-l').value]);
      await p.evaluate(() => document.getElementById('probe-l').remove());
      await p.keyboard.press('l');
      const back = await p.evaluate(() => document.documentElement.lang);
      report.push({ w, scheme, fontsLoaded, errors, it, en,
        lFlips: toEn[0] === 'en' && toEn[1] === 'One single source' && back === 'it',
        lIgnoredInField: lTyped[0] === 'en' && lTyped[1] === 'l' });
      const t = await themeCheck(p);
      Object.assign(report[report.length - 1], t);
      Object.assign(report[report.length - 1], await stillCheck(p));
      Object.assign(report[report.length - 1], await tocCheck(p, w));
      for (const id of ['accenti', 'marchio', 'icona', 'colori', 'caratteri', 'movimento', 'effetti', 'componenti']) {
        await p.evaluate(i => { document.getElementById(i).scrollIntoView(); }, id);
        await p.screenshot({ path: path.join(cache, `shot-${w}-${scheme}-${id}.png`), fullPage: false });
      }
      await ctx.close();
    }
  }
  await browser.close();
  console.log(JSON.stringify(report, null, 1));
})();

async function lineCheck(p) {
  return p.evaluate(() => {
        const bad = [];
        const els = document.querySelectorAll('main p, main li, main figcaption, main td, main dd, main h1, main h2, main h3');
        for (const el of els) {
          if (el.closest('.chip, .sizes, .duo, .spec-meta, .ratio')) continue;
          if (el.querySelector('p, div, dl, ul')) continue;
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          const words = [];
          let n;
          while ((n = walker.nextNode())) {
            if (n.parentElement.closest('svg')) continue;
            // NBSP ties words into one group, so only ordinary spaces separate tokens here
            const re = /[^ \t\n\r]+/g; let m;
            while ((m = re.exec(n.data))) {
              const r = document.createRange();
              r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
              const rects = [...r.getClientRects()].filter(x => x.width > 0);
              if (!rects.length) continue;
              words.push({ t: m[0], top: Math.round(rects[0].top), last: Math.round(rects[rects.length - 1].top) });
            }
          }
          if (words.length < 3) continue;
          const rows = [];
          for (const wd of words) {
            const row = rows.find(r => Math.abs(r.top - wd.top) < 4);
            if (row) row.w.push(wd.t); else rows.push({ top: wd.top, w: [wd.t] });
          }
          if (rows.length < 2) continue;
          const text = el.textContent.replace(/\s+/g, ' ').trim().slice(0, 70);
          const lastRow = rows[rows.length - 1].w.join(' ');
          const lastWords = rows[rows.length - 1].w;
          if (lastWords.length === 1 && lastRow.length < 10) bad.push(['ultima riga di una parola sola', lastRow, text]);
          for (const r of rows.slice(0, -1)) {
            const end = r.w[r.w.length - 1].replace(/[.,;:!?)]$/, '');
            if (end.length <= 2 && /^[\p{L}']+$/u.test(end)) bad.push(['parola corta in fondo', end, text]);
          }
          for (const r of rows.slice(1)) if (/^[.,;:!?)]/.test(r.w[0])) bad.push(['riga che comincia con un segno', r.w[0], text]);
        }
        return bad;
      });
}

async function markCheck(p, mk) {
      // Every drawn mark must sit whole inside its box (a <use> with a shifted viewBox clipped it,
      // Rocco saw it) and with the centre of its IDEAL SQUARE in the middle of the box: that is
      // his weighted centring, from his reference image. The centre is found from the drawn ink,
      // so the check does not depend on how the page frames the mark.
      return p.evaluate(mk => {
        const [ix, iy, iw, ih] = mk.ink; const [sx, sy, ss] = mk.square;
        const fx = (sx + ss / 2 - ix) / iw, fy = (sy + ss / 2 - iy) / ih;
        const bad = [];
        for (const u of document.querySelectorAll('svg use[href="#tian"]')) {
          const s = u.ownerSVGElement.getBoundingClientRect();
          const g = u.getBoundingClientRect();
          if (!s.width || !g.width) continue;
          const out = g.left < s.left - .5 || g.top < s.top - .5 || g.right > s.right + .5 || g.bottom > s.bottom + .5;
          const dx = Math.abs(g.left + fx * g.width - (s.left + s.right) / 2);
          const dy = Math.abs(g.top + fy * g.height - (s.top + s.bottom) / 2);
          if (out || dx > .75 || dy > .75) bad.push([u.ownerSVGElement.getAttribute('class') || u.ownerSVGElement.parentElement.className, +dx.toFixed(2), +dy.toFixed(2), out]);
        }
        return bad;
      }, mk);
}

async function stillCheck(p) {
  // Rocco's rule on language and theme (Roccobot.md 5.18): the two buttons keep the same box in
  // every language and theme, so switching moves nothing; and nothing is remembered, so a reload
  // after the L key opens the page in its default language again.
  const boxes = () => p.evaluate(() => ['lang', 'theme'].map(id => {
    const r = document.getElementById(id).getBoundingClientRect();
    return [Math.round(r.left * 10), Math.round(r.width * 10)].join(':');
  }).join(' '));
  // in every state each label stack shows exactly one label, and it is not empty (the build ties
  // words with a no-break space, and a stack once showed none because of it)
  const shown = () => p.evaluate(() => [...document.querySelectorAll('.ctl-stack')]
    .every(s => [...s.children].filter(c => c.hasAttribute('data-on') && c.textContent.trim()).length === 1));
  const seen = new Set([await boxes()]);
  let labelsShown = await shown();
  for (const k of ['t', 'l', 't', 'l']) { await p.keyboard.press(k); seen.add(await boxes()); labelsShown = labelsShown && await shown(); }
  await p.keyboard.press('l');
  const switched = await p.evaluate(() => document.documentElement.lang);
  await p.reload();
  await p.evaluate(() => document.fonts.ready);
  const afterReload = await p.evaluate(() => document.documentElement.lang);
  return { buttonsStill: seen.size === 1, labelsShown, reloadIsDefault: switched === 'en' && afterReload === 'it' };
}

async function tocCheck(p, w) {
  // The section index, as on RoccobotOS: where the side index is hidden (60 rem and below), a round
  // button appears while scrolling and opens it; a link closes it and goes to its section, Escape
  // and a tap outside close it. On a wide window the side index is always there and the button
  // does not exist.
  const state = () => p.evaluate(() => {
    const b = document.getElementById('toc-btn'), t = document.querySelector('nav.toc');
    const cs = getComputedStyle(b);
    return { btn: cs.display !== 'none' && cs.opacity === '1' && cs.pointerEvents !== 'none',
      btnShown: cs.display !== 'none', toc: getComputedStyle(t).display !== 'none' && t.getBoundingClientRect().width > 0,
      // the open panel reaches the bottom of the screen (as a grid child it once stopped halfway)
      full: t.getBoundingClientRect().height >= window.innerHeight - 1,
      // on a phone the button and the panel sit on the right (the owner's choice)
      right: Math.abs(b.getBoundingClientRect().right - (document.documentElement.clientWidth - 16)) < 2
        && (getComputedStyle(t).display === 'none' || Math.abs(t.getBoundingClientRect().right - document.documentElement.clientWidth) < 1),
      y: Math.round(window.scrollY) };
  });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(50);
  if (w > 960) {
    const s = await state();
    return { tocWide: !s.btnShown && s.toc };
  }
  const still = await state();
  await p.mouse.wheel(0, 600);
  await p.waitForTimeout(400);
  const moving = await state();
  await p.click('#toc-btn');
  const open = await state();
  // with the index open the page underneath does not scroll: on a phone a scroll would hide or
  // show the browser bar, and the panel would no longer cover the screen
  const before = await p.evaluate(() => window.scrollY);
  await p.mouse.move(380, 700);
  await p.mouse.wheel(0, 400);
  await p.waitForTimeout(300);
  const locked = (await p.evaluate(() => window.scrollY)) === before;
  await p.click('nav.toc a[href="#movimento"]');
  // the jump scrolls smoothly: wait until the page stops, then the section must be at the top
  let last = -1;
  for (let i = 0; i < 40; i++) {
    await p.waitForTimeout(150);
    const y = await p.evaluate(() => window.scrollY);
    if (y === last) break;
    last = y;
  }
  const went = await p.evaluate(() => Math.abs(document.getElementById('movimento').getBoundingClientRect().top) < 200);
  const closed = await state();
  await p.mouse.wheel(0, 200);
  await p.waitForTimeout(300);
  await p.click('#toc-btn');
  await p.keyboard.press('Escape');
  const esc = await state();
  return { tocNarrow: !still.btn && moving.btn && moving.right && open.toc && open.full && open.right && locked && !open.btn && went && !closed.toc && !esc.toc,
    tocParts: { moving: moving.btn, right: moving.right && open.right, open: open.toc && open.full, locked, went, closed: !closed.toc && !esc.toc } };
}

async function themeCheck(p) {
      // T key: flips the theme, and does nothing while typing in a field
      const before = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
      await p.keyboard.press('t');
      const after = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
      await p.evaluate(() => { const i = document.createElement('input'); i.id = 'probe'; document.body.prepend(i); i.focus(); });
      await p.keyboard.press('t');
      const typed = await p.evaluate(() => [getComputedStyle(document.body).backgroundColor, document.getElementById('probe').value]);
      await p.evaluate(() => { document.getElementById('probe').remove(); document.documentElement.removeAttribute('data-theme'); });
      return { tFlips: before !== after, tIgnoredInField: typed[0] === after && typed[1] === 't' };
}

