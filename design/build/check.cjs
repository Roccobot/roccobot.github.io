// Checks the generated page in Chromium with the real fonts: no sideways scroll, the T key,
// and the line breaks of every paragraph (no short word left alone at either end of a line).
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
      await ctx.route('https://page.local/', r => r.fulfill({ contentType: 'text/html', body: doc }));
      const p = await ctx.newPage();
      const errors = [];
      p.on('pageerror', e => errors.push(e.message));
      await p.goto('https://page.local/');
      await p.evaluate(() => document.fonts.ready);
      const fontsLoaded = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family).filter((v, i, a) => a.indexOf(v) === i));
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      const lines = await p.evaluate(() => {
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
      // Every drawn mark must sit whole inside its box (a <use> with a shifted viewBox clipped it,
      // Rocco saw it) and with the centre of its IDEAL SQUARE in the middle of the box: that is
      // his weighted centring, from his reference image. The centre is found from the drawn ink,
      // so the check does not depend on how the page frames the mark.
      const marks = await p.evaluate(mk => {
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
      }, JSON.parse(fs.readFileSync(path.join(cache, 'mark.json'), 'utf8')));
      // T key: flips the theme, and does nothing while typing in a field
      const before = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
      await p.keyboard.press('t');
      const after = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
      await p.evaluate(() => { const i = document.createElement('input'); i.id = 'probe'; document.body.prepend(i); i.focus(); });
      await p.keyboard.press('t');
      const typed = await p.evaluate(() => [getComputedStyle(document.body).backgroundColor, document.getElementById('probe').value]);
      await p.evaluate(() => { document.getElementById('probe').remove(); document.documentElement.removeAttribute('data-theme'); });
      await p.screenshot({ path: path.join(cache, `shot-${w}-${scheme}.png`), fullPage: false });
      for (const id of ['accenti', 'marchio', 'icona', 'colori', 'caratteri', 'componenti']) {
        await p.evaluate(i => { document.getElementById(i).scrollIntoView(); }, id);
        await p.screenshot({ path: path.join(cache, `shot-${w}-${scheme}-${id}.png`), fullPage: false });
      }
      report.push({ w, scheme, fontsLoaded, overflow, errors, tFlips: before !== after, tIgnoredInField: typed[0] === after && typed[1] === 't', lines, marks });
      await ctx.close();
    }
  }
  await browser.close();
  console.log(JSON.stringify(report, null, 1));
})();
