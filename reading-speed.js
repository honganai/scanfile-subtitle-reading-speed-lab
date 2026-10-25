/* Original Scanfile example, AI-assisted. MIT license; no third-party libraries. */
(function () {
  'use strict';
  const sample = '1\n00:00:00,000 --> 00:00:02,000\nHello world.\n\n2\n00:00:03,000 --> 00:00:04,000\nThis deliberately crowded subtitle needs more time on screen.\n\n3\n00:00:05,000 --> 00:00:08,000\n<i>你好</i> 👩‍💻\n\n4\n00:00:09,000 --> 00:00:09,000\nAn invalid zero-duration cue.';
  const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  function clock(value) {
    const m = /^(\d{2,}):([0-5]\d):([0-5]\d)[,.](\d{3})$/.exec(value);
    if (!m) return null;
    const n = (Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3])) * 1000 + Number(m[4]);
    return Number.isSafeInteger(n) ? n : null;
  }
  function clean(value) {
    const names = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
    return value.replace(/<\/?(?:b|i|u|font)\b[^>]*>/gi, '')
      .replace(/&(amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);/gi, (whole, entity) => {
        const e = entity.toLowerCase();
        if (Object.prototype.hasOwnProperty.call(names, e)) return names[e];
        const n = e.startsWith('#x') ? parseInt(e.slice(2), 16) : Number(e.slice(1));
        return Number.isInteger(n) && n > 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff)
          ? String.fromCodePoint(n) : whole;
      }).replace(/\s+/gu, ' ').trim();
  }
  function count(value) {
    return segmenter ? Array.from(segmenter.segment(value)).length : Array.from(value).length;
  }
  function analyse(source, threshold) {
    const limit = Number(threshold);
    if (!Number.isFinite(limit) || limit < 1 || limit > 80) throw new Error('Choose a threshold from 1 to 80.');
    if (source.length > 250000) throw new Error('Use at most 250,000 characters in this small demo.');
    const normalized = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim();
    if (!normalized) return { rows: [], errors: ['Paste some SRT cues first.'], mode: segmenter ? 'graphemes' : 'code points' };
    const rows = [], errors = [];
    normalized.split(/\n[ \t]*\n+/).forEach((block, position) => {
      const lines = block.split('\n');
      const indexed = /^\d+$/.test(lines[0].trim());
      const id = indexed ? lines.shift().trim() : String(position + 1);
      const timing = (lines.shift() || '').trim();
      const match = /^(\d{2,}:[0-5]\d:[0-5]\d[,.]\d{3})\s*-->\s*(\d{2,}:[0-5]\d:[0-5]\d[,.]\d{3})(?:\s+.*)?$/.exec(timing);
      if (!match) { errors.push('Block ' + (position + 1) + ': invalid or missing SRT timestamps.'); return; }
      const start = clock(match[1]), end = clock(match[2]);
      if (start === null || end === null || end <= start) { errors.push('Cue ' + id + ': end must be later than start.'); return; }
      const text = clean(lines.join(' '));
      if (!text) { errors.push('Cue ' + id + ': no dialogue text.'); return; }
      const seconds = (end - start) / 1000, characters = count(text), cps = characters / seconds;
      rows.push({ id, text, seconds, characters, cps, above: cps > limit });
    });
    return { rows, errors, mode: segmenter ? 'graphemes' : 'code points' };
  }
  const api = { analyse, clock, clean, count, sample };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;
  function render() {
    const tbody = document.getElementById('results'), errorList = document.getElementById('errors');
    tbody.replaceChildren(); errorList.replaceChildren();
    try {
      const result = analyse(document.getElementById('cues').value, document.getElementById('limit').value);
      document.getElementById('summary').textContent = result.rows.length + ' valid cues · ' + result.rows.filter(r => r.above).length + ' above your threshold · ' + result.errors.length + ' invalid blocks · counting ' + result.mode + '.';
      result.errors.forEach(message => { const li = document.createElement('li'); li.textContent = message; errorList.append(li); });
      result.rows.forEach(row => {
        const tr = document.createElement('tr');
        if (row.above) tr.className = 'above';
        [row.id, row.text, row.seconds.toFixed(2), String(row.characters), row.cps.toFixed(1), row.above ? 'Above' : 'Within'].forEach(value => {
          const td = document.createElement('td'); td.textContent = value; tr.append(td);
        });
        tbody.append(tr);
      });
    } catch (error) { document.getElementById('summary').textContent = error.message; }
  }
  function start() {
    document.getElementById('analyse').addEventListener('click', render);
    document.getElementById('example').addEventListener('click', () => { document.getElementById('cues').value = sample; render(); });
    document.getElementById('cues').value = sample;
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}());
