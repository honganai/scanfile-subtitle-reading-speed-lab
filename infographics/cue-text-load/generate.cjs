/* Original AI-assisted teaching graphic. MIT; see ../../LICENSE. */
const fs = require('node:fs');
const path = require('node:path');
const { analyse } = require('../../reading-speed.js');
const inputs = [
  ['Try again.', 'Versuche es noch einmal.'],
  ['Save the file.', 'Speichere die Datei.'],
  ['Done.', 'Fertig.'],
];
const duration = 2;
const measure = text => {
  const result = analyse(`1\n00:00:10,000 --> 00:00:12,000\n${text}`, 80);
  if (result.errors.length || result.rows.length !== 1 || result.mode !== 'graphemes') {
    throw new Error('An exact grapheme-counting runtime is required.');
  }
  const row = result.rows[0];
  return { text, graphemes: row.characters, duration_seconds: row.seconds, graphemes_per_second: row.cps };
};
const rows = inputs.map(([en, de]) => ({ en: measure(en), de: measure(de) }));
const data = {
  kind: 'synthetic_illustrative_text_not_a_benchmark_or_user_study',
  duration_seconds: duration,
  counting: 'Unicode grapheme clusters; spaces and punctuation included; these phrases contain no formatting markup.',
  limits: 'Selected English/German examples demonstrate arithmetic only, not typical language expansion, translation accuracy, a readability threshold or accessibility certification.',
  rows,
};
fs.writeFileSync(path.join(__dirname, 'measurements.json'), JSON.stringify(data, null, 2) + '\n');
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const t = (x,y,s,cls='body',extra='') => `<text x="${x}" y="${y}" class="${cls}" ${extra}>${esc(s)}</text>`;
const rect = (x,y,w,h,fill,rx=0,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" rx="${rx}" ${extra}/>`;
const teal='#087f8c', purple='#7043ad', ink='#17283b', pale='#f3f6f9';
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1760" viewBox="0 0 1200 1760" role="img" aria-labelledby="title desc">
<title id="title">Same two seconds, different text load</title><desc id="desc">Three synthetic English and German subtitle phrase pairs share a two-second cue. Grapheme counts and rates are shown with a common zero-based scale. No audience study, language-wide expansion ratio or universal speed limit is claimed.</desc>
<style>text{font-family:Arial,Helvetica,sans-serif;fill:${ink}}.eyebrow{font-size:20px;font-weight:700;letter-spacing:2px}.hero{font-size:70px;font-weight:750;letter-spacing:-2px}.lead{font-size:28px}.heading{font-size:29px;font-weight:700}.body{font-size:23px}.small{font-size:19px}.tiny{font-size:17px}.number{font-size:25px;font-weight:700}.white{fill:white}.muted{fill:#4b6075}.mono{font-family:monospace;font-size:24px}</style>
${rect(0,0,1200,1760,'#fff')}${rect(0,0,1200,350,ink)}
${t(64,59,'SUBTITLE WORKFLOW · SYNTHETIC EXAMPLES','eyebrow white')}
${t(64,151,'Same 2 seconds.','hero white')}${t(64,232,'Different text load.','hero white')}
${t(64,299,'Why a translated cue needs a fresh timing check','lead white')}
${rect(56,385,1088,170,pale,20)}${t(86,429,'EVERY EXAMPLE USES THE SAME CUE WINDOW','eyebrow')}
${t(86,477,'00:00:10,000','mono')}${t(615,477,'00:00:12,000','mono')}
<path d="M 300 469 H 585 M 574 461 L 585 469 L 574 477" fill="none" stroke="${teal}" stroke-width="3"/>
${t(86,521,'Text density = counted graphemes ÷ 2.0 seconds','body')}
${t(64,610,'Selected phrases — not a language-wide rule','heading')}
${rect(66,635,20,20,teal,4)}${t(98,653,'Illustrative English phrase','small')}
${rect(562,635,20,20,purple,4)}${t(594,653,'Illustrative German phrase','small')}`;
const left=570, scale=40, top=725, gap=171;
for(let i=0;i<rows.length;i++) {
  const y=top+i*gap;
  if(i%2===0) svg+=rect(56,y-38,1088,154,pale,12);
  svg+=t(83,y,rows[i].en.text,'body')+t(83,y+49,rows[i].de.text,'body');
  for(const [lang,offset,color] of [['en',-21,teal],['de',28,purple]]){
    const v=rows[i][lang];
    svg+=rect(left,y+offset,v.graphemes_per_second*scale,27,color,4);
    svg+=t(left+v.graphemes_per_second*scale+10,y+offset+21,v.graphemes_per_second.toFixed(1),'number');
  }
  svg+=t(83,y+87,`${rows[i].en.graphemes} → ${rows[i].de.graphemes} graphemes; duration stays 2.0 s`,'small');
}
const axisY=1197;
svg+=`<path d="M ${left} 687 V ${axisY} H 1050" fill="none" stroke="#90a2b4" stroke-width="1.5"/>`;
for(const n of [0,4,8,12])svg+=`<path d="M ${left+n*scale} ${axisY} v 9" stroke="#90a2b4"/>`+t(left+n*scale,axisY+32,n,'small','text-anchor="middle"');
svg+=t(810,1257,'Graphemes per second','small','text-anchor="middle"');
svg+=t(64,1315,'Keep the timing check separate from translation','heading');
const steps=[['1 · Translate','Keep a copy of the source.'],['2 · Recalculate','Check text against cue time.'],['3 · Watch the video','Check meaning, flow and sync.']];
for(let i=0;i<steps.length;i++){const x=64+i*363;svg+=rect(x,1340,345,102,pale,14)+t(x+17,1375,steps[i][0],'number')+t(x+17,1413,steps[i][1],'small');}
svg+=t(64,1480,'If a cue is too dense, edit the wording or re-time only where audio and context allow.','body');
svg+=t(64,1520,'Counts include spaces and punctuation. No universal reading-speed limit is shown.','small');
svg+=t(64,1550,'Toy text is not a viewer study, a translation-quality test or accessibility certification.','small');
svg+=`<path d="M 64 1582 H 1136" stroke="#cfdae4"/>`;
svg+=t(64,1613,'Method: existing open-source lab, Intl.Segmenter grapheme counts; reproducible JSON included.','tiny');
svg+=t(64,1640,'Background: w3.org/TR/webvtt1/ (cue timing) · unicode.org/reports/tr29/ (text segmentation)','tiny');
svg+=t(64,1677,'Scanfile workflow lab · AI-assisted original illustration · MIT license · scanfile.online','small');
svg+=t(64,1711,'No real user subtitles, borrowed artwork, performance claims or endorsement badges.','tiny');
svg+='</svg>\n';
fs.writeFileSync(path.join(__dirname, 'infographic.svg'), svg);
console.log(JSON.stringify(data));
