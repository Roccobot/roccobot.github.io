// Codice dell'AMMINISTRAZIONE di 'I Grandi di Arda' (dalla 15.64).
//
// Si scarica solo al primo ingresso nell'area admin: lo carica `caricaAdmin` dal segnaposto
// `openAdminGate` in `index.src.html`, e la pagina pubblicata lo riceve minificato come
// `admin.js` (lo genera la stessa Action di `index.html`). Si modifica QUESTO file.
//
// ⚠️ È uno script CLASSICO che condivide lo scope globale della pagina: le funzioni e le
// variabili di `index.src.html` si usano qui per nome, e le dichiarazioni di qui diventano
// globali a loro volta. L'ordine è quello in cui stavano nel sorgente unico, e i commenti
// sono rimasti attaccati alle loro funzioni.

// Nome della VARIANTE nei testi dell'admin. ⚠️ Per gli effetti in `FX_PTR` le due
// varianti non si dividono per dimensione dello schermo ma per presenza del
// puntatore: 'Desktop'/'Mobile' sarebbe un'approssimazione, ed è proprio quella che
// generava il fraintendimento (v14.23, scelta dell'utente). Le TAB del Pannello
// restano Desktop/Mobile, perché governano tutti gli effetti insieme.
function fxVarLabel(k, mob, it){
  if (FX_PTR[k]) return mob ? (it ? 'A tocco' : 'Touch') : (it ? 'Col mouse' : 'Pointer');
  return mob ? 'Mobile' : 'Desktop';
}
// Elenco in italiano corrente: 'A', 'A e B', 'A, B e C' (l'inglese si accontenta
// delle virgole, come già fa il resto dei testi admin). Apici DRITTI, come da
// convenzione tipografica del progetto.
function fxListaIt(a){
  var q = a.map(function(s){ return "'" + s + "'"; });
  if (q.length < 2) return q[0];
  return q.slice(0, -1).join(', ') + ' e ' + q[q.length - 1];
}
// Equivalente in JS della riscrittura OKLCH qui sopra: serve SOLO a comporre il
// fondo di riferimento per l'AA del testo della pill nell'anteprima (la resa la fa
// il CSS, con la stringa di fxHovBg, così non possono divergere). Matrici OKLab
// standard: sRGB→lineare→LMS→cubica→OKLab, si scala L e la cromia, e ritorno.
function ccOklchAdjust(triplet, lum, sat){
  var v = String(triplet).split(',').map(function(x){ return Math.min(255, Math.max(0, +x)) / 255; });
  var lin = v.map(function(c){ return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
  var cb = function(x){ return Math.cbrt(x); };
  var l_ = cb(0.4122214708 * lin[0] + 0.5363325363 * lin[1] + 0.0514459929 * lin[2]);
  var m_ = cb(0.2119034982 * lin[0] + 0.6806995451 * lin[1] + 0.1073969566 * lin[2]);
  var s_ = cb(0.0883024619 * lin[0] + 0.2817188376 * lin[1] + 0.6299787005 * lin[2]);
  var L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  var A = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  var B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  L = Math.max(0, L * lum); A *= sat; B *= sat;   // L × luminosità, cromia × saturazione
  var l2 = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3);
  var m2 = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3);
  var s2 = Math.pow(L - 0.0894841775 * A - 1.2914855480 * B, 3);
  var out = [ 4.0767416621 * l2 - 3.3077115913 * m2 + 0.2309699292 * s2,
             -1.2684380046 * l2 + 2.6097574011 * m2 - 0.3413193965 * s2,
             -0.0041960863 * l2 - 0.7034186147 * m2 + 1.7076147010 * s2 ];
  return out.map(function(c){
    c = Math.min(1, Math.max(0, c));
    c = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return Math.round(c * 255);
  }).join(',');
}
function ccDerivePair(base) {
  var a = ccHexToHsl(base);
  return { dark: ccHslToHex(a[0], Math.min(1,a[1]), 0.62), light: ccHslToHex(a[0], Math.min(1,a[1]*1.05), 0.42) };
}
// Ri-inietta le sole terne --ccrgb per famiglia (dopo un edit colori in anteprima).
function reinjectFamilyColors(){
  var old = document.getElementById('cc-fam-vars'); if (old) old.remove();
  var css = [];
  Object.keys(CARDCOLORS.fam).forEach(function(k){
    var f = CARDCOLORS.fam[k] || {};
    css.push('.cc-' + k + '{--ccrgb:' + ccHexToTriplet(f.dark) + '}');
    css.push('html[data-theme="light"] .cc-' + k + '{--ccrgb:' + ccHexToTriplet(f.light) + '}');
  });
  var s = document.createElement('style'); s.id = 'cc-fam-vars'; s.textContent = css.join('');
  document.head.appendChild(s);
}
// Nomi 'normalizzati' delle classi-etichetta (type-*), usati nelle Statistiche
// (drill-down) al posto della classe grezza. Bilingue. Fallback: classe senza 'type-'.
var TYPE_LABEL = {
  it: { 'type-ainu':'Ainur', 'type-vala':'Valar', 'type-valie':'Valier', 'type-maia':'Maiar', 'type-darkmaia':'Maiar decaduti', 'type-morgoth':'Vala decaduto', 'type-balrog':'Balrog', 'type-noldo':'Elfi Noldor', 'type-vanya':'Elfi Vanyar', 'type-teler':'Elfi Teleri', 'type-falma':'Elfi Falmari', 'type-sinda':'Elfi Sindar', 'type-half-elf':'Mezzelfi', 'type-dunadan':'Dúnedain', 'type-numenorean':'Númenóreani', 'type-hador':'Casa di Hador', 'type-beor':'Casa di Bëor', 'type-haleth':'Casa di Haleth', 'type-rohir':'Rohirrim', 'type-northman':'Uomini del Nord', 'type-eotheod':'Éothéod', 'type-hobbit':'Hobbit', 'type-dwarf':'Nani', 'type-dragon':'Draghi', 'type-wolf':'Lupi', 'type-spider':'Ragni', 'type-shadow':'Creature dell\'Ombra', 'type-mystery':'Creature ignote', 'type-spirit':'Esseri arcani', 'type-ent':'Ent', 'type-eagle':'Grandi Aquile', 'type-beast':'Animali', 'type-orc':'Orchi', 'type-troll':'Troll', 'type-fallback':'Altro' },
  en: { 'type-ainu':'Ainur', 'type-vala':'Valar', 'type-valie':'Valier', 'type-maia':'Maiar', 'type-darkmaia':'Fallen Maiar', 'type-morgoth':'Fallen Vala', 'type-balrog':'Balrogs', 'type-noldo':'Noldor Elves', 'type-vanya':'Vanyar Elves', 'type-teler':'Teleri Elves', 'type-falma':'Falmari Elves', 'type-sinda':'Sindar Elves', 'type-half-elf':'Half-elven', 'type-dunadan':'Dúnedain', 'type-numenorean':'Númenóreans', 'type-hador':'House of Hador', 'type-beor':'House of Bëor', 'type-haleth':'House of Haleth', 'type-rohir':'Rohirrim', 'type-northman':'Northmen', 'type-eotheod':'Éothéod', 'type-hobbit':'Hobbits', 'type-dwarf':'Dwarves', 'type-dragon':'Dragons', 'type-wolf':'Wolves', 'type-spider':'Spiders', 'type-shadow':'Shadow creatures', 'type-mystery':'Unknown creatures', 'type-spirit':'Arcane beings', 'type-ent':'Ents', 'type-eagle':'Great Eagles', 'type-beast':'Animals', 'type-orc':'Orcs', 'type-troll':'Trolls', 'type-fallback':'Others' }
};
function exitReorder() {
  reorderMode = false;
  renderList();
  enableDragDrop();
  refreshControlPanel();
}
// Modale del numero di versione: due tasti sovrapposti. Sopra: Riordina
// (o 'Fine modifica ordine' se già in riordino). Sotto: Modifica contenuti.
function showActionChoiceModal() {
  if (document.getElementById('fab-modal')) return;
  var T = CTRL_I18N[currentLang];
  var overlay = document.createElement('div');
  overlay.id = 'fab-modal'; overlay.className = 'fab-modal-overlay';
  var box = document.createElement('div'); box.className = 'fab-modal-box';
  overlay.appendChild(box); document.body.appendChild(overlay);
  lockPageScroll(true); // blocca lo scroll del contenuto sotto
  function dismiss(){ fabDismiss(overlay); lockPageScroll(false); }
  langRefresh = function(){ if (!document.body.contains(overlay)) { langRefresh = null; return; } overlay.remove(); langRefresh = null; showActionChoiceModal(); };
  overlay.addEventListener('click', function(e){ if (e.target === overlay) dismiss(); });
  function mkClose(){ var cl = document.createElement('button'); cl.className = 'fab-modal-close'; cl.textContent = '×'; cl.onclick = dismiss; return cl; }
  function mkBtn(main, sub, extra, fn){
    var b = document.createElement('button');
    b.className = 'fab-modal-confirm' + (extra ? (' ' + extra) : '');
    // ⚠️ `appendiA` e non `replaceChildren`: questo scrive `null` come testo, quello lo salta.
    appendiA(b, [nodo('span', { 'class': 'fmc-main' }, main), sub ? nodo('span', { 'class': 'fmc-sub' }, sub) : null]);
    b.onclick = fn; return b;
  }
  function viewMain(){
    box.replaceChildren(); box.appendChild(mkClose());
    if (reorderMode) {
      // In riordino: tasto 'in sospeso' -> apre il trivio Conferma/Chiudi/Scarta
      box.appendChild(mkBtn(T.reorderExit, '', 'is-pending', viewConfirm));
    } else {
      box.appendChild(mkBtn(T.reorder, '', '', function(){
        dismiss();
        if (saveUnlocked) enterReorder();
        else showPasswordModal('Inserisci la parola d\'ordine per riordinare le card.', enterReorder);
      }));
    }
    box.appendChild(mkBtn(T.editContent, '', '', function(){
      dismiss();
      openAdminGate();
    }));
  }
  function viewConfirm(){
    box.replaceChildren(); box.appendChild(mkClose());
    // Conferma: commit permanente (doSave esce dal riordino al successo).
    box.appendChild(mkBtn(T.confirm, T.confirmSub, 'is-primary', function(){ dismiss(); doSave(); }));
    // Chiudi: tiene le modifiche come bozza locale (localStorage) ed esce dal riordino.
    box.appendChild(mkBtn(T.keep, T.keepSub, '', function(){ dismiss(); saveLocalDraft(); exitReorder(); }));
    // Scarta: svuota la bozza locale e ripristina l'ordine del server (snapshot HTML).
    box.appendChild(mkBtn(T.discard, T.discardSub, 'is-danger', function(){ dismiss(); restoreServerOrder(); exitReorder(); }));
  }
  viewMain();
}

// Traduzione IT↔EN tramite il Worker (che chiama Claude lato server).
// Ritorna la stringa tradotta, oppure null in caso di errore.
async function translateText(text, from, to) {
  if (!text || !text.trim()) return '';
  if (!adminPassword) return null;
  try {
    const res = await fetch(proxyUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'translate', password: adminPassword, text: text, from: from, to: to })
    });
    let r = {};
    try { r = await res.json(); } catch (e) {}
    if (res.ok && r.ok && typeof r.text === 'string') return r.text;
    return null;
  } catch (err) {
    return null;
  }
}

// Modale per campo bilingue dimenticato (un lato compilato, l'altro VUOTO). Ritorna una Promise
// che si risolve col testo digitato (eventualmente vuoto) alla conferma.
function showFieldGapModal(charName, fieldLabel, lang) {
  return new Promise(function(resolve){
    var ov = document.createElement('div');
    ov.className = 'fab-modal-overlay';
    var box = document.createElement('div');
    box.className = 'fab-modal-box';
    var h = document.createElement('div');
    h.className = 'fab-modal-charname';
    h.textContent = charName;
    var p = document.createElement('p');
    p.textContent = 'Specifica il contenuto di ' + fieldLabel + ' in ' + lang + ', o lascialo vuoto.';
    var inp = document.createElement('input');
    inp.type = 'text'; inp.value = '';
    var btn = document.createElement('button');
    btn.className = 'fab-modal-confirm is-primary'; btn.textContent = 'Conferma';
    function done(){ var v = inp.value; fabDismiss(ov); resolve(v); }
    btn.onclick = done;
    inp.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); done(); } });
    box.appendChild(h); box.appendChild(p); box.appendChild(inp); box.appendChild(btn);
    ov.appendChild(box);
    document.body.appendChild(ov);
    setTimeout(function(){ inp.focus(); }, 50);
  });
}

function showAdminEditor() {
  // Guardia singleton: mai due editor sovrapposti (gli id dei campi sono
  // per-indice: un secondo overlay li duplicherebbe e il salvataggio
  // leggerebbe i valori del primo, committando testi vecchi in silenzio).
  if (document.querySelector('.admin-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'admin-overlay';
  document.documentElement.classList.add('admin-open');

  const header = document.createElement('div');
  header.className = 'admin-header';
  const title = document.createElement('div');
  title.className = 'admin-title';
  title.textContent = 'Admin - Modifica testi';
  const btnWrap = document.createElement('div');
  btnWrap.className = 'admin-btn-wrap';
  const backBtn = document.createElement('button');
  backBtn.className = 'admin-btn admin-btn-back';
  backBtn.textContent = 'Indietro';
  backBtn.onclick = () => {
    // Con modifiche non salvate (indicatore arancio acceso) chiede conferma.
    if (overlay.querySelector('.admin-modified') &&
        !window.confirm('Ci sono modifiche non salvate: uscire senza salvare?')) return;
    overlay.remove();
    document.documentElement.classList.remove('admin-open');
  };
  const BILINGUAL = [
    { it:'tipo',        en:'tipo_en',        li:'Tipo IT',        le:'Tipo EN' },
    { it:'info',        en:'info_en',        li:'Info IT',        le:'Info EN' },
    { it:'descrizione', en:'descrizione_en', li:'Descrizione IT', le:'Descrizione EN', ta:8 },
    { it:'citazione',   en:'citazione_en',   li:'Citazione IT',   le:'Citazione EN', ta:3 },
    { it:'fonte',       en:'fonte_en',       li:'Fonte IT',       le:'Fonte EN' },
  ];
  const originals = dati.map(p => {
    const s = { nome: p.nome || '' };
    BILINGUAL.forEach(({ it, en }) => { s[it] = p[it] || ''; s[en] = p[en] || ''; });
    return s;
  });
  const saveBtn = document.createElement('button');
  saveBtn.className = 'admin-btn admin-btn-save';
  saveBtn.textContent = 'Salva';
  saveBtn.onclick = async () => {
    saveBtn.disabled = true;
    // Prima di leggere i campi, forza il build di TUTTE le card: col rendering
    // incrementale fermo (tab in background) le card mancanti farebbero
    // ripiegare g() sui valori vecchi e scarterebbero il digitato nei gap.
    renderUpTo(dati.length);
    const g = (i, f) => { const el = document.getElementById('ae-' + i + '-' + f); return el ? el.value : (dati[i][f] || ''); };
    const setVal = (i, f, v) => { const el = document.getElementById('ae-' + i + '-' + f); if (el) el.value = v; };
    // Coppie bilingui (nome incluso). I nomi identici vanno scritti in entrambi i
    // campi: il nome ha trattamento speciale alla conferma vuota (copia identica).
    const PAIRS = [{ it: 'nome', en: 'nome_en', label: 'Nome', isName: true }]
      .concat(BILINGUAL.map(function(f){ return { it: f.it, en: f.en, label: (f.li || f.it).replace(/ IT$/, '') }; }))
      .concat([{ it: 'nomi_alternativi', en: 'nomi_alternativi_en', label: 'Nomi alternativi' },
               { it: 'appellativi', en: 'appellativi_en', label: 'Titoli e onorificenze' }]);
    // Campi "dimenticati": un lato compilato e l'altro COMPLETAMENTE VUOTO.
    // (Storico: fino a v10.13.5 si considerava "vuoto" ogni lato ≤3 caratteri,
    // ma questo dava falsi positivi su traduzioni corte valide come Elf/Orc/Man
    // (12 occorrenze), col rischio di cancellarle confermando vuoto. Ora il
    // gap scatta solo se un lato è vuoto: il lato 'miss' è sempre quello vuoto,
    // quindi nessun dato valido può essere cancellato.) La traduzione automatica
    // al salvataggio è stata rimossa: ora si chiede conferma (vedi
    // FEATURES.adminTranslate per il tasto 'Traduci' manuale, oggi spento).
    const gaps = [];
    dati.forEach(function(p, i){
      PAIRS.forEach(function(pair){
        const itV = g(i, pair.it).trim(), enV = g(i, pair.en).trim();
        if (itV.length > 0 && enV.length === 0)      gaps.push({ i: i, miss: pair.en, src: pair.it, lang: 'inglese',  label: pair.label, isName: pair.isName });
        else if (enV.length > 0 && itV.length === 0) gaps.push({ i: i, miss: pair.it, src: pair.en, lang: 'italiano', label: pair.label, isName: pair.isName });
      });
    });
    // Una modale di conferma per occorrenza, in sequenza. Testo digitato → nel
    // campo tale e quale. Vuoto: sul nome copia identica dalla controparte, su
    // tutto il resto resta vuoto (invariato).
    for (const gp of gaps) {
      const charName = (g(gp.i, 'nome') || g(gp.i, 'nome_en') || ('#' + (gp.i + 1))).trim();
      const typed = await showFieldGapModal(charName, gp.label, gp.lang);
      // Se nel frattempo l'editor è stato chiuso (Indietro), NIENTE commit:
      // senza questo guard partiva un salvataggio spurio (+bump versione).
      if (!overlay.isConnected) return;
      if (typed && typed.trim()) setVal(gp.i, gp.miss, typed);
      else if (gp.isName)        setVal(gp.i, gp.miss, g(gp.i, gp.src));
      else                       setVal(gp.i, gp.miss, '');
    }
    if (!overlay.isConnected) return;
    // Si lavora su una COPIA profonda: `dati` non viene toccato finché il
    // commit non è andato a buon fine. Così, se il salvataggio fallisce, lo
    // stato in memoria resta coerente con quello su GitHub (niente modifiche
    // perse in silenzio).
    const next = JSON.parse(JSON.stringify(dati));
    next.forEach((p, i) => {
      p.nome = g(i, 'nome'); p.nome_en = g(i, 'nome_en');
      p.tipo = g(i, 'tipo'); p.tipo_en = g(i, 'tipo_en');
      p.info = g(i, 'info'); p.info_en = g(i, 'info_en');
      p.padre = g(i, 'padre'); p.madre = g(i, 'madre');
      p.nomi_alternativi = g(i, 'nomi_alternativi'); p.nomi_alternativi_en = g(i, 'nomi_alternativi_en');
      p.appellativi = g(i, 'appellativi'); p.appellativi_en = g(i, 'appellativi_en');
      p.descrizione = g(i, 'descrizione'); p.descrizione_en = g(i, 'descrizione_en');
      p.citazione = g(i, 'citazione'); p.citazione_en = g(i, 'citazione_en');
      p.fonte = g(i, 'fonte'); p.fonte_en = g(i, 'fonte_en');
      ICON_ORDER.forEach(function(k) {
        if (k === 'morgoth' || k === 'king_high_now') return; // nessuna checkbox: valore PRESERVATO (Morgoth su Fingolfin, Re 'in carica' su Finarfin)
        const chkEl = document.getElementById('ae-' + i + '-flag-' + k);
        // Preserva il valore speciale 'presunto' (non impostabile da UI):
        // la checkbox lo mantiene se resta spuntata, lo rimuove se deselezionata.
        if (chkEl) { if (chkEl.checked) p[k] = (p[k] === 'presunto' ? 'presunto' : true); else delete p[k]; }
      });
      // catalogo esteso «Apocrifi»: preserva un'eventuale stringa-fonte ('HoME'/'NoME'), altrimenti true/assente
      const apoChkEl = document.getElementById('ae-' + i + '-apocrifo');
      if (apoChkEl) { if (apoChkEl.checked) p.apocrifo = (typeof p.apocrifo === 'string' ? p.apocrifo : true); else delete p.apocrifo; }
    });
    saveBtn.textContent = 'Salvataggio...';
    const res = await doCommit('admin: modifica testi personaggi', next);
    if (res.ok) {
      // Solo ora applichiamo le modifiche all'array globale (in place, così i
      // riferimenti esistenti restano validi).
      dati.length = 0;
      next.forEach(function(p){ dati.push(p); });
      saveBtn.textContent = 'Salvato ✓';
      setTimeout(() => { overlay.remove(); document.documentElement.classList.remove('admin-open'); renderList(); }, 700);
    } else {
      var why = (res.reason || 'errore').substring(0, 40);
      saveBtn.textContent = '✗ ' + why;
      showToast('✗ Salvataggio fallito: ' + (res.reason || 'errore sconosciuto'), true);
      saveBtn.disabled = false;
      setTimeout(() => { saveBtn.textContent = 'Salva'; }, 4000);
    }
  };
  const findBtn = document.createElement('button');
  findBtn.className = 'admin-btn admin-btn-find';
  findBtn.textContent = 'Trova';
  findBtn.title = 'Trova nel contenuto (⌘F)';
  findBtn.onclick = function(){ openSearch(); };
  btnWrap.appendChild(findBtn);
  btnWrap.appendChild(backBtn);
  btnWrap.appendChild(saveBtn);
  var loadingEl = document.createElement('span');
  loadingEl.className = 'admin-loading';
  title.appendChild(loadingEl);
  header.appendChild(title);
  header.appendChild(btnWrap);
  overlay.appendChild(header);

  const FLAG_IT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#CE2B37" d="M36 27c0 2.209-1.791 4-4 4h-8V5h8c2.209 0 4 1.791 4 4v18z"/><path fill="#009246" d="M4 5C1.791 5 0 6.791 0 9v18c0 2.209 1.791 4 4 4h8V5H4z"/><path fill="#EEE" d="M12 5h12v26H12z"/></svg>';
  const FLAG_EN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#00247D" d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"/><path fill="#CF1B2B" d="M25.14 23l9.712 6.801c.471-.479.808-1.082.99-1.749L28.627 23H25.14zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943V23zm10-10h2.141l9.711-6.8c-.521-.53-1.188-.909-1.937-1.085L23 12.057V13zm-12.141 0L1.148 6.2C.677 6.68.34 7.282.157 7.949L7.372 13h3.487z"/><path fill="#EEE" d="M36 21H21v10h2v-5.836L31.335 31H32c1.117 0 2.126-.461 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36v-2zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21H0zM36 9c0-1.091-.439-2.078-1.148-2.8L25.141 13H23v-.943l9.915-6.942C32.62 5.046 32.316 5 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059V9zM13 5v5.837L4.664 5H4c-1.118 0-2.126.461-2.852 1.2l9.711 6.8H7.372L.157 7.949C.065 8.286 0 8.634 0 9v.059L5.628 13H0v2h15V5h-2z"/><path fill="#CF1B2B" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z"/></svg>';

  const mkInp = (i, key, ta) => {
    let el;
    if (ta) { el = document.createElement('textarea'); el.className = 'admin-textarea'; el.rows = typeof ta === 'number' ? ta : 3; }
    else     { el = document.createElement('input');    el.type = 'text'; el.className = 'admin-input'; }
    el.id = 'ae-' + i + '-' + key;
    return el;
  };
  const mkField = (i, key, label, p, extraClass, labelClass) => {
    const w = document.createElement('div');
    w.className = 'admin-field' + (extraClass ? ' ' + extraClass : '');
    const l = document.createElement('label');
    l.className = 'admin-label' + (labelClass ? ' ' + labelClass : '');
    l.textContent = label; l.htmlFor = 'ae-' + i + '-' + key;
    const inp = mkInp(i, key, false);
    inp.value = p[key] || '';
    w.appendChild(l); w.appendChild(inp); return w;
  };

  // Pulsante "Traduci" per coppia bilingue (traduzione supervisionata).
  // Sorgente = lato non vuoto (IT prioritario se entrambi pieni); riempie l'altro.
  const mkTransBtn = (i, itKey, enKey) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'admin-trans-btn'; b.textContent = '⇄ Traduci';
    b.title = 'Traduci IT↔EN con Claude';
    b.onclick = async () => {
      const itEl = document.getElementById('ae-' + i + '-' + itKey);
      const enEl = document.getElementById('ae-' + i + '-' + enKey);
      if (!itEl || !enEl) return;
      const itV = itEl.value.trim(), enV = enEl.value.trim();
      let from, to, src, dstEl;
      if (enV && !itV) { from = 'en'; to = 'it'; src = enEl.value; dstEl = itEl; }
      else if (itV)    { from = 'it'; to = 'en'; src = itEl.value; dstEl = enEl; }
      else return; // entrambi vuoti
      const old = b.textContent; b.disabled = true; b.textContent = '...';
      const tr = await translateText(src, from, to);
      b.disabled = false; b.textContent = old;
      if (tr != null) dstEl.value = tr;
      else showToast('✗ Traduzione non riuscita', true);
    };
    return b;
  };

  const cards = document.createElement('div');
  cards.className = 'admin-cards';

  function buildCard(p, i) {
    const card = document.createElement('div');
    card.className = 'admin-card'; card.dataset.idx = i;

    // Numero
    const num = document.createElement('div');
    num.className = 'admin-rank-num'; num.textContent = i + 1;
    card.appendChild(num);

    // Riga nome: due campi bilingui (Nome IT | Nome EN), pre-compilati con
    // p.nome / p.nome_en. La bandiera affianca il rispettivo campo (IT a sx,
    // EN a dx). Quando i due nomi divergono (es. Faggiosso/Beechbone,
    // Baccador/Goldberry) qui si impostano entrambi i lati.
    const nameRow = document.createElement('div');
    nameRow.className = 'admin-bilingual-grid admin-name-row';
    // colonna IT
    const nameItWrap = document.createElement('div'); nameItWrap.className = 'admin-field';
    const nameItLbl = document.createElement('label');
    nameItLbl.className = 'admin-label'; nameItLbl.textContent = 'Nome'; nameItLbl.htmlFor = 'ae-' + i + '-nome';
    const nameItField = document.createElement('div'); nameItField.className = 'admin-name-field';
    const fIt = document.createElement('div'); fIt.className = 'admin-flag'; fIt.appendChild(svgNodo(FLAG_IT));
    const nameItInp = mkInp(i, 'nome', false);
    nameItInp.className += ' admin-name-input'; nameItInp.value = p.nome || '';
    nameItField.appendChild(fIt); nameItField.appendChild(nameItInp);
    nameItWrap.appendChild(nameItLbl); nameItWrap.appendChild(nameItField);
    // colonna EN
    const nameEnWrap = document.createElement('div'); nameEnWrap.className = 'admin-field';
    const nameEnLbl = document.createElement('label');
    nameEnLbl.className = 'admin-label admin-label-en'; nameEnLbl.textContent = 'Nome EN'; nameEnLbl.htmlFor = 'ae-' + i + '-nome_en';
    const nameEnField = document.createElement('div'); nameEnField.className = 'admin-name-field';
    const nameEnInp = mkInp(i, 'nome_en', false);
    nameEnInp.className += ' admin-name-input'; nameEnInp.value = p.nome_en || '';
    const fEn = document.createElement('div'); fEn.className = 'admin-flag'; fEn.appendChild(svgNodo(FLAG_EN));
    nameEnField.appendChild(nameEnInp); nameEnField.appendChild(fEn);
    nameEnWrap.appendChild(nameEnLbl); nameEnWrap.appendChild(nameEnField);
    nameRow.appendChild(nameItWrap); nameRow.appendChild(nameEnWrap);
    card.appendChild(nameRow);

    // Nomi alternativi: subito dopo il nome, colonne IT (sx) | EN (dx)
    const altGrid = document.createElement('div');
    altGrid.className = 'admin-bilingual-grid';
    const altItWrap = document.createElement('div'); altItWrap.className = 'admin-field';
    const altItLbl = document.createElement('label'); altItLbl.className = 'admin-label'; altItLbl.textContent = 'Nomi alternativi IT  (Nome* = grassetto)'; altItLbl.htmlFor = 'ae-' + i + '-nomi_alternativi';
    const altItInp = mkInp(i, 'nomi_alternativi', false); altItInp.value = p.nomi_alternativi || '';
    altItWrap.appendChild(altItLbl); altItWrap.appendChild(altItInp);
    const altEnWrap = document.createElement('div'); altEnWrap.className = 'admin-field';
    const altEnLbl = document.createElement('label'); altEnLbl.className = 'admin-label admin-label-en'; altEnLbl.textContent = 'Nomi alternativi EN'; altEnLbl.htmlFor = 'ae-' + i + '-nomi_alternativi_en';
    const altEnInp = mkInp(i, 'nomi_alternativi_en', false); altEnInp.value = p.nomi_alternativi_en || '';
    altEnWrap.appendChild(altEnLbl); altEnWrap.appendChild(altEnInp);
    if (FEATURES.adminTranslate) altEnWrap.appendChild(mkTransBtn(i, 'nomi_alternativi', 'nomi_alternativi_en'));
    altGrid.appendChild(altItWrap); altGrid.appendChild(altEnWrap);
    card.appendChild(altGrid);

    // Titoli e onorificenze (ex 'Appellativi'): subito sotto i nomi alternativi,
    // colonne IT (sx) | EN (dx). Spostato qui (e rinominato) per tenere insieme
    // la coppia 'nomi ↔ titoli' della riga sotto il nome nella card.
    const titGrid = document.createElement('div');
    titGrid.className = 'admin-bilingual-grid';
    const titItWrap = document.createElement('div'); titItWrap.className = 'admin-field';
    const titItLbl = document.createElement('label'); titItLbl.className = 'admin-label'; titItLbl.textContent = 'Titoli e onorificenze IT'; titItLbl.htmlFor = 'ae-' + i + '-appellativi';
    const titItInp = mkInp(i, 'appellativi', false); titItInp.value = p.appellativi || '';
    titItWrap.appendChild(titItLbl); titItWrap.appendChild(titItInp);
    const titEnWrap = document.createElement('div'); titEnWrap.className = 'admin-field';
    const titEnLbl = document.createElement('label'); titEnLbl.className = 'admin-label admin-label-en'; titEnLbl.textContent = 'Titoli e onorificenze EN'; titEnLbl.htmlFor = 'ae-' + i + '-appellativi_en';
    const titEnInp = mkInp(i, 'appellativi_en', false); titEnInp.value = p.appellativi_en || '';
    titEnWrap.appendChild(titEnLbl); titEnWrap.appendChild(titEnInp);
    if (FEATURES.adminTranslate) titEnWrap.appendChild(mkTransBtn(i, 'appellativi', 'appellativi_en'));
    titGrid.appendChild(titItWrap); titGrid.appendChild(titEnWrap);
    card.appendChild(titGrid);

    // Griglia bilingue: colonna IT (sx) | colonna EN (dx)
    const biGrid = document.createElement('div');
    biGrid.className = 'admin-bilingual-grid';
    BILINGUAL.forEach(f => {
      const itWrap = document.createElement('div'); itWrap.className = 'admin-field';
      const itLbl = document.createElement('label'); itLbl.className = 'admin-label'; itLbl.textContent = f.li; itLbl.htmlFor = 'ae-' + i + '-' + f.it;
      const itInp = mkInp(i, f.it, f.ta); itInp.value = p[f.it] || '';
      itWrap.appendChild(itLbl); itWrap.appendChild(itInp);

      const enWrap = document.createElement('div'); enWrap.className = 'admin-field';
      const enLbl = document.createElement('label'); enLbl.className = 'admin-label admin-label-en'; enLbl.textContent = f.le; enLbl.htmlFor = 'ae-' + i + '-' + f.en;
      const enInp = mkInp(i, f.en, f.ta); enInp.value = p[f.en] || '';
      enWrap.appendChild(enLbl); enWrap.appendChild(enInp);
      if (FEATURES.adminTranslate) enWrap.appendChild(mkTransBtn(i, f.it, f.en));

      biGrid.appendChild(itWrap); biGrid.appendChild(enWrap);
    });
    card.appendChild(biGrid);

    // Campi mono: padre + madre affiancati
    const monoGrid = document.createElement('div');
    monoGrid.className = 'admin-mono-grid';
    monoGrid.appendChild(mkField(i, 'padre', 'Padre', p));
    monoGrid.appendChild(mkField(i, 'madre', 'Madre', p));
    card.appendChild(monoGrid);

    // Flag checkboxes row
    const flagsRow = document.createElement('div');
    flagsRow.className = 'admin-flags-row';
    ICON_ORDER.forEach(function(k) {
      if (k === 'morgoth') return; // easter egg (solo Fingolfin): non esposto nell'editor admin
      if (k === 'king_high_now') return; // Re 'in carica' (Finarfin): come Morgoth, solo card. Il valore è PRESERVATO al salvataggio (checkbox assente)
      const lbl = document.createElement('label');
      lbl.className = 'admin-flag-chk';
      // Solo icone: il nome dell'indicatore resta accessibile via title (hover/long-press)
      lbl.title = (ICON_LABEL.it[k] || k) + ' / ' + (ICON_LABEL.en[k] || k);
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.id = 'ae-' + i + '-flag-' + k;
      chk.checked = !!p[k];
      const iconEl = document.createElement('span');
      iconEl.replaceChildren(htmlCostante(BADGE_ICON[k].split('%L%').join('')));
      lbl.appendChild(chk); lbl.appendChild(iconEl);
      flagsRow.appendChild(lbl);
    });
    // Catalogo esteso «Apocrifi» (personaggio attestato solo in HoME/NoME):
    // dentro la griglia dei flag, nei DUE spazi a destra della seconda riga
    // (dalla v7.29, liberati togliendo il Re 'in carica' king_high_now dai
    // badge admin; vedi CSS .admin-apo-chk, grid-column 11/13).
    const apoRow = document.createElement('label');
    apoRow.className = 'admin-flag-chk admin-apo-chk';
    apoRow.title = 'Fonte apocrifa: personaggio attestato solo nella HoME/NoME';
    const apoChk = document.createElement('input');
    apoChk.type = 'checkbox';
    apoChk.id = 'ae-' + i + '-apocrifo';
    apoChk.checked = !!p.apocrifo;
    const apoTxt = document.createElement('span');
    apoTxt.textContent = 'Apocrifo';
    apoRow.appendChild(apoChk); apoRow.appendChild(apoTxt);
    flagsRow.appendChild(apoRow);
    card.appendChild(flagsRow);

    // Indicatore 'campo modificato nella sessione': ogni input/textarea memorizza
    // il valore di partenza (dataset.orig) e, a ogni digitazione, accende/spegne
    // '.admin-modified' sul wrapper se differisce. Cablato qui, per-card, così
    // resta valido col rendering a batch (non c'è più un giro globale a fine build).
    Array.prototype.slice.call(card.querySelectorAll('.admin-input, .admin-textarea')).forEach(function(el){
      el.dataset.orig = el.value;
      el.addEventListener('input', function(){
        var wrap = el.closest('.admin-field');
        if (wrap) wrap.classList.toggle('admin-modified', el.value !== el.dataset.orig);
      });
    });
    return card;
  }
  overlay.appendChild(cards);

  // ── Rendering incrementale ──────────────────────────────────────────────
  // Le ~300 card sono pesanti: costruirle tutte insieme bloccava la pagina.
  // Le costruiamo a batch via requestAnimationFrame: overlay/header e le prime
  // voci sono subito interattivi, il resto si riempie senza freeze.
  // ensureRendered(i) forza il build fino all'indice i (serve al salto da
  // ricerca verso una voce non ancora renderizzata).
  var renderedCount = 0;
  function updateLoading() {
    if (!loadingEl) return;
    if (renderedCount >= dati.length) { loadingEl.remove(); loadingEl = null; }
    else loadingEl.textContent = 'Caricamento... ' + renderedCount + '/' + dati.length;
  }
  function renderUpTo(target) {
    target = Math.min(target, dati.length);
    var frag = document.createDocumentFragment();
    while (renderedCount < target) { frag.appendChild(buildCard(dati[renderedCount], renderedCount)); renderedCount++; }
    cards.appendChild(frag);
    updateLoading();
  }
  function ensureRendered(i) { if (i >= renderedCount) renderUpTo(i + 1); }
  var RENDER_BATCH = 12;
  (function renderTick() {
    if (!overlay.isConnected && renderedCount > 0) return; // editor chiuso: stop, niente CPU sprecata
    renderUpTo(renderedCount + RENDER_BATCH);
    if (renderedCount < dati.length) requestAnimationFrame(renderTick);
  })();

  // Navigazione rapida (solo mobile): salta al personaggio precedente/successivo o di ±10.
  // Scorrere a mano una pagina così lunga è scomodo, questi tasti flottanti la rendono navigabile.
  const CHEV_UP   = '<svg viewBox="0 0 24 24"><polyline points="6 15 12 9 18 15"/></svg>';
  const CHEV_DN   = '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>';
  const CHEV2_UP  = '<svg viewBox="0 0 24 24"><polyline points="6 13 12 7 18 13"/><polyline points="6 18 12 12 18 18"/></svg>';
  const CHEV2_DN  = '<svg viewBox="0 0 24 24"><polyline points="6 6 12 12 18 6"/><polyline points="6 11 12 17 18 11"/></svg>';
  const headerOffset = () => (header.offsetHeight || 60) + 12;
  const cardEls = () => Array.prototype.slice.call(cards.querySelectorAll('.admin-card'));
  const currentCardIndex = () => {
    const cs = cardEls();
    const top = overlay.scrollTop + headerOffset() + 4;
    let idx = 0;
    for (let j = 0; j < cs.length; j++) { if (cs[j].offsetTop <= top) idx = j; else break; }
    return idx;
  };
  const goToCard = (idx) => {
    const cs = cardEls();
    idx = Math.max(0, Math.min(cs.length - 1, idx));
    overlay.scrollTo({ top: Math.max(0, cs[idx].offsetTop - headerOffset()), behavior: 'smooth' });
  };
  const nav = document.createElement('div');
  nav.className = 'admin-nav';
  const mkNav = (svg, delta, label) => {
    const b = document.createElement('button');
    b.className = 'admin-nav-btn'; b.appendChild(svgNodo(svg));
    b.title = label; b.setAttribute('aria-label', label);
    b.onclick = () => goToCard(currentCardIndex() + delta);
    return b;
  };
  nav.appendChild(mkNav(CHEV2_UP, -10, 'Indietro di 10'));
  nav.appendChild(mkNav(CHEV_UP,   -1, 'Personaggio precedente'));
  nav.appendChild(mkNav(CHEV_DN,    1, 'Personaggio successivo'));
  nav.appendChild(mkNav(CHEV2_DN,  10, 'Avanti di 10'));
  overlay.appendChild(nav);

  // ── Ricerca tipo Spotlight (override ⌘F apre, ⌘G / ⌘⇧G succ./prec.) ───────
  // Cerca SOLO nel contenuto dei campi (mai nelle etichette UI) di TUTTE le voci,
  // anche quelle non ancora renderizzate, interrogando il modello dati `dati`.
  // I match sul Nome (IT/EN) vengono mostrati per primi ed evidenziati di più.
  var searchLayer=null, results=[], sel=0, lastQuery='', countEl, inputEl, listEl;
  // Ricerca insensibile agli accenti (come il 'trova' di Chromium): fold() toglie
  // i segni diacritici via NFD, così 'eonwe' trova 'Eönwë' e ogni vocale semplice
  // copre le sue varianti accentate. foldFind() localizza la query (già foldata,
  // Dalla 15.69 torna NODI: il testo del campo va nel DOM come testo, e l'evidenza è un
  // `<mark>` costruito a mano.
  function snippet(val, qf){
    val = String(val).replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();
    var sp = foldFind(val, qf);
    if (!sp) return val.slice(0,70);
    var os=sp[0], oe=sp[1], a=Math.max(0, os-24);
    return [(a>0?'...':'') + val.slice(a,os), nodo('mark', null, val.slice(os,oe)), val.slice(oe, oe+36) + (oe+36<val.length?'...':'')];
  }
  function clearHit(){ Array.prototype.slice.call(overlay.querySelectorAll('.admin-search-hit')).forEach(function(w){ w.classList.remove('admin-search-hit'); }); }
  var SEARCH_CAP = 100; // tetto alla LISTA renderizzata (query corte = centinaia di nodi); il conteggio resta totale
  function renderResults(q){
    var all = computeMatches(q); sel = 0; lastQuery = q;
    results = all.slice(0, SEARCH_CAP);
    listEl.replaceChildren();
    countEl.textContent = q.trim() ? (all.length + (all.length===1?' risultato':' risultati') + (all.length > SEARCH_CAP ? ' (primi ' + SEARCH_CAP + ')' : '')) : '';
    if (q.trim() && !results.length){ var e=document.createElement('div'); e.className='admin-search-empty'; e.textContent='Nessun risultato'; listEl.appendChild(e); return; }
    results.forEach(function(r, idx){
      var it = document.createElement('div');
      it.className = 'admin-search-item' + (r.isName?' as-namematch':'') + (idx===0?' sel':'');
      var nm = document.createElement('span'); nm.className='as-name';
      appendiA(nm, r.isName ? snippet(r.name, r.qf) : r.name);
      it.appendChild(nm);
      if (!r.isName) it.appendChild(nodo('span', { 'class': 'as-snip' }, nodo('em', null, (FIELD_LABEL[r.field] || r.field) + ':'), ' ', snippet(r.val, r.qf)));
      it.onmousedown = function(ev){ ev.preventDefault(); sel=idx; jump(); };
      listEl.appendChild(it);
    });
  }
  function setSel(n){
    if (!results.length) return;
    sel = (n + results.length) % results.length;
    var items = listEl.querySelectorAll('.admin-search-item');
    for (var j=0;j<items.length;j++) items[j].classList.toggle('sel', j===sel);
    if (items[sel]) items[sel].scrollIntoView({block:'nearest'});
  }
  function jump(){
    if (!results.length) return;
    var r = results[sel];
    ensureRendered(r.i);
    var card = cards.children[r.i];
    if (card){
      var vh = overlay.clientHeight, hh = (header.offsetHeight||60);
      overlay.scrollTop = Math.max(0, card.offsetTop - Math.max(hh + 8, (vh - card.offsetHeight)/2));
      clearHit();
      var fe = document.getElementById('ae-'+r.i+'-'+r.field);
      if (fe){ var w=fe.closest('.admin-field'); if (w) w.classList.add('admin-search-hit');
        try { var spn=foldFind(String(fe.value), r.qf); if (spn){ fe.focus({preventScroll:true}); fe.setSelectionRange(spn[0], spn[1]); } } catch(e){}
      }
    }
    closeSearch(true);
  }
  function openSearch(){
    if (!overlay.isConnected) return;
    if (searchLayer){ inputEl.focus(); inputEl.select(); return; }
    searchLayer = document.createElement('div'); searchLayer.className='admin-search-layer';
    var bd = document.createElement('div'); bd.className='admin-search-backdrop'; bd.onmousedown=function(){ closeSearch(false); };
    var box = document.createElement('div'); box.className='admin-search-box';
    var top = document.createElement('div'); top.className='admin-search-top';
    var ic = document.createElement('span'); ic.className='admin-search-ic'; ic.textContent='🔍';
    inputEl = document.createElement('input'); inputEl.className='admin-search-input'; inputEl.type='text';
    inputEl.placeholder='Cerca nei contenuti...'; inputEl.value=lastQuery; inputEl.setAttribute('aria-label','Cerca nei contenuti');
    countEl = document.createElement('span'); countEl.className='admin-search-count';
    top.appendChild(ic); top.appendChild(inputEl); top.appendChild(countEl);
    listEl = document.createElement('div'); listEl.className='admin-search-results';
    box.appendChild(top); box.appendChild(listEl);
    searchLayer.appendChild(bd); searchLayer.appendChild(box);
    overlay.appendChild(searchLayer);
    var deb;
    inputEl.addEventListener('input', function(){ clearTimeout(deb); deb=setTimeout(function(){ renderResults(inputEl.value); }, 110); });
    inputEl.addEventListener('keydown', function(e){
      if (e.key==='ArrowDown'){ e.preventDefault(); setSel(sel+1); }
      else if (e.key==='ArrowUp'){ e.preventDefault(); setSel(sel-1); }
      else if (e.key==='Enter'){ e.preventDefault(); jump(); }
      else if (e.key==='Escape'){ e.preventDefault(); closeSearch(false); }
    });
    renderResults(inputEl.value);
    inputEl.focus(); inputEl.select();
  }
  function closeSearch(fade){
    if (!searchLayer) return;
    var layer = searchLayer; searchLayer = null;
    if (fade){ layer.classList.add('closing'); setTimeout(function(){ layer.remove(); }, 190); }
    else { layer.remove(); }
  }
  function onAdminKey(e){
    if (!overlay.isConnected){ document.removeEventListener('keydown', onAdminKey, true); return; }
    if (!(e.metaKey || e.ctrlKey)) return;
    var k = (e.key||'').toLowerCase();
    if (k==='f'){ e.preventDefault(); openSearch(); }
    else if (k==='g'){ e.preventDefault(); if (!searchLayer) openSearch(); if (results.length) setSel(sel + (e.shiftKey?-1:1)); }
    // ⌘↓/⌘↑ = personaggio succ./prec.; ⌘⇧↓/⌘⇧↑ = ±10 (equivalenti ai chevron).
    else if (k==='arrowdown'){ e.preventDefault(); if (!searchLayer) goToCard(currentCardIndex() + (e.shiftKey?10:1)); }
    else if (k==='arrowup'){ e.preventDefault(); if (!searchLayer) goToCard(currentCardIndex() - (e.shiftKey?10:1)); }
  }
  document.addEventListener('keydown', onAdminKey, true);

  document.body.appendChild(overlay);
}

// Gate d'accesso admin unico (badge testata, versioni del Pannello, modale
// storica): editor diretto se già sbloccato, altrimenti modale password.
function openAdminGate() {
  if (saveUnlocked) showAdminChoiceModal();
  else showPasswordModal('Inserisci la parola d\'ordine per accedere all\'area admin.', showAdminChoiceModal);
}

// ── Bivio admin (dopo lo sblocco): personaggi vs colori ─────────────────────
// Sostituisce l'ingresso diretto nell'editor: si sceglie tra 'Modifica
// personaggi' (editor esistente) e 'Modifica colori' (pannello colori, Fase 1 =
// Modifica mirata del singolo personaggio; funzioni di famiglia in Fase 2).
// ── Console: l'aspetto del sito (admin, dalla v12.24; in UI 'Console' dal
// 2026-08-28, prima 'Pannello di controllo' e all'origine 'Feature flag') ────
// Controllo dell'ASPETTO del sito per TUTTI i visitatori: modalità ingrandita +
// i 5 effetti grafici. Salva `siteFlags` in dati.js via il Worker, SENZA bumpare
// la versione (vedi saveSiteFlagsToRepo).
// keepVersion:true (richiesta utente, v12.27): accendere/spegnere un effetto non
// è una modifica di contenuto, quindi NON bumpa datiVersion (come i salvataggi
// colore). Il controllo di freschezza resta affidabile: si basa sul confronto dei
// ref git, non sul numero.
function saveSiteFlagsToRepo(msg){ return doCommit(msg, dati, null, true, null, SITE_FLAGS); }
// Voci del pannello, nell'ordine di presentazione. `k` = chiave in SITE_FLAGS.
// ⚠️ NOMI E ORDINE decisi dall'utente (v12.64; 'Effetto podio' dalla v12.75, che
// accorcia 'Oro, argento e bronzo': a 320px in Modalità XL andava su due righe e
// rompeva il ritmo della lista): etichette brevi, 'Numeri colorati' dopo 'Bagliore'. Le didascalie descrittive
// sono state RIMOSSE (prima c'erano su desktop): l'utente le ha giudicate
// superflue, il pannello resta una lista pulita di interruttori. Non reintrodurle.
// ⚠️ Il caso peggiore per la LUNGHEZZA è 320px × Modalità XL: là la colonna della
// label è larga 132px e ogni etichetta deve starci su UNA riga (una che va a capo
// raddoppia l'altezza della riga e spezza il ritmo). Misurato col font reale:
// 'Numeri colorati' 1 riga, ma l'inglese 'Coloured numbers' ne prendeva 2 → reso
// 'Number tint' (99.9px, contro i 125.8px di 'Tinted numbers', troppo al limite).
// Non allungare queste etichette senza rimisurare a 320px in XL, in ENTRAMBE le
// lingue: l'italiano che sta su una riga non garantisce che ci stia l'inglese.
var SITE_FLAG_ITEMS = [
  { k:'zoomBig', it:'Modalità XL', en:'XL Mode' },
  { k:'glow', it:'Bagliore', en:'Glow', cfg:true },
  { k:'nums', it:'Numeri colorati', en:'Number tint', cfg:true },
  { k:'spot', it:'Riflettore', en:'Spotlight', cfg:true, noMob:true }, // config unica: mai nella tab Mobile (v13.18)
  { k:'press', it:'Incisione', en:'Engraving', cfg:true },
  { k:'vig', it:'Alone sfumato', en:'Soft halo', cfg:true },
  { k:'podium', it:'Effetto podio', en:'Podium effect', cfg:true },
  // ⚠️ Etichetta CORTA per forza: la colonna della label misura **102px** a 320px in
  // Modalità XL (rimisurata col font reale il 2026-07-28; la nota diceva 132px, che
  // era il valore prima delle rifiniture del pannello) e ogni etichetta deve starci
  // su UNA riga. Misure attuali: 'Colore schede' 91.6px, 'Card color' 69.7px - una
  // riga entrambe. Scartata 'Colore delle schede' (125.1px, va a capo). Storico dei
  // nomi: 'Colore al passaggio' (147px, mai usata) → 'Al passaggio' (79.9px, v14.10)
  // → **'Colore schede'** dalla v14.33, su richiesta dell'utente: ora l'effetto
  // governa il fondo E il contorno, quindi il nome dice la cosa, non il gesto.
  // ⚠️ Dalla v14.22 la voce c'è ANCHE nella tab Mobile: su touch l'effetto esiste e
  // vale da selezione al tocco (vedi FX_PTR), quindi la variante si tara a parte;
  // il discriminante però è il puntatore, non la larghezza.
  { k:'hov', it:'Colore schede', en:'Card color', cfg:true },
  // ⚠️ 'Trama'/'Pattern' e non 'Trama di fondo': quest'ultima misura 101.4px su 102
  // di colonna (320px in XL, font reale), un margine troppo sottile per fidarsi.
  // `noMob` perché l'effetto è desktop-only, come il riflettore ma per un'altra
  // ragione: là manca il puntatore, qui manca lo sfondo su cui vedere la trama.
  { k:'pat', it:'Trama', en:'Pattern', cfg:true, noMob:true }
];
// Manopole della sotto-modale, per effetto. `t` = 'bool' (checkbox) o 'num' (slider
// + valore); i limiti dei numeri vengono da FX_RANGE, unica fonte.
var FX_KNOBS = {
  // ⚠️ Le voci del bagliore sono organizzate in SEZIONI (v12.76, struttura e testi
  // dell'utente): erano un elenco piatto di otto voci in cui non si capiva quale
  // sfumatura riguardasse quale parte. Una voce con `sec` è un'INTESTAZIONE, non
  // una manopola. Le manopole numeriche portano `th` ('d'/'l'), quindi la
  // sotto-modale mostra le tab Chiaro/Scuro e ogni tab filtra le proprie.
  glow: [
    { p:'on', t:'bool', it:'Attiva', en:'Enable' },
    { p:'all', t:'bool', it:'Su tutte le card', en:'On every card', dep:'on',
      nit:'Spento, si accende solo la card sotto il puntatore. Acceso, tutte le card restano accese.',
      nen:'Off, only the card under the pointer lights up. On, every card stays lit.' },
    // Gruppo POSIZIONE (v12.95, struttura dell'utente): DOVE va il bagliore. Le
    // quattro caselle governano le tre sezioni di manopole qui sotto.
    { sec:true, it:'Posizione', en:'Position', dep:'on' },
    { p:'pl', t:'bool', it:'A sinistra', en:'On the left', dep:'on',
      nit:'Bagliore interno lungo il bordo sinistro, quello che parte dalla striscia colorata.',
      nen:'Inner glow along the left edge, the one spreading from the coloured strip.' },
    { p:'pr', t:'bool', it:'A destra', en:'On the right', dep:'on',
      nit:'Bagliore interno lungo il bordo destro. A destra non c\'è una striscia colorata: solo il bagliore.',
      nen:'Inner glow along the right edge. There is no coloured strip on the right: the glow only.' },
    { p:'ps', t:'bool', it:'Ai lati', en:'Beyond the edges', dep:'on',
      nit:'Il bagliore esce anche FUORI dalla card, dai lati accesi qui sopra.',
      nen:'The glow also escapes OUTSIDE the card, from the edges enabled above.' },
    { p:'pa', t:'bool', it:'Intorno alla card', en:'Around the card', dep:'on',
      nit:'Alone uniforme su tutto il perimetro.', nen:'Even halo around the whole perimeter.' },
    { sec:true, it:'Interno', en:'Inner', dep:'inner' },
    { p:'amp_d', t:'num', step:1, unit:'px', th:'d', dep:'inner', it:'Sfumatura', en:'Spread' },
    { p:'amp_l', t:'num', step:1, unit:'px', th:'l', dep:'inner', it:'Sfumatura', en:'Spread' },
    { p:'int_d', t:'num', step:0.02, th:'d', dep:'inner', it:'Opacità', en:'Opacity' },
    { p:'int_l', t:'num', step:0.02, th:'l', dep:'inner', it:'Opacità', en:'Opacity' },
    { sec:true, it:'Esterno', en:'Outer', dep:'outer' },
    { p:'oamp_d', t:'num', step:1, unit:'px', th:'d', dep:'outer', it:'Sfumatura', en:'Spread' },
    { p:'oamp_l', t:'num', step:1, unit:'px', th:'l', dep:'outer', it:'Sfumatura', en:'Spread' },
    { p:'oint_d', t:'num', step:0.02, th:'d', dep:'outer', it:'Opacità', en:'Opacity' },
    { p:'oint_l', t:'num', step:0.02, th:'l', dep:'outer', it:'Opacità', en:'Opacity' },
    { sec:true, it:'Intorno alla card', en:'Around the card', dep:'around' },
    { p:'aamp_d', t:'num', step:1, unit:'px', th:'d', dep:'around', it:'Sfumatura', en:'Spread' },
    { p:'aamp_l', t:'num', step:1, unit:'px', th:'l', dep:'around', it:'Sfumatura', en:'Spread' },
    { p:'aint_d', t:'num', step:0.02, th:'d', dep:'around', it:'Opacità', en:'Opacity' },
    { p:'aint_l', t:'num', step:0.02, th:'l', dep:'around', it:'Opacità', en:'Opacity' }
  ],
  spot: [
    { p:'on', t:'bool', it:'Attiva', en:'Enable' },
    { p:'r', t:'num', step:5, unit:'px', dep:'on', it:'Raggio del riflettore', en:'Spotlight radius' },
    { p:'int', t:'num', step:0.01, dep:'on', it:'Intensità', en:'Intensity',
      nit:'Il massimo è il valore verificato AA: oltre, in tema scuro i testi più tenui scenderebbero sotto soglia.',
      nen:'The maximum is the AA-verified value: beyond it, the faintest texts would drop below threshold in dark theme.' }
  ],
  vig: [
    { p:'on', t:'bool', it:'Attiva', en:'Enable' },
    { p:'int', t:'num', step:0.02, dep:'on', it:'Intensità', en:'Intensity' },
    { p:'start', t:'num', step:1, unit:'%', dep:'on', it:'Inizio della sfumatura', en:'Fade start',
      nit:'Più basso = la sfumatura parte prima e copre più sfondo.',
      nen:'Lower = the fade starts earlier and covers more background.' }
  ],
  press: [
    { p:'on', t:'bool', it:'Attiva', en:'Enable' },
    { p:'name', t:'bool', dep:'on', it:'Sul Nome', en:'On the Name' },
    { p:'lab', t:'bool', dep:'on', it:'Sulle etichette tipo', en:'On the type labels' },
    { p:'num', t:'bool', dep:'on', it:'Sui numeri di classifica', en:'On the rank numbers',
      nit:'I primi tre conservano l\'ombra del podio, quando è attivo.',
      nen:'The top three keep the podium shadow when it is on.' }
  ],
  // Per TEMA dalla v12.76: i metalli hanno gradienti diversi nei due temi, quindi
  // una sola coppia contrasto/luminosità non poteva servirli entrambi.
  podium: [
    { p:'on', t:'bool', it:'Attiva', en:'Enable' },
    { p:'int_d', t:'num', step:0.02, th:'d', dep:'on', it:'Contrasto', en:'Contrast',
      nit:'Aumenta lo stacco tra lumi e ombre del gradiente.',
      nen:'Raises the contrast between the gradient highlights and shadows.' },
    { p:'lum_d', t:'num', step:0.02, th:'d', dep:'on', it:'Luminosità', en:'Brightness' },
    { p:'rifl_d', t:'num', step:0.02, th:'d', dep:'on', it:'Riflesso', en:'Glint',
      nit:'Il lampo speculare a metà del numero, uguale per i tre metalli.',
      nen:'The specular flash across the digit, shared by all three metals.' },
    { p:'crisp_d', t:'num', step:0.02, th:'d', dep:'on', it:'Nitidezza del riflesso', en:'Glint sharpness',
      nit:'Quanto è sfumato il bordo del riflesso: a zero morbido, al massimo netto. La sagoma non cambia.',
      nen:'How soft the glint edge is: zero is feathered, full is sharp. The shape itself never shrinks.' },
    { p:'top_d', t:'num', step:0.02, th:'d', dep:'on', it:'Bordo luminoso', en:'Edge light',
      nit:'Il bordo chiaro in cima al glifo.', nen:'The bright edge at the top of the glyph.' },
    { p:'tamp_d', t:'num', step:1, unit:'%', th:'d', dep:'on', it:'Ampiezza del bordo', en:'Edge width',
      nit:'Quanto scende il bordo luminoso dalla cima del numero.',
      nen:'How far the bright edge reaches down from the top of the digit.' },
    { p:'sat_d', t:'num', step:0.02, th:'d', dep:'on', it:'Saturazione', en:'Saturation',
      nit:'Quanto è carica la tinta del metallo (il Contrasto regola invece lo stacco tra chiaro e scuro).',
      nen:'How rich the metal tint is (Contrast controls the light-dark separation instead).' },
    { p:'int_l', t:'num', step:0.02, th:'l', dep:'on', it:'Contrasto', en:'Contrast',
      nit:'Aumenta lo stacco tra lumi e ombre del gradiente.',
      nen:'Raises the contrast between the gradient highlights and shadows.' },
    { p:'lum_l', t:'num', step:0.02, th:'l', dep:'on', it:'Luminosità', en:'Brightness' },
    { p:'rifl_l', t:'num', step:0.02, th:'l', dep:'on', it:'Riflesso', en:'Glint',
      nit:'Il lampo speculare a metà del numero, uguale per i tre metalli.',
      nen:'The specular flash across the digit, shared by all three metals.' },
    { p:'crisp_l', t:'num', step:0.02, th:'l', dep:'on', it:'Nitidezza del riflesso', en:'Glint sharpness',
      nit:'Quanto è sfumato il bordo del riflesso: a zero morbido, al massimo netto. La sagoma non cambia.',
      nen:'How soft the glint edge is: zero is feathered, full is sharp. The shape itself never shrinks.' },
    { p:'top_l', t:'num', step:0.02, th:'l', dep:'on', it:'Bordo luminoso', en:'Edge light',
      nit:'Il bordo chiaro in cima al glifo.', nen:'The bright edge at the top of the glyph.' },
    { p:'tamp_l', t:'num', step:1, unit:'%', th:'l', dep:'on', it:'Ampiezza del bordo', en:'Edge width',
      nit:'Quanto scende il bordo luminoso dalla cima del numero.',
      nen:'How far the bright edge reaches down from the top of the digit.' },
    { p:'sat_l', t:'num', step:0.02, th:'l', dep:'on', it:'Saturazione', en:'Saturation',
      nit:'Quanto è carica la tinta del metallo (il Contrasto regola invece lo stacco tra chiaro e scuro).',
      nen:'How rich the metal tint is (Contrast controls the light-dark separation instead).' }
  ],
  // `th` = manopola valida solo per un TEMA ('d' scuro, 'l' chiaro): la
  // sotto-modale mostra le tab Chiaro/Scuro e filtra le righe. Senza `th` la
  // manopola è condivisa dai due temi (interruttore e luminosità uniforme).
  nums: [
    { p:'on', t:'bool', it:'Attiva', en:'Enable' },
    { p:'uni', t:'bool', dep:'on', it:'Luminosità uniforme', en:'Uniform lightness',
      nit:'Acceso, tutti i numeri hanno la stessa luminosità e si distinguono solo per tinta. Spento, ognuno conserva la luminosità della propria tinta.',
      nen:'On, every number shares one lightness and differs only in hue. Off, each keeps the lightness of its own tint.' },
    { p:'dsat', t:'num', step:0.05, th:'d', dep:'on', it:'Cromia conservata', en:'Chroma kept' },
    { p:'dlum', t:'num', step:0.01, th:'d', dep:'on', it:'Luminosità di riferimento', en:'Reference lightness',
      nit:'Il minimo è il valore verificato AA: sotto, in tema scuro il numero scenderebbe sotto 3:1 sul fondo della card.',
      nen:'The minimum is the AA-verified value: below it the number would drop under 3:1 on the card background in dark theme.' },
    { p:'lsat', t:'num', step:0.05, th:'l', dep:'on', it:'Cromia conservata', en:'Chroma kept' },
    { p:'llum', t:'num', step:0.01, th:'l', dep:'on', it:'Luminosità di riferimento', en:'Reference lightness',
      nit:'Il massimo è il valore verificato AA: sopra, su fondo chiaro il numero scenderebbe sotto 3:1.',
      nen:'The maximum is the AA-verified value: above it the number would drop under 3:1 on a light background.' }
  ],
  // hov (v14.10): fondo della card sotto il puntatore. Le tre manopole sono per
  // TEMA, nell'ordine chiesto dall'utente (opacità, saturazione, luminosità).
  hov: [
    { p:'on', t:'bool', it:'Attiva', en:'Enable' },
    // Contorno: sì/no e nient'altro (richiesta dell'utente, v14.33 - 'senza opacità
    // intermedia o altro'), NON per tema, perché i due valori storici sono già
    // tarati sui rispettivi fondi. Vale al passaggio del puntatore E al tap.
    { p:'bd', t:'bool', dep:'on', it:'Contorno più nitido', en:'Sharper border',
      nit:'Al passaggio (o al tocco) il contorno della card si fa più netto. Spento, il contorno non cambia mai.',
      nen:'On hover (or tap) the card border gets crisper. Off, the border never changes.' },
    { p:'op_d', t:'num', step:0.01, th:'d', dep:'on', it:'Opacità', en:'Opacity',
      nit:'Quanto si accende il fondo della card sotto il puntatore. Alzandola, i testi più tenui perdono contrasto: il valore consigliato è il predefinito.',
      nen:'How much the card background lights up under the pointer. Raising it costs contrast on the faintest texts: the default is the recommended value.' },
    { p:'sat_d', t:'num', step:0.05, th:'d', dep:'on', it:'Saturazione', en:'Saturation',
      nit:'Quanto è carica la tinta di famiglia. A zero il fondo diventa grigio.',
      nen:'How rich the family tint is. At zero the background turns grey.' },
    { p:'lum_d', t:'num', step:0.02, th:'d', dep:'on', it:'Luminosità', en:'Brightness' },
    { p:'op_l', t:'num', step:0.01, th:'l', dep:'on', it:'Opacità', en:'Opacity',
      nit:'Quanto si accende il fondo della card sotto il puntatore. Alzandola, i testi più tenui perdono contrasto: il valore consigliato è il predefinito.',
      nen:'How much the card background lights up under the pointer. Raising it costs contrast on the faintest texts: the default is the recommended value.' },
    { p:'sat_l', t:'num', step:0.05, th:'l', dep:'on', it:'Saturazione', en:'Saturation',
      nit:'Quanto è carica la tinta di famiglia. A zero il fondo diventa grigio.',
      nen:'How rich the family tint is. At zero the background turns grey.' },
    { p:'lum_l', t:'num', step:0.02, th:'l', dep:'on', it:'Luminosità', en:'Brightness' }
  ],
  // Trama di fondo (v14.43). Due manopole di tipo NUOVO: `sel` (scelta fra voci) e
  // `col` (colore hex). Colore e opacità sono separati apposta - la tinta si scegle
  // col selettore di sistema, l'opacità con lo slider.
  pat: [
    { p:'on', t:'bool', it:'Attiva', en:'Enable' },
    { p:'mot', t:'sel', dep:'on', it:'Motivo', en:'Motif', opts:fxSelOpts('pat', 'mot'),
      nit:'Stelle e foglia di Lothlórien, figure araldiche, reti intrecciate.',
      nen:'Stars and the leaf of Lothlórien, heraldic figures, interlaced nets.' },
    { p:'fade', t:'num', step:10, unit:'px', dep:'on', it:'Sfumatura', en:'Fade',
      nit:'Quanto la trama si dissolve prima di incontrare la colonna delle schede e la testata, che restano sempre sgombre.',
      nen:'How far the pattern fades out before it meets the card column and the header, which always stay clear.' },
    { p:'c_d', t:'col', th:'d', dep:'on', it:'Colore', en:'Colour' },
    { p:'op_d', t:'num', step:0.005, th:'d', dep:'on', it:'Opacità', en:'Opacity' },
    { p:'c_l', t:'col', th:'l', dep:'on', it:'Colore', en:'Colour' },
    { p:'op_l', t:'num', step:0.005, th:'l', dep:'on', it:'Opacità', en:'Opacity' },
    { p:'sc', t:'num', step:0.05, dep:'on', it:'Dimensione', en:'Size',
      nit:'Quanto è grande il motivo. Valori alti lo rendono più rado.',
      nen:'How large the motif is. Higher values make it sparser.' }
  ]
};
// Icona della sotto-modale: due CURSORI VERTICALI (fader) a manopole sfalsate,
// monocromatica (currentColor), sul disegno scelto dall'utente. Le aste si
// interrompono ai lati della manopola invece di passarci dietro: a 17px un cerchio
// attraversato dalla linea impasta.
var FX_SLIDERS_SVG = '<svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true" focusable="false">' +
  '<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">' +
  '<path d="M7 3v8.2M7 15.6V17M13 3v2.4M13 9.8V17"/>' +
  '<circle cx="7" cy="13.4" r="2.2"/><circle cx="13" cy="7.6" r="2.2"/></g></svg>';
// CSS dell'anteprima: iniettato all'apertura (invisibile al Nu, come per gli altri
// editor admin). I fondi sono quelli REALI del sito (#262626 / #F5F5F5) e la card
// riproduce struttura, bordi e opacità di sfondo di una card vera.
function injectFxEditorCss(){
  if (document.getElementById('fx-ed-css')) return;
  var st = document.createElement('style'); st.id = 'fx-ed-css';
  st.textContent = [
    // ⚠️ ANTEPRIMA FISSA IN ALTO (v12.95, richiesta dell'utente). La modale
    // scrolla nel proprio box (`overflow-y:auto`) e `.fxp-wrap` ne è figlio
    // diretto, quindi `position:sticky; top:0` la tiene in vista mentre si scorre
    // fino alle manopole in fondo: senza, in Modalità XL si regolava alla cieca.
    // Serve un FONDO OPACO (il colore della modale) e un po' di padding, altrimenti
    // le righe che passano sotto si vedrebbero in trasparenza. Globale, non solo XL.
    '.fxp-wrap{display:grid;gap:0.45rem;margin:0 0 0.2rem;position:sticky;top:0;z-index:3;',
    'padding:0.35rem 0 0.5rem;background:#252525}',
    'html[data-theme="light"] .fxp-wrap{background:#F4F4F4}',
    // Il tasto di chiusura deve restare SOPRA l'anteprima appiccicata, altrimenti
    // scorrendo ci finisce sotto e non si clicca più.
    '#fx-modal .fab-modal-close{z-index:4}',
    // Padding sinistro abbondante (v12.41): le sfumature lunghe del bagliore
    // esterno e dell'alone escono dalla card e senza respiro venivano tagliate
    // dall'overflow:hidden del riquadro.
    '.fxp-pane{position:relative;border-radius:8px;padding:0.85rem 1.2rem 0.85rem 1.7rem;display:flex;flex-direction:column;gap:0.55rem;overflow:hidden}',
    // Riquadro 'arioso' del solo bagliore: respiro su tutti i lati perché fughe e
    // alone escono dalla card in ogni direzione e l'overflow:hidden li tagliava.
    '.fxp-pane.fxp-airy{padding:1.9rem 2.4rem}',
    // (il valore definitivo lo calcola paint(), dalle manopole: vedi 'respiro
    // DINAMICO'. Questo è solo il punto di partenza del primo fotogramma.)
    '.fxp-pane.d{background:#262626;color:#d2d2d2}',
    '.fxp-pane.l{background:#F5F5F5;color:#373737}',
    // ⚠️ `.fxp-edit` (evidenziazione del riquadro in modifica, v12.64-12.75) NON è
    // più applicata dalla v12.76: con le manopole per tema si mostra un solo
    // riquadro, quello che si sta modificando, quindi non c'è nulla da distinguere.
    // Le regole restano come base per un eventuale ritorno alla vista doppia.
    '.fxp-pane{outline:2px solid transparent;outline-offset:2px;transition:outline-color 0.2s}',
    '.fxp-pane.fxp-edit{outline-color:rgba(90,140,220,0.95)}',
    'html[data-theme="light"] .fxp-pane.fxp-edit{outline-color:rgba(28,84,170,0.95)}',
    '.fxp-card{position:relative;display:grid;grid-template-columns:24px 1fr;align-items:center;gap:0.7rem;',
    'padding:0.45rem 0.6rem 0.45rem 0.3rem;border-radius:4px;border:1px solid rgba(104,144,168,0.15);',
    'overflow:hidden;isolation:isolate;transition:background 0.2s,box-shadow 0.2s}',
    '.fxp-pane.l .fxp-card{border-color:rgba(80,110,150,0.22)}',
    '.fxp-strip{position:absolute;left:0;top:0;bottom:0;width:4px;transition:box-shadow 0.2s}',
    '.fxp-spot{position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:0;transition:opacity 0.25s}',
    '.fxp-num{font-family:\'Cinzel\',serif;font-weight:900;font-size:1.05rem;text-align:right;line-height:1}',
    '.fxp-name{display:block;font-family:\'Cinzel\',serif;font-variant:small-caps;font-weight:700;font-size:0.95rem;letter-spacing:0.03em;line-height:1.2}',
    '.fxp-desc{display:block;font-size:0.66rem;opacity:0.8;margin-top:0.06rem}',
    '.fx-gear{display:inline-flex;align-items:center;justify-content:center;width:1.7rem;height:1.7rem;',
    'padding:0;background:none;border:1px solid rgba(140,145,160,0.4);border-radius:6px;color:inherit;',
    'cursor:pointer;opacity:0.75;transition:opacity 0.15s,border-color 0.15s}',
    '.fx-gear:hover{opacity:1;border-color:rgba(140,145,160,0.75)}',
    // 0.62em (non 0.5): a 0.5em il corpo scendeva a ~7.6px, illeggibile e sotto
    // la soglia di contrasto per il testo piccolo.
    '.fxp-pill{display:inline-block;font-size:0.62em;font-weight:400;letter-spacing:0.03em;',
    'border:1px solid;border-radius:3px;padding:0 5px;margin-left:0.5em;vertical-align:0.25em;white-space:nowrap}',
    // Intestazione di sezione (v12.76): titoletto che raggruppa le manopole di una
    // parte del bagliore. Piccola, in maiuscoletto spaziato e con un filetto
    // sopra, così separa senza pesare; opacità 0.85 per restare sopra la soglia
    // di contrasto del testo piccolo.
    '.fxk-sec{margin:1rem 0 0.5rem;padding-top:0.5rem;border-top:1px solid rgba(140,145,160,0.28);',
    'font-size:0.7rem;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;opacity:0.85}',
    '.fxk-sec:first-child{margin-top:0;padding-top:0;border-top:0}',
    // Spunta MINIMALE (v12.76, richiesta utente): la casella nativa ha un segno
    // pesante e diverso su ogni sistema. Qui è un quadrato stondato con una spunta
    // disegnata in ::after (due lati di un rettangolo ruotati di 45°, il modo
    // classico di ottenere un segno di spunta pulito senza SVG né font).
    // Vincoli rispettati: il bersaglio di tocco resta la label da 24px (v12.75),
    // il focus da tastiera resta visibile (outline proprio) e il contrasto del
    // segno sul fondo acceso è ampiamente sopra il 3:1 richiesto per gli elementi
    // non testuali. `accent-color` non basterebbe: cambia la tinta, non la forma.
    '#fx-modal input[type=checkbox],#fab-modal input[type=checkbox]{appearance:none;-webkit-appearance:none;',
    'position:relative;flex:none;width:1.05rem;height:1.05rem;margin:0;border-radius:4px;cursor:pointer;',
    'border:1.5px solid rgba(140,145,160,0.75);background:transparent;transition:background 0.15s,border-color 0.15s}',
    '#fx-modal input[type=checkbox]:hover,#fab-modal input[type=checkbox]:hover{border-color:rgba(160,180,205,0.95)}',
    '#fx-modal input[type=checkbox]:checked,#fab-modal input[type=checkbox]:checked{',
    'background:rgba(122,166,205,0.95);border-color:rgba(122,166,205,0.95)}',
    'html[data-theme="light"] #fx-modal input[type=checkbox]:checked,html[data-theme="light"] #fab-modal input[type=checkbox]:checked{',
    'background:rgba(31,85,98,0.95);border-color:rgba(31,85,98,0.95)}',
    '#fx-modal input[type=checkbox]:checked::after,#fab-modal input[type=checkbox]:checked::after{content:"";position:absolute;',
    'left:50%;top:47%;width:0.3rem;height:0.56rem;border:solid #fff;border-width:0 2px 2px 0;',
    'transform:translate(-50%,-50%) rotate(45deg)}',
    // Focus da tastiera: anello proprio, perché con appearance:none quello nativo
    // sparisce insieme al disegno della casella.
    '#fx-modal input[type=checkbox]:focus-visible,#fab-modal input[type=checkbox]:focus-visible{',
    'outline:2px solid rgba(154,192,216,0.95);outline-offset:2px}',
    // Riga o sezione SPENTA (v12.95): la sua casella di controllo è spenta, quindi
    // le impostazioni non si applicano. Semitrasparente e non modificabile, ma
    // l'opacità resta 0.5 e non meno: sotto, il testo scenderebbe fuori soglia di
    // contrasto anche per un controllo disabilitato, che va comunque letto.
    // Vista divisa: la colonna a sinistra e la pagina spostata a destra. La
    // larghezza vive in --dockw; il filetto verticale è il bordo della colonna.
    'html.fx-dock{--dockw:400px}',
    'html.fx-dock body{margin-left:var(--dockw)}',
    '.fab-modal-overlay.fxdock{right:auto;width:var(--dockw);background:transparent;',
    'backdrop-filter:none;-webkit-backdrop-filter:none;align-items:stretch;',
    'justify-content:flex-start;overflow:hidden;padding:0;',
    'border-right:1px solid rgba(128,144,160,0.45);box-shadow:8px 0 22px rgba(0,0,0,0.22)}',
    // In dock l'anteprima su card finte è RIDONDANTE (richiesta utente, v13.07):
    // l'anteprima è la pagina vera accanto. Si nasconde via CSS e basta: i pannelli
    // vengono comunque costruiti e dipinti (paint() lavora su elementi nascosti
    // senza errori), così il cambio di telaio a metà modifica non ha casi speciali.
    // ⚠️ ECCEZIONE: quando la variante in modifica NON è quella attiva su questo
    // dispositivo (v13.55, segnalata dall'utente; criterio generalizzato nella
    // v14.23). La pagina accanto mostra l'altra variante, quindi non fa da anteprima
    // a nulla e si resterebbe senza riscontro; lì i riquadri restano visibili, gli
    // stessi della modale-fallback (`paint()` legge già la variante in modifica).
    // La classe si chiamava `fxdock-mob` finché il caso era solo 'sto regolando il
    // mobile da un desktop': su un TABLET TOUCH è il contrario, ed è la tab Desktop
    // a non avere riscontro in pagina - da qui il nome neutro `fxdock-alt`.
    '.fab-modal-overlay.fxdock:not(.fxdock-alt) .fxp-wrap{display:none}',
    // Micro-aggiustamenti in dock: campi e anteprime si impilano (il corpo a due
    // colonne è pensato per la modale da 840px, nella colonna da 560 non ci sta).
    '.fab-modal-overlay.fxdock .ba-body{grid-template-columns:1fr;gap:14px}',
    '.fab-modal-overlay.fxdock .fab-modal-box{width:100%;max-width:none;height:100%;',
    'max-height:none;margin:0;border-radius:0;border:0;box-shadow:none}',
    '.fxk-row.fxk-off,.fxk-sec.fxk-off{opacity:0.5}',
    '.fxk-row.fxk-off input,.fxk-row.fxk-off label{cursor:not-allowed}',
    '.fxk-row{display:grid;grid-template-columns:1fr auto;gap:0.3rem 0.6rem;align-items:center;margin:0 0 0.6rem}',
    '.fxk-row .fxk-lbl{font-size:0.84rem;font-weight:600}',
    '.fxk-row .fxk-val{font-size:0.78rem;font-variant-numeric:tabular-nums;opacity:0.75;min-width:3.2em;text-align:right}',
    // Manopole a scelte e colore (v14.43). Il bersaglio resta ≥24px (WCAG 2.5.8)
    // come per slider e caselle; il `<select>` eredita il font della modale.
    '.fxk-row .fxk-sel{font:inherit;font-size:0.8rem;padding:0.15rem 0.3rem;min-height:24px;',
    'background:rgba(128,144,160,0.12);color:inherit;border:1px solid rgba(128,144,160,0.4);border-radius:4px;cursor:pointer}',
    '.fxk-row .fxk-col{width:44px;height:24px;padding:0;border:1px solid rgba(128,144,160,0.4);',
    'border-radius:4px;background:none;cursor:pointer}',
    // height:24px (v12.75): l'area di TOCCO dello slider era alta 16px, sotto i
    // 24px minimi di WCAG 2.2 (2.5.8). Il track resta visivamente com'era, cresce
    // solo la zona sensibile.
    '.fxk-row input[type=range]{grid-column:1/3;width:100%;height:24px;margin:0}',
    '.fxk-row .fxk-note{grid-column:1/3;font-size:0.72rem;opacity:0.62;line-height:1.35;margin:-0.15rem 0 0}'
  ].join('');
  document.head.appendChild(st);
}
// Terna RGB per l'anteprima: si pesca da una famiglia reale (così il colore è uno
// di quelli del sito), con ripiego neutro se la config fosse vuota.
function fxPreviewCc(light){
  var fam = (CARDCOLORS && CARDCOLORS.fam) || {};
  var key = fam.noldo ? 'noldo' : Object.keys(fam)[0];
  var hex = key ? (fam[key] || {})[light ? 'light' : 'dark'] : null;
  return hex ? ccHexToTriplet(hex) : (light ? '47,79,208' : '91,123,240');
}
// ── Sotto-modale di regolazione di un effetto (dalla v12.39) ─────────────────
// Stile admin MINIMALE (fab-modal-box), overlay a parte (#fx-modal) così sta SOPRA
// il pannello che resta aperto sotto, come le statistiche sull'editor colori.
// L'anteprima usa le stesse funzioni-formula delle regole iniettate.
// `sfx` (v12.53) = variante in modifica: '' desktop, '_m' mobile. Tutte le
// letture/scritture passano da SITE_FLAGS[key+sfx]; la pagina dietro cambia solo
// se la variante è quella della piattaforma corrente (injectFxRules usa fxCfg).
// ── Slider 'solo pallino' (v13.39, richiesta utente) ──────────────────────────
// Il range nativo SALTA al punto cliccato sul binario; qui il valore si cambia
// solo trascinando il pallino (o da tastiera, o dal campo numerico dove c'è).
// Al pointerdown si stima dove sta il pallino: se il puntatore è lontano si
// blocca l'azione nativa. Il doppio clic/tocco sul BINARIO vale come quello sul
// pallino (reset), ma è rilevato a mano coi timestamp: il preventDefault può
// sopprimere il click sintetico, quindi il dblclick nativo lì non è affidabile.
// rect e clientX sono entrambi in px visivi: la stima regge anche sotto zoom XL.
function fxGuardSlider(sl, onDbl){
  var lastTap = 0;
  // Valore da ripristinare mentre il gesto è bloccato (null = nessun blocco).
  var v0 = null;
  // Il puntatore è sul pallino? Si stima la sua posizione dal valore corrente: il
  // diametro è ~ l'altezza del controllo, e la corsa utile è larghezza − diametro.
  // rect e clientX sono entrambi in px VISIVI, quindi la stima regge sotto zoom XL.
  function sulPallino(x, touch){
    var r = sl.getBoundingClientRect();
    var min = parseFloat(sl.min) || 0, max = parseFloat(sl.max);
    var ratio = Math.min(1, Math.max(0, (parseFloat(sl.value) - min) / ((max - min) || 1)));
    var thumb = Math.min(r.height, 28);
    var cx = r.left + thumb / 2 + ratio * (r.width - thumb);
    return Math.abs(x - cx) <= Math.max(12, thumb * 0.55) * (touch ? 1.5 : 1);
  }
  function blocca(){ if (v0 === null) v0 = sl.value; }
  function libera(){ v0 = null; }
  sl.addEventListener('pointerdown', function(e){
    // ⚠️ Ogni gesto NUOVO parte libero: se un `touchend` non fosse arrivato (gesto
    // interrotto dal browser), un blocco rimasto appeso renderebbe lo slider inerte
    // per sempre. Su un dispositivo reale sarebbe peggio del difetto che si corregge.
    libera();
    if (sl.disabled || !isFinite(e.clientX)) return;
    if (sulPallino(e.clientX, e.pointerType === 'touch')) return; // trascinamento nativo
    e.preventDefault();
    blocca();
    if (e.timeStamp - lastTap < 400) { lastTap = 0; libera(); if (onDbl) onDbl(); }
    else lastTap = e.timeStamp;
  });
  // ⚠️ SU TOUCH `preventDefault` sul solo `pointerdown` NON basta (segnalato
  // dall'utente su dispositivo reale, v14.80): certi browser cambiano il valore
  // dalla gestione nativa del tocco, che quel preventDefault non annulla. E
  // l'emulazione NON riproduce il caso: in Chromium con `hasTouch` il guard
  // sembrava tenere. Da qui due difese in più, indipendenti dal percorso degli
  // eventi:
  //  1. `touchstart` NON passivo, dove il preventDefault è quello documentato per
  //     sopprimere il comportamento nativo del tocco;
  //  2. rete di sicurezza VERA: mentre il gesto è bloccato, ogni `input` viene
  //     annullato in CAPTURE (valore ripristinato + stopImmediatePropagation), così
  //     il listener della manopola non lo vede nemmeno. Funziona anche se il
  //     browser ignora del tutto il preventDefault.
  sl.addEventListener('touchstart', function(e){
    libera();                                   // stessa cautela del pointerdown
    if (sl.disabled || !e.touches || !e.touches.length) return;
    if (sulPallino(e.touches[0].clientX, true)) return;
    e.preventDefault();
    blocca();
  }, { passive: false });
  sl.addEventListener('input', function(e){
    if (v0 === null) return;
    sl.value = v0;              // il tocco sul binario non muove niente
    e.stopImmediatePropagation();
  }, true);
  ['pointerup', 'pointercancel', 'touchend', 'touchcancel', 'lostpointercapture']
    .forEach(function(ev){ sl.addEventListener(ev, libera); });
}

// ── VISTA DIVISA / dock (dalla v13.06, richiesta utente) ─────────────────────
// Su desktop largo gli editor dell'ASPETTO non aprono una modale: si ancorano in
// una COLONNA a sinistra e la pagina VERA, spostata a destra, fa da anteprima
// dinamica (stesso DOM: fedeltà garantita, nessun doppio stato). Sotto la soglia
// si resta alla modale di sempre (fallback), e un ridimensionamento a metà
// modifica commuta il telaio conservando lo stato.
// ⚠️ Tre scelte strutturali da non rompere:
//  1. NIENTE lockPageScroll in dock: la pagina deve restare VIVA (scroll + hover,
//     senza hover non si vedono bagliore e riflettore). Il congelamento
//     inert/focus-trap resta per le modali normali.
//  2. La colonna è dimensionata con inset (top/bottom:0), MAI in vh: le unità
//     viewport sotto zoom XL non scattano (lezione v12.65).
//  3. Spostare la pagina col margine NON fa scattare `resize`: reflowRows va
//     chiamata a mano all'aggancio e allo sgancio.
// Soglia = larghezza colonna + ~660px di pagina, in px di LAYOUT. ⚠️ MISURATO:
// `clientWidth` NON si riduce sotto `zoom` (resta la larghezza della finestra),
// quindi il fattore XL va diviso a mano: è già esposto in --zoomf (1 o 1.3).
// La colonna ha larghezza PER-EDITOR (v13.17): Console 400,
// editor colori 480, micro-aggiustamenti 560 (i loro contenuti sono più larghi).
function dockAvailable(colw){
  var z = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoomf')) || 1;
  return document.documentElement.clientWidth / z >= (colw || 400) + 660;
}
// Un rebuild tecnico chiude e riapre un editor senza che sia l'utente a uscirne:
// il flag spegne i ripristini della chiusura E l'animazione d'ingresso (che a ogni
// cambio lingua, reset o cambio di telaio farebbe lampeggiare la colonna). Il
// `finally` evita che una riapertura andata male lasci il flag acceso a sabotare
// la chiusura successiva. Va avvolta anche la RIAPERTURA, non solo la chiusura.
function dockRebuild(fn){ DOCK_RELAYOUT = true; try { fn(); } finally { DOCK_RELAYOUT = false; } }
function dockEngage(colw){
  document.documentElement.classList.add('fx-dock');
  if (colw) document.documentElement.style.setProperty('--dockw', colw + 'px');
  if (!DOCK_SHIELD) {
    DOCK_SHIELD = function(e){
      if (e.target && e.target.closest && e.target.closest('#fab-modal, #fx-modal, .jump-fabs, .lang-switch')) return;
      e.preventDefault(); e.stopPropagation();
    };
    document.addEventListener('click', DOCK_SHIELD, true);
  }
  reflowRows();
}
function dockRelease(){
  document.documentElement.classList.remove('fx-dock');
  document.documentElement.style.removeProperty('--dockw');
  if (DOCK_SHIELD) { document.removeEventListener('click', DOCK_SHIELD, true); DOCK_SHIELD = null; }
  reflowRows();
}

// ── Anteprima su card finte, blocco CONDIVISO (v13.65) ───────────────────────
// Nata dentro la sotto-modale degli effetti, estratta perché ora la usa anche il
// PANNELLO: nella tab Mobile la pagina accanto è la versione desktop, quindi gli
// interruttori agirebbero alla cieca (richiesta utente). Una sola implementazione:
// due copie divergerebbero, ed è la stessa ragione per cui le formule dell'aspetto
// sono condivise fra anteprima e pagina.
//   o.key     effetto in modifica; '' = PANORAMICA (il Pannello: nessun effetto
//             singolo, si mostra l'insieme di quelli accesi)
//   o.sfx     variante: '' desktop, '_m' mobile
//   o.lights  funzione che dice quali riquadri disegnare (true = tema chiaro):
//             è una funzione e non un array perché la sotto-modale la rivaluta a
//             ogni cambio di tab tema.
// Ritorna { el, build, paint }. In PANORAMICA tutte le card sono rese ACCESE (o
// bagliore e riflettore non si vedrebbero) e i numeri sono 1 e 5: il primo mostra
// il metallo del podio, il secondo - fuori dal podio, come nelle altre anteprime -
// la tinta dei numeri normali.
function fxPreviewBlock(o){
  var it = currentLang === 'it';
  var key = o.key, sfx = o.sfx || '', all = !o.key;
  // ⚠️ Il riflettore ha config UNICA dalla v13.18: il suffisso di piattaforma non
  // si applica e un eventuale `spot_m` residuo nei dati va ignorato, esattamente
  // come fa `fxCfg` in pagina. Senza questo, chiedere la variante `_m` di una
  // config unica restituiva `undefined` e le formule ci morivano sopra.
  var uni = {};
  SITE_FLAG_ITEMS.forEach(function(f){ if (f.noMob) uni[f.k] = true; });
  var V = function(k){ return SITE_FLAGS[k + (uni[k] ? '' : sfx)]; };
  // ⚠️ In PANORAMICA si escludono gli effetti che quella variante NON ha: il
  // riflettore è `noMob` (config unica dalla v13.18) e nella tab Mobile non compare
  // nemmeno nella lista, quindi mostrarlo nell'anteprima mobile sarebbe una bugia -
  // e il suo invito 'Muovi il puntatore qui' un invito a nulla. 'Al passaggio' era
  // nello stesso caso fino alla v14.21; dalla v14.22 ha la sua variante touch e
  // quindi compare regolarmente anche nella panoramica mobile.
  // La config si legge con tolleranza: una variante può mancare del tutto (p.es.
  // uno `spot_m` mai seminato), e leggerne `.on` alla cieca sarebbe un errore.
  var vOn = function(k){
    if (all && sfx && uni[k]) return false;
    var c = V(k); return !!c && c.on !== false;
  };
  var cards = [], panes = [];
  var wrap = document.createElement('div'); wrap.className = 'fxp-wrap';
  var buildPanes = function(){
  wrap.textContent = ''; cards.length = 0; panes.length = 0;
  o.lights().forEach(function(light){
    // ⚠️ Respiro EXTRA solo per il bagliore (v12.95, richiesta dell'utente): è
    // l'unico effetto che disegna FUORI dalla card (fughe e alone), e col padding
    // ordinario l'anteprima lo tagliava, quindi non si capiva che effetto facesse.
    // Gli altri effetti restano compatti: lo spazio in più sarebbe solo vuoto.
    var pane = document.createElement('div');
    pane.className = 'fxp-pane ' + (light ? 'l' : 'd')
      + ((key === 'glow' || (all && vOn('glow'))) ? ' fxp-airy' : '');
    panes.push({ el:pane, light:light });
    [1, 2].forEach(function(n){
      var c = document.createElement('div'); c.className = 'fxp-card';
      // (il respiro extra del riquadro per il bagliore è sulla classe del pane)
      var strip = document.createElement('span'); strip.className = 'fxp-strip';
      var spot = document.createElement('span'); spot.className = 'fxp-spot';
      // Numeri delle card d'anteprima. Nell'editor del PODIO sono 1 e 2, ORO e
      // ARGENTO (v12.76, richiesta utente; fino alla v12.75 erano 1 e 3, oro e
      // bronzo). L'argento è quello che più ha bisogno d'occhio: ha molte fermate
      // perché a due sole 'sembrava un numero normale', quindi è giusto sia in
      // anteprima. In TUTTI gli altri editor sono posizioni FUORI dal podio (4 e
      // 5): altrimenti l'anteprima mentirebbe, mostrerebbe p.es. l'incisione sui
      // numeri 1-2, che in pagina il podio esclude avendo specificità maggiore
      // (rilievo della verifica v12.64).
      var podEd = (key === 'podium') || (all && n === 1);
      var num = document.createElement('span'); num.className = 'fxp-num';
      num.textContent = String(podEd ? n : (n === 1 ? 4 : 5));
      var body = document.createElement('span');
      var nm = document.createElement('span'); nm.className = 'fxp-name';
      nm.textContent = n === 1 ? 'Fëanor' : 'Fingolfin';
      // Pill etichetta-tipo finta: serve all'editor dei Nomi incisi (l'incisione
      // può riguardare Nome ed etichette separatamente, v12.53).
      var pill = document.createElement('span'); pill.className = 'fxp-pill';
      pill.textContent = 'Noldo';
      nm.appendChild(pill);
      var ds = document.createElement('span'); ds.className = 'fxp-desc';
      body.appendChild(nm); body.appendChild(ds);
      c.appendChild(strip); c.appendChild(spot); c.appendChild(num); c.appendChild(body);
      var rec = { el:c, strip:strip, spot:spot, num:num, name:nm, pill:pill, desc:ds,
                  light:light, first:(n === 1), metal:n, podEd:podEd };
      // Il riflettore segue il puntatore anche NELL'ANTEPRIMA: è l'unico modo di
      // valutarlo senza uscire dalla modale.
      c.addEventListener('pointermove', function(e){
        var r = c.getBoundingClientRect();
        spot.style.setProperty('--spx', (e.clientX - r.left) + 'px');
        spot.style.setProperty('--spy', (e.clientY - r.top) + 'px');
      });
      cards.push(rec); pane.appendChild(c);
    });
    wrap.appendChild(pane);
  });
  };

  function paint(){
    // Tutte le config dalla VARIANTE in modifica (V), non dalla piattaforma
    // corrente: aprendo la tab Mobile da desktop l'anteprima mostra la mobile.
    var g = V('glow'), s = V('spot'), v = V('vig'), pr = V('press'), po = V('podium'),
        nu = V('nums'), hv = V('hov'), pt = V('pat');
    panes.forEach(function(pn){
      // Fondo del riquadro: vignetta e/o trama, gli unici due effetti che vivono
      // sul FONDO e non sulle card. ⚠️ Se ci sono entrambi si impilano in una sola
      // dichiarazione, con la vignetta SOPRA (primo livello) come in pagina: così
      // smorza la trama ai bordi invece di essere smorzata da lei. Il CONFINAMENTO
      // della trama (fuori dalla colonna delle schede e fuori dalla testata) non si
      // può riprodurre qui - il riquadro non ha né una colonna né una testata da
      // scansare - quindi l'anteprima mostra il motivo dappertutto, ed è la nota
      // della manopola 'Sfumatura' a dire dove finirà davvero.
      var bg = [], bs = [], br = [];
      if ((key === 'vig' || all) && vOn('vig')) { bg.push(fxVigBg(v, pn.light)); bs.push('auto'); br.push('no-repeat'); }
      if ((key === 'pat' || all) && vOn('pat')) { bg.push(fxPatBg(pt, pn.light)); bs.push(fxPatSize(pt)); br.push('repeat'); }
      pn.el.style.backgroundImage = bg.length ? bg.join(',') : 'none';
      pn.el.style.backgroundSize = bs.length ? bs.join(',') : '';
      pn.el.style.backgroundRepeat = br.length ? br.join(',') : '';
      // ⚠️ Respiro DINAMICO nell'editor del bagliore (v12.95). Un padding fisso non
      // può bastare: quanto il bagliore esce dalla card dipende dalle manopole, e
      // l'utente aveva segnalato che l'anteprima lo tagliava. Qui si calcola quanto
      // arriva davvero (la fuga esterna sfuma per oamp×1.6, l'alone per aamp) e si
      // riserva quello spazio, con un tetto perché la modale non diventi enorme
      // (oltre ~56px la coda della sfumatura è comunque invisibile).
      if (key === 'glow' || (all && vOn('glow'))) {
        var reach = 0;
        if (g.ps && (g.pl || g.pr)) reach = Math.max(reach, fxTh(g, 'oamp', pn.light) * 1.6);
        if (g.pa) reach = Math.max(reach, fxTh(g, 'aamp', pn.light));
        var pad = Math.min(56, Math.max(26, Math.round(reach * 0.85)));
        pn.el.style.padding = Math.round(pad * 0.72) + 'px ' + pad + 'px';
      }
    });
    cards.forEach(function(rec){
      var cc = fxPreviewCc(rec.light);
      // 'hot' = la card è resa in stato hover (fondo acceso, bagliori attivi).
      // Nell'editor 'Al passaggio' si mostra UNA card accesa e una a riposo: è il
      // confronto che serve, essendo l'effetto proprio la differenza fra i due stati.
      // ⚠️ Per 'hov' la condizione è SOLO `rec.first`: riusare quella del bagliore
      // significherebbe ereditarne la manopola 'Su tutte le card', che con `all`
      // acceso rende accese entrambe le card - e l'anteprima perderebbe proprio il
      // confronto acceso/a riposo che serve a regolare questo effetto.
      var hot = all ? true
        : key === 'hov' ? rec.first
        : key === 'glow' ? (g.all === true || rec.first)
        : key === 'spot';
      // Fondo della card: a card accesa e con l'effetto attivo vale la formula
      // condivisa con la pagina (stessa stringa CSS, così non possono divergere).
      // ⚠️ A effetto SPENTO si resta sull'alpha di RIPOSO anche sulla card 'hot'
      // (v14.22): dacché l'interruttore governa davvero, in pagina il fondo non
      // cambia più al passaggio, e alzarlo qui a 0.18/0.11 sarebbe una bugia. Gli
      // altri effetti legati allo stato hover (bagliore, riflettore) restano invece
      // pilotati da `hot`, che è il loro stato, non il fondo di questo.
      var hovOn = hot && vOn('hov');
      var cardA = rec.light ? 0.05 : 0.10;
      var cardTint = cc;
      if (hovOn) {
        cardA = fxTh(hv, 'op', rec.light);
        cardTint = ccOklchAdjust(cc, fxTh(hv, 'lum', rec.light), fxTh(hv, 'sat', rec.light));
      }
      rec.el.style.background = hovOn ? fxHovBg(hv, rec.light, cc) : 'rgba(' + cc + ',' + cardA + ')';
      // Contorno (v14.33): l'anteprima non lo mostrava affatto, restava sempre quello
      // di riposo - quindi la manopola `bd` non avrebbe avuto riscontro. Si accende
      // sulla card 'hot' solo con effetto E manopola accesi, come in pagina.
      rec.el.style.borderColor = (hovOn && V('hov') && V('hov').bd !== false)
        ? (rec.light ? HOV_BORDER.light_on : HOV_BORDER.dark_on)
        : (rec.light ? HOV_BORDER.light : HOV_BORDER.dark);
      rec.strip.style.background = 'rgba(' + cc + ',0.85)';
      var gOn = vOn('glow') && hot;
      rec.strip.style.boxShadow = (gOn && g.pl) ? fxGlowInner(g, rec.light, cc) : 'none';
      // Stessa composizione delle regole di pagina, lista completa inclusa: se
      // l'anteprima omettesse le voci spente, avrebbe il 'lampo' che la pagina non
      // ha più (ed è proprio nell'anteprima che l'utente lo vedeva).
      rec.el.style.boxShadow = gOn
        ? (fxGlowOuter(g, rec.light, cc) + ',' + fxGlowInnerRight(g, rec.light, cc, g.pr))
        : 'none';
      rec.spot.style.background = fxSpotBg(s, rec.light);
      rec.spot.style.opacity = ((key === 'spot' || all) && vOn('spot')) ? '1' : '0';
      // Nomi incisi: stessa formula delle regole iniettate, per Nome/etichette.
      var press = vOn('press');
      rec.name.style.textShadow = (press && pr.name) ? fxPressShadow(rec.light) : 'none';
      rec.pill.style.textShadow = (press && pr.lab) ? fxPressShadow(rec.light) : 'none';
      var numPress = (press && pr.num) ? fxPressShadow(rec.light) : 'none';
      // Testo della pill reso AA con l'helper del progetto (v12.64): la tinta
      // piena sul proprio fondo velato dava 3.38:1 su un corpo di ~8px, sotto la
      // soglia 4.5:1 del testo piccolo (rilevato da axe). ⚠️ Il fondo va composto
      // per DAVVERO su tre strati (riquadro, card con l'alpha dello stato hot
      // corrente, e velo della pill), non stimato sul solo riquadro: nella v12.64
      // lo stimavo a card ferma e nell'editor del bagliore, dove le card sono
      // accese, il conto risultava sbagliato di quanto bastava a restare sotto
      // soglia (4.19:1 / 4.35:1, rilevati da axe).
      // ⚠️ Con l'effetto 'Al passaggio' attivo lo strato della card non è più la
      // tinta pura a un alpha noto: è la tinta riscritta in OKLCH. Si compone con
      // `cardTint`/`cardA` calcolati sopra, o il conto AA sarebbe su un fondo che
      // non esiste (stessa lezione della v12.75, un passo più in là).
      var pillBgHex = (function(){
        var t = cardTint.split(',').map(Number);
        var base = rec.light ? [245,245,245] : [38,38,38];
        var pillA = rec.light ? 0.10 : 0.26;
        var over = function(a, alpha, b){ return a.map(function(v, i){ return v * alpha + b[i] * (1 - alpha); }); };
        return ccTripletToHex(over(t, pillA, over(t, cardA, base)).map(Math.round).join(','));
      })();
      rec.pill.style.color = ccAaText(ccTripletToHex(cc), pillBgHex, 4.5);
      rec.pill.style.borderColor = 'rgba(' + cc + ',0.8)';
      rec.pill.style.background = 'rgba(' + cc + ',' + (rec.light ? 0.10 : 0.26) + ')';
      // Numero: metallo del podio nell'editor del podio, altrimenti la tinta
      // famiglia contrastata (come in pagina, v12.53).
      if (rec.podEd && vOn('podium')) {
        rec.num.style.backgroundImage = fxPodiumGrad(rec.metal, po, rec.light, PODIUM_GLYPH_FXP);
        rec.num.style.webkitBackgroundClip = 'text';
        rec.num.style.backgroundClip = 'text';
        rec.num.style.color = 'transparent';
        rec.num.style.textShadow = rec.light ? '0 1px 1px rgba(0,0,0,0.22)' : '0 1px 2px rgba(0,0,0,0.6)';
        rec.num.style.filter = fxPodiumFilter(po, rec.light);
      } else {
        rec.num.style.backgroundImage = 'none';
        rec.num.style.webkitBackgroundClip = ''; rec.num.style.backgroundClip = '';
        rec.num.style.textShadow = numPress; rec.num.style.filter = 'none';
        // Stessa formula della pagina (v12.63), con la terna CONCRETA: qui i due
        // temi convivono, quindi var(--ccrgb) non varrebbe. A effetto spento vale
        // il grigio del nome del tema, come fa la regola base in pagina.
        rec.num.style.color = vOn('nums') ? fxNumColor(nu, rec.light, cc)
                                          : (rec.light ? '#373737' : '#d2d2d2');
      }
      rec.desc.textContent = (key === 'spot' || (all && vOn('spot')))
        ? (it ? 'Muovi il puntatore qui' : 'Move the pointer here')
        : (key === 'glow' || key === 'hov')
          // Nella variante touch di 'Al passaggio' non c'è alcun passaggio: il tap
          // applica `:hover` e lo lascia appiccicato, quindi la card è SELEZIONATA.
          ? (hot ? ((key === 'hov' && sfx) ? (it ? 'Card toccata' : 'Tapped card')
                                          : (it ? 'Card attiva (hover)' : 'Active card (hover)'))
                 : (it ? 'Card a riposo' : 'Resting card'))
          : (it ? 'Anteprima' : 'Preview');
    });
  }
  return { el: wrap, build: buildPanes, paint: paint };
} // baseline del tema per la sotto-modale effetti (vedi sotto)
function showFxConfigEditor(key, sfx, onDone){
  if (document.getElementById('fx-modal')) return;
  var it = currentLang === 'it', myL, item = null;
  sfx = sfx || '';
  var vk = key + sfx;                                  // chiave della variante
  var V = function(k){ return SITE_FLAGS[k + sfx]; };  // config di variante
  var vOn = function(k){ return V(k).on !== false; };  // 'acceso' nella variante
  // Catena degli hook lingua: questa modale sta SOPRA la Console,
  // che ha già registrato il suo langRefresh. Lo si conserva (prevL) e lo si
  // RIPRISTINA alla chiusura: azzerarlo lascerebbe il pannello sotto senza L.
  var prevL = langRefresh;
  SITE_FLAG_ITEMS.forEach(function(f){ if (f.k === key) item = f; });
  if (!item) return;
  injectFxEditorCss();
  // In vista divisa la sotto-modale non si apre SOPRA la pagina: si impila
  // nella stessa colonna del Pannello (stessa geometria, dipinta sopra), così
  // 'entrare' in un effetto e 'uscirne' resta un movimento della sola colonna.
  var docked = document.documentElement.classList.contains('fx-dock');
  // Tema del sito all'apertura VERA della sotto-modale. Vive in FX_THEME0 (globale)
  // perché deve SOPRAVVIVERE ai rebuild tecnici (tasto L, cambio di telaio al
  // resize), che chiudono e riaprono l'editor: senza, la riapertura scambierebbe
  // il tema della tab per la baseline e alla chiusura il sito resterebbe scuro.
  var themeAtOpen = FX_THEME0 || document.documentElement.getAttribute('data-theme');
  FX_THEME0 = themeAtOpen;
  // ⚠️ La variante in modifica è quella ATTIVA su questo dispositivo? (v14.23)
  // Se non lo è, la pagina non mostra ciò che si sta cambiando e il riscontro sono
  // le card finte, che vanno tenute visibili anche in vista divisa. Il criterio
  // GENERALIZZA quello della v13.55 ('con la variante mobile l'anteprima resta,
  // perché la pagina accanto è desktop'): quella era un'approssimazione giusta solo
  // sui desktop, mentre su un TABLET TOUCH è il caso opposto - là la pagina mostra
  // la variante touch e a lavorare alla cieca è la tab Desktop.
  var altrove = !item.noMob && sfx !== fxActiveSfx(key);
  var attivaLbl = fxVarLabel(key, !!fxActiveSfx(key), it);
  var inModifLbl = fxVarLabel(key, !!sfx, it);
  var overlay = document.createElement('div'); overlay.id = 'fx-modal';
  overlay.className = 'fab-modal-overlay' + (docked ? ' fxdock' : '')
    + (docked && altrove ? ' fxdock-alt' : '') + (DOCK_RELAYOUT ? ' no-anim' : '');
  var box = document.createElement('div'); box.className = 'fab-modal-box';
  // ⚠️ Lo scorrimento sta in un contenitore INTERNO, non sul box (v12.95). Col box
  // come area di scorrimento, il tasto ×, che è `position:absolute` dentro il box,
  // scorreva via insieme al contenuto e diventava irraggiungibile (misurato: dopo
  // aver scorso in fondo era fuori dal viewport). Spostando lo scorrimento dentro,
  // il × resta ancorato al box e l'anteprima `position:sticky` si appiccica al bordo
  // alto dello scroller.
  if (!docked) { box.style.maxWidth = '440px'; box.style.maxHeight = 'calc(92vh / var(--zoomf, 1))'; }
  box.style.overflow = 'hidden'; box.style.display = 'flex'; box.style.flexDirection = 'column';
  overlay.appendChild(box); document.body.appendChild(overlay);
  var scroller = document.createElement('div');
  scroller.className = 'fx-scroll';
  scroller.style.cssText = 'overflow-y:auto;overscroll-behavior:contain;min-height:0;flex:1 1 auto;margin:0 -0.2rem;padding:0 0.2rem;';
  var close = function(){
    fabDismiss(overlay); if (langRefresh === myL) langRefresh = prevL;
    // In dock la tab tema può aver commutato il tema del SITO: alla chiusura si
    // torna a quello d'apertura (rebuild tecnici esclusi), coerente col 'torna
    // al punto di partenza' della vista divisa. La baseline si azzera solo qui,
    // alla chiusura VERA: i rebuild tecnici la conservano.
    if (docked && !DOCK_RELAYOUT && themeAtOpen && document.documentElement.getAttribute('data-theme') !== themeAtOpen) toggleTheme();
    if (!DOCK_RELAYOUT) FX_THEME0 = null;
    if (typeof onDone === 'function') onDone();
  };
  // Ganci per il cambio di telaio a metà modifica (resize): il Pannello li usa
  // per chiudere e riaprire la sotto-modale conservando effetto e piattaforma.
  overlay._fxKey = key; overlay._fxSfx = sfx; overlay._fxClose = close;
  overlay.addEventListener('click', function(e){ if (e.target === overlay) close(); });
  var cl = document.createElement('button'); cl.className = 'fab-modal-close'; cl.textContent = '×';
  cl.onclick = close; box.appendChild(cl);
  var t = document.createElement('p'); t.style.cssText = 'font-weight:600;font-size:1.02rem;margin:0 0 0.2rem;';
  t.textContent = (it ? item.it : item.en) + (item.noMob ? '' : ' - ' + fxVarLabel(key, !!sfx, it));
  box.appendChild(scroller); scroller.appendChild(t);
  var sub = document.createElement('p'); sub.style.cssText = 'font-size:0.78rem;opacity:0.7;margin:0 0 0.9rem;';
  sub.textContent = (docked && altrove)
    ? (it ? 'La pagina accanto mostra la versione ' + attivaLbl.toLowerCase() + ': le modifiche a \'' + inModifLbl + '\' si vedono qui sotto.'
          : 'The page beside shows the ' + attivaLbl.toLowerCase() + ' version: \'' + inModifLbl + '\' changes show below.')
    : docked
    ? (it ? 'Le modifiche si vedono subito sulla pagina accanto.'
          : 'Changes show immediately on the page beside.')
    : altrove
    ? (it ? 'Su questo schermo è attiva la versione ' + attivaLbl.toLowerCase() + ': le modifiche a \'' + inModifLbl + '\' si vedono qui sotto.'
          : 'This screen uses the ' + attivaLbl.toLowerCase() + ' version: \'' + inModifLbl + '\' changes show below.')
    : (it ? 'Le modifiche si vedono subito qui sotto e sulle card dietro.'
          : 'Changes show immediately below and on the cards behind.');
  scroller.appendChild(sub);

  // ── anteprima. ⚠️ QUANTI riquadri (v12.76, richiesta utente): se l'effetto ha
  // manopole PER TEMA si mostra UN SOLO riquadro, quello del tema in modifica, che
  // cambia con la tab: si vede ciò che si sta modificando e si risparmia spazio
  // verticale. Se invece la config è UNICA per i due temi (riflettore, incisione,
  // alone) restano DUE riquadri, perché lì un solo valore serve entrambi i temi e
  // va controllato su entrambi. Col riquadro singolo l'evidenziazione .fxp-edit
  // della v12.64 non serve più: non c'è nulla da distinguere.
  // Ordine, quando sono due: CHIARO per primo (richiesta utente v12.41), due
  // card ciascuno, SENZA etichette tema (rimosse in v12.41: superflue). Stato
  // delle card PER EFFETTO (v12.42, richiesta utente):
  //  • bagliore: solo la PRIMA card è 'in hover' (così si vede la differenza
  //    off/on); entrambe accese solo con 'Su tutte le card';
  //  • riflettore: entrambe accese, alone visibile (parte centrato, fallback
  //    50%/50%, e segue il puntatore quando ci passi sopra);
  //  • vignettatura: card a riposo, l'effetto sta sul FONDO dei riquadri.
  // Manopole e tab servono già qui: da esse dipende QUANTI riquadri disegnare.
  var knobs = FX_KNOBS[key] || [];
  var hasTh = knobs.some(function(kn){ return kn.th; });
  var kTheme = (document.documentElement.getAttribute('data-theme') === 'light') ? 'l' : 'd';
  // Anteprima dal blocco condiviso col Pannello (v13.65): `lights` è una funzione
  // perché il cambio di tab tema la rivaluta.
  var PV = fxPreviewBlock({ key: key, sfx: sfx, lights: function(){
    return hasTh ? [kTheme === 'l'] : [true, false];
  } });
  var wrap = PV.el, buildPanes = PV.build, paint = PV.paint;
  buildPanes();
  scroller.appendChild(wrap);

  // ── manopole ───────────────────────────────────────────────────────────────
  // Se l'effetto ha manopole PER TEMA (`th`), in testa compaiono due tab
  // Chiaro/Scuro (v12.63, richiesta utente per 'Colore dei numeri'): si edita un
  // tema alla volta e, dalla v12.76, l'anteprima mostra SOLO quel tema. Le
  // manopole senza `th` sono condivise dai due temi.
  var knobsBox = document.createElement('div');
  if (hasTh) {
    var thBar = document.createElement('div');
    thBar.style.cssText = 'display:flex;gap:8px;margin:0 0 0.9rem;';
    var thBtns = {};
    [['l', it ? 'Tema chiaro' : 'Light theme'], ['d', it ? 'Tema scuro' : 'Dark theme']].forEach(function(td){
      var tb = document.createElement('button'); tb.type = 'button'; tb.className = 'fab-modal-confirm';
      tb.style.cssText = 'width:auto;flex:1;margin-top:0;padding:0.38rem 0;';
      tb.textContent = td[1];
      // Cambiando tab si RICOSTRUISCE anche il riquadro d'anteprima (v12.76):
      // ne esiste uno solo e deve mostrare il tema che si sta modificando.
      tb.onclick = function(){
        if (kTheme === td[0]) return;
        kTheme = td[0]; syncTh(); renderKnobs(); buildPanes(); paint();
        // In vista divisa l'anteprima è la pagina: scegliere 'Tema scuro' DEVE
        // mostrare il sito scuro, o si regola alla cieca (richiesta utente,
        // v13.41). Solo in dock: in modale l'anteprima interna segue già la tab.
        if (docked) {
          var want = kTheme === 'l' ? 'light' : 'dark';
          if (document.documentElement.getAttribute('data-theme') !== want) toggleTheme();
        }
      };
      thBtns[td[0]] = tb; thBar.appendChild(tb);
    });
    var syncTh = function(){
      Object.keys(thBtns).forEach(function(k){
        var on = kTheme === k;
        thBtns[k].setAttribute('aria-pressed', String(on));
        // 0.78 e non 0.45 (v12.65): a 0.45 il testo della tab inattiva scendeva a
        // 2.85:1 in chiaro / 3.47:1 in scuro, sotto la soglia 4.5:1 del testo
        // normale. La tab attiva si distingue dal BORDO accento, non dal velo.
        thBtns[k].style.opacity = on ? '1' : '0.78';
        thBtns[k].style.borderColor = on ? 'rgba(154,192,216,0.9)' : '';
      });
      // Niente più evidenziazione del riquadro (v12.76): col tema singolo il
      // riquadro visibile È quello in modifica, non c'è nulla da distinguere.
    };
    // Le tab vanno SOPRA l'anteprima (v12.64): il nesso 'tab selezionata →
    // riquadro evidenziato' si legge solo se il comando precede l'effetto.
    syncTh(); scroller.insertBefore(thBar, wrap);
  }
  scroller.appendChild(knobsBox);
  // Una voce con `dep` è attiva solo se la sua condizione è vera; altrimenti la
  // riga si spegne (semitrasparente e non modificabile), richiesta dell'utente
  // v12.95. Le condizioni riguardano i booleani della config, quindi si rivalutano
  // a ogni renderKnobs (che parte a ogni click su una casella).
  //  • 'on':     l'interruttore dell'effetto: spegne tutto il resto;
  //  • 'inner':  almeno un lato interno acceso;
  //  • 'outer':  'Ai lati' acceso E almeno un lato da cui uscire;
  //  • 'around': 'Intorno alla card' acceso.
  function depOk(d){
    var c = SITE_FLAGS[vk];
    if (!d) return true;
    if (c.on === false) return false;          // 'Attiva' spento => tutto spento
    if (d === 'on') return true;
    if (d === 'inner') return c.pl === true || c.pr === true;
    if (d === 'outer') return c.ps === true && (c.pl === true || c.pr === true);
    if (d === 'around') return c.pa === true;
    return true;
  }
  function renderKnobs(){
  knobsBox.textContent = '';
  knobs.filter(function(kn){ return !kn.th || kn.th === kTheme; }).forEach(function(kn){
    // Intestazione di sezione (v12.76): non è una manopola, solo un titoletto che
    // dice a quale parte del bagliore appartengono le voci che seguono.
    var live = depOk(kn.dep);
    if (kn.sec) {
      var h = document.createElement('p'); h.className = 'fxk-sec' + (live ? '' : ' fxk-off');
      h.textContent = it ? kn.it : kn.en;
      knobsBox.appendChild(h); return;
    }
    var row = document.createElement('div'); row.className = 'fxk-row' + (live ? '' : ' fxk-off');
    var lbl = document.createElement('label'); lbl.className = 'fxk-lbl';
    lbl.textContent = it ? kn.it : kn.en;
    lbl.style.cssText = 'display:flex;align-items:center;min-height:24px;cursor:pointer;';
    row.appendChild(lbl);
    if (kn.t === 'bool') {
      var cb = document.createElement('input'); cb.type = 'checkbox';
      cb.checked = SITE_FLAGS[vk][kn.p] === true;
      cb.style.cssText = 'width:1rem;height:1rem;margin:0;cursor:pointer;';
      var id = 'fxk-' + vk + '-' + kn.p; cb.id = id; lbl.setAttribute('for', id);
      if (!live) cb.disabled = true;
      cb.addEventListener('change', function(){
        SITE_FLAGS[vk][kn.p] = cb.checked;
        // Le caselle di POSIZIONE (e 'Attiva') decidono quali righe sono attive:
        // dopo un cambio si ridisegna l'elenco, così le dipendenze si aggiornano.
        applySiteFlags(); paint(); renderKnobs();
      });
      row.appendChild(cb);
    } else if (kn.t === 'sel') {
      // Manopola a SCELTE (v14.43): un `<select>` con le voci di `kn.opts`. Il
      // valore salvato è la stringa `v`; le etichette sono bilingui come tutto il
      // resto. Dopo il cambio si ridisegna l'elenco, perché una scelta può
      // governare le dipendenze di altre righe (vedi `dep:'edge'`).
      var se = document.createElement('select');
      se.className = 'fxk-sel';
      se.setAttribute('aria-label', it ? kn.it : kn.en);
      (kn.opts || []).forEach(function(o){
        var op = document.createElement('option');
        op.value = o.v; op.textContent = it ? o.it : o.en;
        se.appendChild(op);
      });
      se.value = SITE_FLAGS[vk][kn.p];
      if (!live) se.disabled = true;
      var sid = 'fxk-' + vk + '-' + kn.p; se.id = sid; lbl.setAttribute('for', sid);
      se.addEventListener('change', function(){
        SITE_FLAGS[vk][kn.p] = se.value;
        applySiteFlags(); paint(); renderKnobs();
      });
      row.appendChild(se);
    } else if (kn.t === 'col') {
      // Manopola COLORE (v14.43): `<input type=color>`, il valore salvato è un hex
      // `#rrggbb` (il Worker valida le stringhe ≤32 char, quindi passa così com'è).
      // L'opacità sta in una manopola a parte: qui si scegle solo la TINTA.
      var ci = document.createElement('input'); ci.type = 'color';
      ci.value = SITE_FLAGS[vk][kn.p];
      ci.className = 'fxk-col';
      var cid = 'fxk-' + vk + '-' + kn.p; ci.id = cid; lbl.setAttribute('for', cid);
      if (!live) ci.disabled = true;
      ci.addEventListener('input', function(){
        SITE_FLAGS[vk][kn.p] = ci.value;
        injectFxRules(); paint();
      });
      row.appendChild(ci);
    } else {
      var rng = FX_RANGE[key][kn.p] || [0, 1];
      var val = document.createElement('span'); val.className = 'fxk-val';
      var sl = document.createElement('input'); sl.type = 'range';
      sl.min = String(rng[0]); sl.max = String(rng[1]); sl.step = String(kn.step);
      sl.value = String(SITE_FLAGS[vk][kn.p]);
      sl.setAttribute('aria-label', it ? kn.it : kn.en);
      if (!live) sl.disabled = true;
      var show = function(){
        val.textContent = kn.unit ? (Math.round(SITE_FLAGS[vk][kn.p]) + kn.unit)
                                  : fxR2(SITE_FLAGS[vk][kn.p]).toFixed(2);
      };
      sl.addEventListener('input', function(){
        SITE_FLAGS[vk][kn.p] = fxClamp(key, kn.p, parseFloat(sl.value));
        show(); injectFxRules(); paint();
      });
      // Doppio clic = valore PREDEFINITO della manopola (v13.38; su TUTTO lo
      // slider, binario compreso, dalla v13.39). Il default vive in
      // SITE_FLAGS_DEFAULT sotto la chiave BASE dell'effetto: le varianti _m
      // e le chiavi per-tema condividono il default della chiave omonima.
      var toDefault = function(){
        var dEff = SITE_FLAGS_DEFAULT[key];
        var dv = dEff ? dEff[kn.p] : undefined;
        if (typeof dv !== 'number') return;
        SITE_FLAGS[vk][kn.p] = dv; sl.value = String(dv);
        show(); injectFxRules(); paint();
      };
      sl.addEventListener('dblclick', toDefault);
      fxGuardSlider(sl, toDefault);
      show(); row.appendChild(val); row.appendChild(sl);
    }
    if (kn.nit) {
      var nt = document.createElement('p'); nt.className = 'fxk-note';
      nt.textContent = it ? kn.nit : kn.nen;
      // La nota è la DESCRIZIONE del controllo: senza aria-describedby resterebbe
      // un paragrafo fratello, che gli screen reader non annunciano col controllo
      // (v12.65). Vale per le note di tutte le manopole, non solo delle nuove.
      nt.id = 'fxk-note-' + vk + '-' + kn.p;
      var ctl = row.querySelector('input');
      if (ctl) ctl.setAttribute('aria-describedby', nt.id);
      row.appendChild(nt);
    }
    knobsBox.appendChild(row);
  });
  }
  renderKnobs();
  paint();

  var foot = document.createElement('div'); foot.style.cssText = 'display:flex;gap:10px;margin-top:0.9rem;';
  var rst = document.createElement('button'); rst.className = 'fab-modal-confirm';
  rst.style.cssText = 'width:auto;flex:1;margin-top:0;';
  rst.textContent = it ? 'Ultimo salvato' : 'Last saved';
  rst.title = it ? 'Riporta questo effetto all\'ultimo valore salvato sul repo'
                 : 'Restore this effect to the last value saved to the repo';
  rst.onclick = function(){
    SITE_FLAGS[vk] = normSiteFlags(SITE_FLAGS_SAVED)[vk];
    // La riapertura è un rebuild TECNICO (come L e il resize), non una chiusura
    // dell'utente: senza il flag, in dock close() riporterebbe il sito al tema
    // d'apertura azzerando la baseline FX_THEME0, e la tab tornerebbe con lui
    // (v13.43). Qui si resettano SOLO i valori: tema e tab restano dove sono.
    applySiteFlags();
    dockRebuild(function(){ close(); showFxConfigEditor(key, sfx, onDone); });
  };
  // 'Predefiniti' (v14.11, richiesta dell'utente): riporta l'effetto ai valori
  // STANDARD, cioè quelli con cui è nato - la resa 'attuale' da cui si parte a
  // sperimentare. Complementare a 'Ultimo salvato', che riporta a ciò che sta sul
  // repo: dopo un salvataggio i due coincidono, prima no. Il doppio clic su un
  // singolo slider fa già la stessa cosa per la SUA manopola (v13.38): questo la fa
  // per tutte, interruttore compreso.
  // ⚠️ ETICHETTA 'Azzera'/'Reset' dalla v14.80 (segnalato dall'utente): 'Predefiniti'
  // stava dentro il pulsante a pelo. Misurato col font reale a 390px: spazio utile
  // 88,5px, 'Predefiniti' 87,3 (1,2px di margine), 'Azzera' 54,3. Scartata
  // 'Standard' (75,1: ci sta, ma dice uno stato dove le altre due dicono un'azione).
  var def = document.createElement('button'); def.className = 'fab-modal-confirm';
  def.style.cssText = 'width:auto;flex:1;margin-top:0;';
  def.textContent = it ? 'Azzera' : 'Reset';
  def.title = it ? 'Riporta questo effetto ai valori standard del sito'
                 : 'Restore this effect to the site default values';
  def.onclick = function(){
    SITE_FLAGS[vk] = normFxEffect(key, SITE_FLAGS_DEFAULT[key]);
    applySiteFlags();
    dockRebuild(function(){ close(); showFxConfigEditor(key, sfx, onDone); });
  };
  var ok = document.createElement('button'); ok.className = 'fab-modal-confirm';
  ok.style.cssText = 'width:auto;flex:1;margin-top:0;'; ok.textContent = it ? 'Chiudi' : 'Close';
  ok.onclick = close;
  foot.appendChild(rst); foot.appendChild(def); foot.appendChild(ok); box.appendChild(foot);
  var hint = document.createElement('p');
  hint.style.cssText = 'font-size:0.72rem;opacity:0.6;margin:0.7rem 0 0;';
  hint.textContent = it ? 'Per rendere le modifiche definitive, salva dalla Console.'
                        : 'To make changes permanent, save from the Console.';
  box.appendChild(hint);
  // L a modale aperta: prima si ricostruisce il PANNELLO sotto nella nuova lingua
  // (prevL, il suo hook), poi questa sotto-modale sopra di lui. Senza il passo
  // intermedio il pannello resterebbe nella lingua vecchia dietro la sotto-modale
  // aggiornata. Le manopole non si perdono: vivono in SITE_FLAGS, globale.
  myL = function(){
    if (!document.body.contains(overlay)){ if (langRefresh === myL) langRefresh = prevL; return; }
    overlay.remove();
    if (typeof prevL === 'function') prevL();
    showFxConfigEditor(key, sfx, onDone);
  };
  langRefresh = myL;
}
function showSiteFlagsEditor(initState){
  if (document.getElementById('fab-modal')) return;
  var it = currentLang === 'it', myL;
  injectFxEditorCss(); // .fx-gear delle righe regolabili
  // Vista divisa se c'è spazio (colonna ~400px + pagina ≥ ~660px di layout);
  // sotto soglia, la modale di sempre. La scelta è fatta QUI, all'apertura: il
  // cambio a metà strada lo gestisce il listener di resize più sotto.
  var docked = dockAvailable();
  var overlay = document.createElement('div'); overlay.id = 'fab-modal';
  overlay.className = 'fab-modal-overlay' + (docked ? ' fxdock' : '') + (DOCK_RELAYOUT ? ' no-anim' : '');
  var box = document.createElement('div'); box.className = 'fab-modal-box';
  if (!docked) { box.style.maxWidth = '460px'; box.style.maxHeight = 'calc(90vh / var(--zoomf, 1))'; }
  box.style.overflowY = 'auto';
  overlay.appendChild(box); document.body.appendChild(overlay);
  // In dock NIENTE lockPageScroll: la pagina è l'anteprima e deve restare viva.
  if (docked) dockEngage(); else lockPageScroll(true);
  var onRs;
  var close = function(){
    fabDismiss(overlay);
    window.removeEventListener('resize', onRs);
    if (docked) {
      dockRelease();
      // 'Torna al punto di partenza se non si salva' (scelta utente): chiudere
      // la colonna senza salvare ripristina l'ultimo salvato. Dopo un
      // salvataggio riuscito SITE_FLAGS_SAVED è già sincronizzato, quindi il
      // ripristino è un no-op. Saltato nei rebuild tecnici (DOCK_RELAYOUT).
      if (!DOCK_RELAYOUT) { SITE_FLAGS = normSiteFlags(SITE_FLAGS_SAVED); applySiteFlags(); reflowRows(); }
    } else lockPageScroll(false);
    if (langRefresh === myL) langRefresh = null;
  };
  // Cambio di telaio a metà modifica: se la soglia viene attraversata, chiudi e
  // riapri nello stesso stato (tab, scroll, sotto-modale aperta). Le regolazioni
  // non salvate vivono in SITE_FLAGS, globale: sopravvivono da sé.
  onRs = function(){
    clearTimeout(onRs._t);
    onRs._t = setTimeout(function(){
      if (!document.body.contains(overlay)) return;
      if (dockAvailable() === docked) return;
      var st = { scroll: box.scrollTop, tab: tab };
      var fx = document.getElementById('fx-modal');
      var fxSt = fx ? { key: fx._fxKey, sfx: fx._fxSfx } : null;
      dockRebuild(function(){
        if (fx) fx._fxClose();
        close();
        showSiteFlagsEditor(st);
        if (fxSt) {
          var pn = document.getElementById('fab-modal');
          showFxConfigEditor(fxSt.key, fxSt.sfx, function(){
            if (pn && pn._renderRows) pn._renderRows(); // risincronizza le checkbox
          });
        }
      });
    }, 180);
  };
  // ⚠️⚠️ USCIRE senza salvare = ANNULLA, per OGNI via d'uscita (richiesta dell'utente,
  // 2026-08-26: *la chiusura con la × deve equivalere a un clic su Annulla*). Prima il
  // ripristino stava dentro `close`, ma nel solo ramo `docked`: nella modale classica la
  // × lasciava in vigore le modifiche provate, che restavano in pagina fino al reload
  // senza che nessuno le avesse salvate. Qui il ripristino è esplicito e vale per la ×,
  // per il clic sul velo e per Esc, che passa dalla × (vedi il gestore dei tasti).
  // ⚠️ NON si sposta dentro `close`: là passano anche i rebuild TECNICI (cambio di
  // telaio, cambio lingua), dove le modifiche in corso devono sopravvivere.
  // ⚠️ `normSiteFlags` e non una copia grezza: SITE_FLAGS_SAVED può venire da un file
  // dati vecchio (flag booleani), e rimetterlo così com'è lascerebbe un booleano dove il
  // codice si aspetta l'oggetto con le manopole.
  var annulla = function(){ SITE_FLAGS = normSiteFlags(SITE_FLAGS_SAVED); applySiteFlags(); reflowRows(); close(); };
  window.addEventListener('resize', onRs);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) annulla(); });
  var cl = document.createElement('button'); cl.className = 'fab-modal-close'; cl.textContent = '×'; cl.onclick = annulla; box.appendChild(cl);
  var t = document.createElement('p'); t.style.cssText = 'font-weight:600;font-size:1.05rem;margin:0 0 0.2rem;';
  // 'Console' dal 2026-08-28 (rinominata dall'utente; era 'Pannello di controllo'
  // dalla v12.42, prima 'Feature flag'). Il nome vecchio conteneva quello del Pannello
  // del FAB, che è un'altra cosa ed è dei visitatori: ogni abbreviazione li faceva
  // collidere, ed è costata due volte. Uguale nelle due lingue, quindi niente ternario.
  t.textContent = 'Console'; box.appendChild(t);
  var sub = document.createElement('p'); sub.style.cssText = 'font-size:0.8rem;opacity:0.7;margin:0 0 1rem;';
  sub.textContent = it ? 'Le impostazioni valgono per tutti i visitatori.' : 'Settings apply to every visitor.';
  box.appendChild(sub);
  // ── CONFIG PER-PIATTAFORMA (v12.53, richiesta utente) ──────────────────────
  // Da DESKTOP: due tab in alto, 'Desktop' e 'Mobile', per governare le due
  // varianti separatamente. Da MOBILE (≤768px): niente tab, si governa SOLO la
  // parte mobile. La voce Modalità XL vive nella sola tab Desktop (per la regola
  // v12.43 il flag è desktop/tablet-only). ⚠️ Dalla v12.64 le righe sono compatte
  // e senza didascalie su TUTTE le piattaforme, non solo su mobile.
  var isMob = isMobileViewport();
  var tab = isMob ? 'm' : ((initState && initState.tab) || 'd');
  var tabsBar = null, tabBtns = {};
  if (!isMob) {
    tabsBar = document.createElement('div');
    tabsBar.style.cssText = 'display:flex;gap:8px;margin:0 0 1rem;';
    [['d', 'Desktop'], ['m', 'Mobile']].forEach(function(td){
      var tb = document.createElement('button'); tb.type = 'button'; tb.className = 'fab-modal-confirm';
      tb.style.cssText = 'width:auto;flex:1;margin-top:0;padding:0.4rem 0;';
      tb.textContent = td[1];
      tb.setAttribute('aria-pressed', String(tab === td[0]));
      tb.onclick = function(){ if (tab !== td[0]) { tab = td[0]; syncTabs(); renderRows(); syncPreview(); syncVarWarn(); } };
      tabBtns[td[0]] = tb; tabsBar.appendChild(tb);
    });
    box.appendChild(tabsBar);
  }
  // ── Anteprima della variante MOBILE nel Pannello (v13.65, richiesta utente) ──
  // In tab Mobile la pagina (che è desktop, sia in vista divisa sia dietro la
  // modale) non mostra nulla di ciò che si sta cambiando: accendere e spegnere gli
  // interruttori era un lavoro alla cieca. Qui compare la stessa anteprima delle
  // sotto-modali - blocco CONDIVISO, non una copia - in modalità PANORAMICA: un
  // riquadro nel tema corrente, tutte le card accese, numeri 1 e 5 (metallo del
  // podio e tinta dei numeri normali). Solo da desktop: da mobile il Pannello non
  // ha tab e la pagina è già quella giusta.
  var PVM = null;
  if (!isMob) {
    PVM = fxPreviewBlock({ key: '', sfx: '_m', lights: function(){
      return [document.documentElement.getAttribute('data-theme') === 'light'];
    } });
    box.appendChild(PVM.el);
  }
  // La classe `fxdock-alt` serve DUE volte: scavalca la regola che in vista divisa
  // nasconde le anteprime, e dice 'in questa colonna si lavora su una variante che
  // la pagina non mostra'. ⚠️ Qui la condizione resta la TAB e non `fxActiveSfx`,
  // perché la panoramica copre TUTTI gli effetti insieme e la variante attiva è
  // per-effetto: da un desktop la tab Mobile non mostra nulla di ciò che si vede in
  // pagina, che è il caso per cui l'anteprima esiste. Il caso per-effetto è servito
  // dalla sotto-modale, che sa di quale effetto si tratta.
  function syncPreview(){
    if (!PVM) return;
    var on = tab === 'm';
    PVM.el.style.display = on ? '' : 'none';
    overlay.classList.toggle('fxdock-alt', on);
    if (on) { PVM.build(); PVM.paint(); }
  }
  function syncTabs(){
    if (!tabsBar) return;
    Object.keys(tabBtns).forEach(function(k){
      var on = tab === k;
      tabBtns[k].setAttribute('aria-pressed', String(on));
      tabBtns[k].style.opacity = on ? '1' : '0.78'; // vedi nota sulle tab tema
      tabBtns[k].style.borderColor = on ? 'rgba(154,192,216,0.9)' : '';
    });
  }
  syncTabs();
  // Una riga per flag, LAYOUT UNIFORME (richiesta utente, v12.40): checkbox
  // acceso/spento a sinistra per TUTTI gli effetti; per quelli REGOLABILI (f.cfg)
  // in più l'icona a due cursori sul LATO DESTRO della riga, che apre la
  // sotto-modale. Il cambio si applica SUBITO (le card dietro si aggiornano, se
  // la variante in modifica è quella della piattaforma corrente).
  var rowsBox = document.createElement('div');
  box.appendChild(rowsBox);
  function renderRows(){
    rowsBox.textContent = '';
    SITE_FLAG_ITEMS.forEach(function(f){
      if ((f.k === 'zoomBig' || f.noMob) && tab === 'm') return; // XL e Riflettore: solo nella tab Desktop
      // ⚠️ Senza tab il suffisso è PER-RIGA e vale la variante ATTIVA (v14.23): i
      // due criteri (larghezza per cinque effetti, puntatore per quelli in FX_PTR)
      // possono dare risposte diverse sullo stesso dispositivo, e un suffisso unico
      // ne avrebbe sbagliata almeno una. Con le tab decide la tab, come sempre.
      var sfx = isMob ? fxActiveSfx(f.k) : (tab === 'm' ? '_m' : '');
      var vk = (f.k === 'zoomBig') ? f.k : f.k + sfx;
      var row = document.createElement('div');
      row.style.cssText = 'display:grid;grid-template-columns:auto 1fr auto;gap:0.55rem;align-items:center;margin:0 0 0.62rem;';
      var cb = document.createElement('input'); cb.type = 'checkbox';
      cb.checked = (SITE_FLAGS[vk] && typeof SITE_FLAGS[vk] === 'object') ? SITE_FLAGS[vk].on !== false : !!SITE_FLAGS[vk];
      cb.id = 'sf-' + vk;
      cb.style.cssText = 'margin:0;width:1rem;height:1rem;flex:none;cursor:pointer;';
      cb.addEventListener('change', function(){
        // Flag a oggetto: si tocca solo l'interruttore, le manopole restano.
        if (SITE_FLAGS[vk] && typeof SITE_FLAGS[vk] === 'object') SITE_FLAGS[vk].on = cb.checked;
        else SITE_FLAGS[vk] = cb.checked;
        applySiteFlags(); reflowRows();
        // In tab Mobile la pagina non cambia: il riscontro è l'anteprima qui sopra.
        // Si RICOSTRUISCE (non solo ridipinge) perché il respiro del riquadro e la
        // classe .fxp-airy dipendono da quali effetti sono accesi.
        if (PVM && tab === 'm') { PVM.build(); PVM.paint(); }
        // Il flag XL cambia lo zoom (e quindi la soglia del dock) SENZA un
        // resize: si ripassa dal ricalcolo del telaio (no-op negli altri casi).
        if (typeof onRs === 'function') onRs();
      });
      // Solo il nome: le didascalie sono state tolte ovunque (v12.64, richiesta
      // utente); il pannello è una lista pulita di interruttori.
      // La label copre l'intera colonna centrale ed è alta almeno 24px: insieme
      // alla checkbox forma un bersaglio conforme a WCAG 2.2 (2.5.8) anche dove
      // la casella nativa resta di 16px (v12.75).
      var txt = document.createElement('label'); txt.setAttribute('for', cb.id);
      txt.style.cssText = 'cursor:pointer;font-size:0.92rem;font-weight:600;display:flex;align-items:center;min-height:24px;';
      txt.textContent = it ? f.it : f.en;
      row.appendChild(cb); row.appendChild(txt);
      if (f.cfg) {
        var gear = document.createElement('button'); gear.type = 'button'; gear.className = 'fx-gear';
        gear.appendChild(svgNodo(FX_SLIDERS_SVG));
        gear.setAttribute('aria-label', (it ? 'Regola: ' : 'Adjust: ') + (it ? f.it : f.en));
        gear.title = it ? 'Regolazioni' : 'Settings';
        gear.onclick = function(){
          // Al ritorno la checkbox si riallinea: nella sotto-modale c'è lo stesso
          // interruttore ('Effetto attivo') e può essere stato cambiato lì.
          showFxConfigEditor(f.k, sfx, function(){
            cb.checked = SITE_FLAGS[vk].on !== false; reflowRows();
            if (PVM && tab === 'm') { PVM.build(); PVM.paint(); }
          });
        };
        row.appendChild(gear);
      }
      rowsBox.appendChild(row);
    });
  }
  // ── Avviso 'stai regolando una versione che qui non si vede' (v14.23) ────────
  // Serve solo QUANDO CI SONO LE TAB: senza tab il pannello regola già la variante
  // attiva riga per riga, quindi non c'è nulla da avvertire. ⚠️ Le voci in mismatch
  // si contano una per una, perché i due criteri (larghezza / puntatore) possono
  // dividere la lista: su un tablet touch, in tab Desktop, l'unica voce senza
  // riscontro in pagina è quella in FX_PTR. Per questo l'avviso NON sta sulle tab
  // (nessuna delle due sarebbe 'quella che vedi') né sulle righe (la lista va tenuta
  // pulita, regola della v12.64), ma qui in fondo, accanto all'avviso dello zoom.
  var varWarn = document.createElement('p');
  varWarn.style.cssText = 'font-size:0.76rem;opacity:0.8;margin:0 0 0.9rem;padding:0.5rem 0.6rem;border-left:2px solid rgba(200,162,74,0.8);';
  box.appendChild(varWarn);
  function syncVarWarn(){
    var tutte = [], fuori = [];
    if (!isMob) SITE_FLAG_ITEMS.forEach(function(f){
      if (f.k === 'zoomBig' || f.noMob) return;
      tutte.push(f);
      if ((tab === 'm' ? '_m' : '') !== fxActiveSfx(f.k)) fuori.push(it ? f.it : f.en);
    });
    varWarn.style.display = fuori.length ? '' : 'none';
    if (!fuori.length) return;
    var lbl = (tab === 'm' ? (it ? 'mobile' : 'mobile') : (it ? 'desktop' : 'desktop'));
    varWarn.textContent = (fuori.length === tutte.length)
      ? (it ? 'Stai regolando la versione ' + lbl + ': su questo schermo è attiva l\'altra, quindi il riscontro è l\'anteprima qui sopra e non la pagina.'
            : 'You are editing the ' + lbl + ' version: this screen uses the other one, so the preview above is the reference, not the page.')
      : (it ? 'Su questo schermo ' + fxListaIt(fuori) + ' non segue questa tab: le modifiche si vedono nell\'anteprima della voce, non in pagina.'
            : 'On this screen ' + fuori.join(', ') + ' does not follow this tab: changes show in that item\'s own preview, not on the page.');
  }
  renderRows();
  syncPreview();
  syncVarWarn();
  overlay._renderRows = function(){ renderRows(); syncPreview(); syncVarWarn(); }; // cambio di telaio (onRs)
  // Avviso se la preferenza personale di zoom sta scavalcando il flag: senza,
  // sembrerebbe che l'interruttore 'non funzioni'.
  var mine = LS.getItem(ZOOM_LS_KEY);
  if (mine !== null) {
    var warn = document.createElement('p');
    warn.style.cssText = 'font-size:0.76rem;opacity:0.8;margin:0 0 0.9rem;padding:0.5rem 0.6rem;border-left:2px solid rgba(200,162,74,0.8);';
    // Avviso BREVE su entrambe le piattaforme (v12.64): la versione lunga di
    // desktop è stata abbandonata insieme alle didascalie.
    var xl = mine === '1';
    warn.textContent = it
      ? ('La tua preferenza personale di dimensione UI (' + (xl ? 'XL' : 'normale') + ', tasto Z o tocco lungo sul FAB) ha la precedenza sull\'impostazione globale.')
      : ('Your personal UI size preference (' + (xl ? 'XL' : 'standard') + ', Z key or long-press on the FAB) takes precedence over the global setting.');
    box.appendChild(warn);
  }
  var foot = document.createElement('div'); foot.style.cssText = 'display:flex;gap:10px;margin-top:1.1rem;';
  var cancel = document.createElement('button'); cancel.className = 'fab-modal-confirm';
  cancel.style.cssText = 'width:auto;flex:1;margin-top:0;'; cancel.textContent = it ? 'Annulla' : 'Cancel';
  // Stessa funzione della × e del velo: le tre vie d'uscita senza salvataggio fanno
  // la stessa cosa, invece di somigliarsi. Perché usi `normSiteFlags` e non una copia
  // grezza sta scritto dove `annulla` è definita.
  cancel.onclick = annulla;
  var save = document.createElement('button'); save.className = 'fab-modal-confirm';
  save.style.cssText = 'width:auto;flex:1;margin-top:0;'; save.textContent = it ? 'Salva' : 'Save';
  save.onclick = function(){
    save.disabled = true; save.style.opacity = '0.4';
    saveSiteFlagsToRepo(it ? 'aspetto: console' : 'appearance: console').then(function(res){
      if (res.ok){ SITE_FLAGS_SAVED = JSON.parse(JSON.stringify(SITE_FLAGS)); showToast(it ? '✓ Salvato' : '✓ Saved', false); close(); }
      else showToast((it ? '✗ Salvataggio fallito: ' : '✗ Save failed: ') + (res.reason || ''), true);
    }).finally(function(){ save.disabled = false; save.style.opacity = ''; });
  };
  foot.appendChild(cancel); foot.appendChild(save); box.appendChild(foot);
  if (initState && initState.scroll) box.scrollTop = initState.scroll;
  // L: ricostruisce nella nuova lingua conservando lo scroll (anti-jitter); lo
  // stato dei flag non salvati vive in SITE_FLAGS, globale, quindi non si perde.
  myL = function(){ if (!document.body.contains(overlay)){ if (langRefresh === myL) langRefresh = null; return; } var sc = box.scrollTop; dockRebuild(function(){ close(); showSiteFlagsEditor({ scroll: sc, tab: tab }); }); };
  langRefresh = myL;
}

function showAdminChoiceModal() {
  if (document.getElementById('fab-modal')) return;
  var it = currentLang === 'it';
  var overlay = document.createElement('div');
  overlay.id = 'fab-modal'; overlay.className = 'fab-modal-overlay';
  var box = document.createElement('div'); box.className = 'fab-modal-box';
  overlay.appendChild(box); document.body.appendChild(overlay);
  lockPageScroll(true);
  var close = function(){ fabDismiss(overlay); lockPageScroll(false); };
  overlay.addEventListener('click', function(e){ if (e.target === overlay) close(); });
  var cl = document.createElement('button'); cl.className = 'fab-modal-close'; cl.textContent = '×'; cl.onclick = close;
  var t = document.createElement('p'); t.textContent = it ? 'Area admin' : 'Admin area';
  var b1 = document.createElement('button'); b1.className = 'fab-modal-confirm';
  b1.textContent = it ? 'Modifica personaggi' : 'Edit characters';
  b1.onclick = function(){ close(); showAdminEditor(); };
  var b2 = document.createElement('button'); b2.className = 'fab-modal-confirm';
  b2.textContent = it ? 'Modifica colori' : 'Edit colours';
  b2.onclick = function(){ close(); showColorEditor(); };
  // Statistiche: non riguardano più solo i colori, quindi vivono qui (non
  // nell'editor colori). Chiude il bivio e apre la modale stats (standalone).
  var b3 = document.createElement('button'); b3.className = 'fab-modal-confirm';
  b3.textContent = it ? 'Statistiche' : 'Stats';
  b3.onclick = function(){ close(); showColorStats(); };
  // Micro-aggiustamenti icone-badge (dalla v11.33): margin/nudge/scale per icona.
  var b4 = document.createElement('button'); b4.className = 'fab-modal-confirm';
  // A capo forzato dopo 'aggiustamenti' (richiesta utente): riga1 Micro-aggiustamenti,
  // riga2 icone badge.
  b4.replaceChildren(it ? 'Micro-aggiustamenti' : 'Badge-icon', document.createElement('br'), it ? 'icone badge' : 'micro-tuning');
  b4.onclick = function(){ close(); showBadgeAdjustEditor(); };
  // Console (dalla v12.24, allora 'Feature flag'): governa l'ASPETTO del sito
  // (effetti grafici + modalità ingrandita) per tutti i visitatori.
  var b5 = document.createElement('button'); b5.className = 'fab-modal-confirm';
  b5.textContent = 'Console';
  b5.onclick = function(){ close(); showSiteFlagsEditor(); };
  box.appendChild(cl); box.appendChild(t); box.appendChild(b1); box.appendChild(b2); box.appendChild(b3); box.appendChild(b4); box.appendChild(b5);
}
function ccTheme(){ return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
// Salvataggio condiviso dell'editor colori: committa dati (con eventuali
// cardcolor riassegnati) + la config CARDCOLORS, SENZA bumpare la versione
// (keepVersion). Ritorna la Promise di doCommit.
function saveColorsToRepo(msg){ return doCommit(msg, dati, CARDCOLORS, true); }
// Salvataggio dei micro-aggiustamenti icone-badge: committa dati + badgeAdjust,
// SENZA bumpare la versione (keepVersion), come i colori, i flag di sito e il
// riordino. Il Worker scrive `var badgeAdjust` in dati.js.
// ⚠️ Fino alla 2.34 di Terramare questo salvataggio bumpava, ed era l'unico dei
// quattro a farlo: istruzione dell'utente, che vuole il bump sui soli CONTENUTI
// (*riordinare i personaggi, cambiare i colori e modificare i micro-aggiustamenti
// non dovrebbe causare un bump di versione*).
function saveBadgeAdjustToRepo(msg){ return doCommit(msg, dati, null, true, BADGE_ADJUST); }
function baInjectEditorCss(){
  if (document.getElementById('ba-editor-css')) return;
  var css = [
    '.ba-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 0.7rem;}',
    '.ba-chip{position:relative;display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border:1px solid rgba(128,128,128,0.35);border-radius:8px;background:transparent;color:inherit;font:inherit;font-size:0.8rem;cursor:pointer;white-space:nowrap;}',
    '.ba-chip:hover{border-color:rgba(128,128,128,0.6);}',
    '.ba-chip.on{border-color:#c8a24a;box-shadow:inset 0 0 0 1px #c8a24a;background:rgba(200,162,74,0.14);}',
    '.ba-grp{font-size:0.62rem;font-weight:700;background:#c8a24a;color:#1a1a1a;border-radius:20px;padding:0 5px;}',
    '.ba-selhead{font-size:0.86rem;margin:0 0 0.7rem;}',
    // Corpo: campi a SINISTRA (colonna stretta), anteprime a DESTRA (impilate).
    '.ba-body{display:grid;grid-template-columns:270px minmax(0,1fr);gap:20px;align-items:start;}',
    '@media (max-width:640px){.ba-body{grid-template-columns:1fr;}}',
    '.ba-fields{display:flex;flex-direction:column;gap:0.65rem;}',
    '.ba-ftop{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:3px;}',
    '.ba-fname{font-size:0.82rem;font-weight:600;}',
    '.ba-fval{font-size:0.82rem;font-weight:700;color:#c8a24a;font-family:ui-monospace,monospace;flex:none;}',
    'html[data-theme="light"] .ba-fval{color:#1f5562;}',
    '.ba-fline{display:flex;align-items:center;gap:12px;}',
    // Input numerico corto, a SINISTRA (bordi sx allineati in colonna). Selettore
    // .ba-fline input.ba-num per scavalcare il globale .fab-modal-box input[type=text].
    '.ba-fline input.ba-num{width:76px;flex:none;box-sizing:border-box;padding:5px 7px;border:1px solid rgba(128,128,128,0.45);border-radius:6px;background:transparent;color:inherit;font-family:ui-monospace,monospace;font-size:0.8rem;text-align:right;}',
    // Slider a DESTRA, con TRACCIA visibile e pallino accento (non piu il tondo blu di default del browser).
    '.ba-fline input[type=range]{-webkit-appearance:none;appearance:none;flex:1;min-width:60px;height:5px;border-radius:5px;background:rgba(128,128,128,0.32);outline:none;margin:0;}',
    '.ba-fline input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#c8a24a;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,0.3);}',
    '.ba-fline input[type=range]::-moz-range-thumb{width:16px;height:16px;border:none;border-radius:50%;background:#c8a24a;cursor:pointer;}',
    'html[data-theme="light"] .ba-fline input[type=range]::-webkit-slider-thumb{background:#1f5562;}',
    'html[data-theme="light"] .ba-fline input[type=range]::-moz-range-thumb{background:#1f5562;}',
    '.ba-reset{margin-top:0.55rem;font-size:0.74rem;background:none;border:none;color:inherit;opacity:0.7;cursor:pointer;text-decoration:underline;padding:0;}',
    '.ba-reset:hover{opacity:1;}',
    // Anteprime impilate (scuro sopra, chiaro sotto), un po piu grandi.
    '.ba-pvgrid{display:flex;flex-direction:column;gap:10px;}',
    // Anteprima a dimensione REALE (font 1.5rem, badge 0.92em, gap 0.32em come
    // sulla pagina): senza il gap i badge si ammucchiavano/sovrapponevano.
    '.ba-pane{border-radius:10px;padding:11px 16px 14px;border:1px solid rgba(128,128,128,0.28);min-width:0;overflow:hidden;isolation:isolate;}',
    '.ba-pane.dark{background:#242424;color:#e9e7e1;--ba-arw:#ffd24d;}',
    '.ba-pane.light{background:#f1f1f1;color:#1d1d1d;--ba-arw:#d2401e;}',
    '.ba-pv-row{position:relative;display:flex;align-items:center;gap:0.32em;padding:8px 0;min-width:0;font-size:1.5rem;}',
    '.ba-pv-row+.ba-pv-row{border-top:1px solid rgba(128,128,128,0.2);}',
    // Linea di mezzo rossa tratteggiata (1px) a metà del MAIUSCOLETTO del nome
    // (--mid calcolata a runtime): riferimento per allineare otticamente le icone.
    '.ba-pv-row::after{content:"";position:absolute;left:0;right:0;top:var(--mid,50%);height:1px;transform:translateY(calc(-50% - 1px));background:repeating-linear-gradient(to right,#e02424 0 6px,transparent 6px 10px);pointer-events:none;z-index:-1;}',
    // Simbolo di genere in coda all\'anteprima (staccato come sulla card).
    '.ba-pv-badges .genere-svg{margin-left:0.22em;}',
    '.ba-pv-name{font-family:Cinzel,Georgia,serif;font-size:1em;font-weight:600;flex:none;letter-spacing:0.02em;}',
    '.ba-pv-badges{display:inline-flex;align-items:center;gap:0.32em;font-size:1em;min-width:0;}',
    '.ba-pv-ico{width:auto;object-fit:contain;vertical-align:middle;}',
    // Indicatore icona in modifica: una FRECCIA (testa + stelo) sotto il badge,
    // grande e contrastata (oro su scuro, vermiglio su chiaro).
    '.ba-pv-sel{position:relative;display:inline-flex;align-items:center;}',
    '.ba-pv-sel::before{content:"";position:absolute;left:50%;bottom:-15px;transform:translateX(-50%);width:3px;height:6px;border-radius:1px;background:var(--ba-arw,#ffd24d);}',
    '.ba-pv-sel::after{content:"";position:absolute;left:50%;bottom:-11px;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:8px solid var(--ba-arw,#ffd24d);}',
    '.ba-pv-empty{font-size:0.8rem;opacity:0.6;padding:0.4rem 0;}',
    // Tabella riepilogo SEMPRE visibile in basso: riempie lo spazio residuo della
    // modale (flex:1) e scorre da sola; la modale non scrolla (niente doppio scroll).
    '.ba-tablewrap{flex:1 1 auto;min-height:0;margin-top:0.8rem;border:1px solid rgba(128,128,128,0.3);border-radius:9px;overflow:auto;}',
    '.ba-table{width:100%;border-collapse:collapse;font-size:0.74rem;}',
    '.ba-table th,.ba-table td{padding:5px 9px;text-align:right;border-bottom:1px solid rgba(128,128,128,0.22);white-space:nowrap;font-variant-numeric:tabular-nums;}',
    '.ba-table th:first-child,.ba-table td:first-child{text-align:left;}',
    '.ba-table thead th{position:sticky;top:0;background:inherit;font-size:0.66rem;letter-spacing:0.06em;text-transform:uppercase;opacity:0.65;}',
    '.ba-table tbody tr{cursor:pointer;}',
    '.ba-table tbody tr:hover td,.ba-table tbody tr.on td{background:rgba(200,162,74,0.14);}',
    '.ba-foot{display:flex;align-items:center;gap:12px;margin-top:1.2rem;}',
    // Annulla e Salva: stessa dimensione (min-width comune) e testo che respira (padding).
    '.ba-cancel,.ba-save{flex:none;width:auto;min-width:135px;padding:0.55rem 1.5rem;text-align:center;}',
    '.ba-save{margin-left:auto;}'
  ].join('');
  var s = document.createElement('style'); s.id = 'ba-editor-css'; s.textContent = css; document.head.appendChild(s);
}
// Editor admin dei micro-aggiustamenti icone-badge (dalla v11.33). Stile ADMIN
// MINIMALE (fab-modal-box). Modifica BADGE_ADJUST live e re-inietta le regole
// (le card dietro si aggiornano); anteprima su schede reali nei due temi. Salva
// = commit di dati + badgeAdjust (+0.01). L: ricostruisce (etichette); T: no
// (la modale si ricolora da sé, l'anteprima mostra già entrambi i temi).
function showBadgeAdjustEditor(initState){
  if (document.getElementById('fab-modal')) return;
  baInjectEditorCss();
  var it = currentLang === 'it';
  var cur = (initState && initState.cur) || 'helcaraxe';
  var myL;
  injectFxEditorCss(); // CSS del dock: serve anche aprendo QUESTO editor per primo
  var docked = dockAvailable(560);
  var overlay = document.createElement('div'); overlay.id = 'fab-modal';
  overlay.className = 'fab-modal-overlay' + (docked ? ' fxdock' : '') + (DOCK_RELAYOUT ? ' no-anim' : '');
  // La modale NON scrolla: è un flex-column ad altezza max; solo la tabella (flex:1)
  // scorre internamente, così footer e controlli restano sempre visibili (un solo scroll).
  var box = document.createElement('div'); box.className = 'fab-modal-box';
  if (!docked) { box.style.maxWidth = '840px'; box.style.maxHeight = 'calc(92vh / var(--zoomf, 1))'; }
  box.style.display = 'flex'; box.style.flexDirection = 'column'; box.style.overflow = 'hidden';
  overlay.appendChild(box); document.body.appendChild(overlay);
  if (docked) dockEngage(560); else lockPageScroll(true);
  var onRs;
  var close = function(){
    fabDismiss(overlay);
    window.removeEventListener('resize', onRs);
    if (docked) {
      dockRelease();
      // Chiusura senza salvataggio = ultimo salvato (stessa via dell'Annulla).
      if (!DOCK_RELAYOUT) { BADGE_ADJUST = JSON.parse(JSON.stringify(BADGE_ADJUST_SAVED)); injectBadgeAdjustRules(); }
    } else lockPageScroll(false);
    if (langRefresh === myL) langRefresh = null;
  };
  onRs = function(){
    clearTimeout(onRs._t);
    onRs._t = setTimeout(function(){
      if (!document.body.contains(overlay)) return;
      if (dockAvailable(560) === docked) return;
      dockRebuild(function(){ close(); showBadgeAdjustEditor({ cur: cur }); });
    }, 180);
  };
  window.addEventListener('resize', onRs);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) close(); });
  var cl = document.createElement('button'); cl.className = 'fab-modal-close'; cl.textContent = '×'; cl.onclick = close; box.appendChild(cl);

  var title = document.createElement('p'); title.style.cssText = 'font-weight:600;margin:0 0 0.7rem;'; title.textContent = it ? 'Micro-aggiustamenti delle icone badge' : 'Badge-icon micro-tuning';
  box.appendChild(title);

  function unitOf(id){ for (var i = 0; i < BADGE_ADJUST_UNITS.length; i++) if (BADGE_ADJUST_UNITS[i].id === id) return BADGE_ADJUST_UNITS[i]; return BADGE_ADJUST_UNITS[0]; }

  var chipWrap = document.createElement('div'); chipWrap.className = 'ba-chips';
  BADGE_ADJUST_UNITS.forEach(function(u){
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ba-chip' + (u.id === cur ? ' on' : ''); b.dataset.id = u.id;
    b.textContent = it ? u.it : u.en;
    if (u.grp){ var g = document.createElement('span'); g.className = 'ba-grp'; g.textContent = '×' + u.grp; b.appendChild(g); }
    b.onclick = function(){ cur = u.id; sync(); };
    chipWrap.appendChild(b);
  });
  box.appendChild(chipWrap);

  var selHead = document.createElement('p'); selHead.className = 'ba-selhead'; box.appendChild(selHead);

  // Corpo a due colonne: campi a SINISTRA, anteprime a DESTRA (impilate).
  var body = document.createElement('div'); body.className = 'ba-body';
  var left = document.createElement('div'); var right = document.createElement('div');
  body.appendChild(left); body.appendChild(right); box.appendChild(body);

  var fieldsWrap = document.createElement('div'); fieldsWrap.className = 'ba-fields'; left.appendChild(fieldsWrap);
  var FIELDS = [
    { k:'ml', lab:'margin-left',  min:-0.2, max:0.2, step:0.005 },
    { k:'mr', lab:'margin-right', min:-0.2, max:0.2, step:0.005 },
    { k:'ny', lab: it ? 'nudge verticale' : 'vertical nudge', min:-0.2, max:0.2, step:0.005 },
    { k:'sc', lab:'scale',        min:0.7, max:1.3, step:0.01 }
  ];
  var ctrls = {};
  FIELDS.forEach(function(f){
    var row = document.createElement('div'); row.className = 'ba-field';
    var top = document.createElement('div'); top.className = 'ba-ftop';
    var nm = document.createElement('span'); nm.className = 'ba-fname'; nm.textContent = f.lab;
    var val = document.createElement('span'); val.className = 'ba-fval';
    top.appendChild(nm); top.appendChild(val);
    var line = document.createElement('div'); line.className = 'ba-fline';
    var rng = document.createElement('input'); rng.type = 'range'; rng.min = f.min; rng.max = f.max; rng.step = f.step; rng.setAttribute('aria-label', f.lab);
    var num = document.createElement('input'); num.type = 'text'; num.inputMode = 'decimal'; num.className = 'ba-num'; num.setAttribute('aria-label', f.lab + (it ? ' valore' : ' value'));
    line.appendChild(num); line.appendChild(rng);
    row.appendChild(top); row.appendChild(line); fieldsWrap.appendChild(row);
    ctrls[f.k] = { rng:rng, num:num, val:val };
    function commit(x){ if (!isFinite(x)) return; if (f.k === 'sc' && x <= 0) x = 0.01; BADGE_ADJUST[cur][f.k] = x; injectBadgeAdjustRules(); showVal(f.k); renderPreview(); refreshTableRow(); }
    rng.addEventListener('input', function(){ commit(parseFloat(rng.value)); });
    num.addEventListener('change', function(){ commit(parseFloat((num.value || '').replace(',', '.'))); });
    // Doppio clic sullo slider (binario compreso, v13.39): riporta SOLO questo
    // valore all'ultimo salvato - la convenzione di reset di QUESTO editor.
    var toSaved = function(){ var sv = BADGE_ADJUST_SAVED[cur] || BADGE_ADJUST_FALLBACK[cur]; commit(baNorm(sv)[f.k]); };
    rng.addEventListener('dblclick', toSaved);
    fxGuardSlider(rng, toSaved);
  });
  var resetBtn = document.createElement('button'); resetBtn.type = 'button'; resetBtn.className = 'ba-reset';
  resetBtn.textContent = it ? '↺ Reset unità (ultimo salvato)' : '↺ Reset unit (last saved)';
  resetBtn.onclick = function(){ BADGE_ADJUST[cur] = baNorm(BADGE_ADJUST_SAVED[cur] || BADGE_ADJUST_FALLBACK[cur]); injectBadgeAdjustRules(); sync(); };
  fieldsWrap.appendChild(resetBtn);

  function fmtV(k){ var v = BADGE_ADJUST[cur][k]; if (k === 'sc') return v.toFixed(2) + '×'; return (v < 0 ? '−' : '') + Math.abs(v).toFixed(3) + 'em'; }
  function showVal(k){ var c = ctrls[k]; var v = BADGE_ADJUST[cur][k]; c.rng.value = v; c.num.value = (k === 'sc') ? v.toFixed(2) : v.toFixed(3); c.val.textContent = fmtV(k); }

  var pvGrid = document.createElement('div'); pvGrid.className = 'ba-pvgrid';
  var paneD = document.createElement('div'); paneD.className = 'ba-pane dark';
  var paneL = document.createElement('div'); paneL.className = 'ba-pane light';
  pvGrid.appendChild(paneD); pvGrid.appendChild(paneL); right.appendChild(pvGrid);

  // Tabella riepilogo SEMPRE visibile in basso (niente toggle), scrollevole.
  var tblWrap = document.createElement('div'); tblWrap.className = 'ba-tablewrap';
  tblWrap.tabIndex = 0; tblWrap.setAttribute('aria-label', it ? 'Tabella riepilogo valori icone' : 'Icon values summary table');
  box.appendChild(tblWrap);

  var footer = document.createElement('div'); footer.className = 'ba-foot';
  var cancel = document.createElement('button'); cancel.className = 'fab-modal-confirm ba-cancel'; cancel.textContent = it ? 'Annulla' : 'Cancel';
  cancel.onclick = function(){ BADGE_ADJUST = JSON.parse(JSON.stringify(BADGE_ADJUST_SAVED)); injectBadgeAdjustRules(); close(); };
  var save = document.createElement('button'); save.className = 'fab-modal-confirm ba-save'; save.textContent = it ? 'Salva' : 'Save';
  save.onclick = function(){ withBtn(save, saveBadgeAdjustToRepo(it ? 'icone badge: micro-aggiustamenti' : 'badge icons: micro-tuning'), function(){ close(); }); };
  footer.appendChild(cancel); footer.appendChild(save); box.appendChild(footer);

  function buildTable(){
    var f = function(x){ return (x < 0 ? '−' : '') + Math.abs(x).toFixed(3); };
    var rows = BADGE_ADJUST_UNITS.map(function(u){
      var v = BADGE_ADJUST[u.id];
      return nodo('tr', { 'data-id': u.id, 'class': u.id === cur ? 'on' : null },
        nodo('td', null, it ? u.it : u.en, u.grp ? [' ', nodo('span', { style: 'opacity:.5' }, '×' + u.grp)] : null),
        nodo('td', null, f(v.ml)), nodo('td', null, f(v.mr)), nodo('td', null, f(v.ny)), nodo('td', null, v.sc.toFixed(2) + '×'));
    });
    tblWrap.replaceChildren(nodo('table', { 'class': 'ba-table' },
      nodo('thead', null, nodo('tr', null, nodo('th', null, it ? 'Icona / gruppo' : 'Icon / group'), nodo('th', null, 'ml'), nodo('th', null, 'mr'), nodo('th', null, 'nudge'), nodo('th', null, 'scale'))),
      nodo('tbody', null, rows)));
    Array.prototype.forEach.call(tblWrap.querySelectorAll('tbody tr'), function(tr){ tr.onclick = function(){ cur = tr.dataset.id; sync(); }; });
  }
  // Aggiorna in-place le celle della riga dell'unità corrente (senza rifare la
  // tabella → non resetta lo scroll durante il trascinamento degli slider).
  function refreshTableRow(){
    var tr = tblWrap.querySelector('tbody tr[data-id="' + cur + '"]'); if (!tr) return;
    var v = BADGE_ADJUST[cur]; var f = function(x){ return (x < 0 ? '−' : '') + Math.abs(x).toFixed(3); };
    var td = tr.querySelectorAll('td');
    if (td.length >= 5){ td[1].textContent = f(v.ml); td[2].textContent = f(v.mr); td[3].textContent = f(v.ny); td[4].textContent = v.sc.toFixed(2) + '×'; }
  }

  function samples(u){
    var out = [], i, p;
    // Unità di genere: campioni per genere (non per un flag dei dati). Default 'm'.
    if (u.id === 'male' || u.id === 'female'){
      var g = u.id === 'male' ? 'm' : 'f';
      for (i = 0; i < dati.length && out.length < 3; i++){ p = dati[i]; if ((p.genere === 'f' ? 'f' : 'm') === g) out.push(p); }
      return out;
    }
    for (i = 0; i < dati.length && out.length < 3; i++){ p = dati[i]; if (u.members.some(function(k){ return p[k]; })) out.push(p); }
    return out;
  }
  function iconFile(p, k){ if (k === 'istari'){ var a = ISTARI_ICON[p.nome]; return 'icons/' + ((a && a[0]) || 'Bianco.webp'); } var m = /src="([^"]+)"/.exec(BADGE_ICON[k] || ''); return m ? m[1] : ('icons/' + k + '.webp'); }
  function nmOf(p){ return it ? (p.nome || p.nome_en) : (p.nome_en || p.nome); }
  function renderPane(pane){
    var u = unitOf(cur); var ss = samples(u);
    if (!ss.length){ pane.replaceChildren(nodo('div', { 'class': 'ba-pv-empty' }, it ? 'Nessuna scheda con questo badge' : 'No card with this badge')); return; }
    pane.replaceChildren.apply(pane, ss.map(function(p){
      var badges = ICON_ORDER.filter(function(k){ return p[k]; }).map(function(k){
        var uid = BADGE_UNIT[k]; var v = uid ? BADGE_ADJUST[uid] : { ml:0, mr:0, ny:0, sc:1 }; var selc = (uid === cur);
        var img = nodo('img', { src: iconFile(p, k), alt: '', 'class': 'ba-pv-ico', style: 'height:calc(0.92em * ' + v.sc + ');margin-left:' + v.ml + 'em;margin-right:' + v.mr + 'em;transform:translateY(' + v.ny + 'em)' });
        return selc ? nodo('span', { 'class': 'ba-pv-sel' }, img) : img;
      });
      // Simbolo di genere in coda (come sulla card): ORA è un'unità regolabile
      // (bi-male/bi-female). Reso coi valori LIVE della sua unità (dimensioni base
      // proprie, non 0.92em) ed evidenziato dalla freccia quando è quello selezionato.
      var gid = (p.genere === 'f') ? 'female' : 'male';
      var gv = BADGE_ADJUST[gid], gb = GENDER_BASE[gid];
      var gsym = htmlCostante((p.genere === 'f' ? GENDER_ICON.f : GENDER_ICON.m).split('%L%').join('')).firstChild;
      gsym.setAttribute('style', 'width:calc(' + gb.w + 'em * ' + gv.sc + ');height:calc(' + gb.h + 'em * ' + gv.sc + ');margin-left:' + gv.ml + 'em;margin-right:' + gv.mr + 'em;transform:translateY(' + gv.ny + 'em)');
      if (cur === gid) gsym = nodo('span', { 'class': 'ba-pv-sel' }, gsym);
      return nodo('div', { 'class': 'ba-pv-row' }, nodo('span', { 'class': 'ba-pv-name' }, nmOf(p)), nodo('span', { 'class': 'ba-pv-badges' }, badges, gsym));
    }));
    placeMidlines(pane);
  }
  // Posiziona la linea di mezzo (--mid) a metà del MAIUSCOLETTO del nome, con lo
  // stesso metodo robusto delle card (baseline reale via strut + measureText('n')):
  // vedi placeMidlinesFor. Riferimento SOLIDO e coerente tra editor e pagina.
  function placeMidlines(pane){
    var pairs = [];
    Array.prototype.forEach.call(pane.querySelectorAll('.ba-pv-row'), function(row){
      pairs.push({ host: row, nm: row.querySelector('.ba-pv-name') });
    });
    placeMidlinesFor(pairs);
  }
  function renderPreview(){ renderPane(paneD); renderPane(paneL); }

  function sync(){
    Array.prototype.forEach.call(chipWrap.children, function(c){ c.classList.toggle('on', c.dataset.id === cur); });
    var u = unitOf(cur);
    selHead.replaceChildren(nodo('b', null, it ? u.it : u.en), ' · ' + (u.grp ? (it ? ('Gruppo · ' + u.grp + ' icone, stessi valori') : ('Group · ' + u.grp + ' icons, shared values')) : (it ? 'Icona singola' : 'Single icon')));
    ['ml','mr','ny','sc'].forEach(showVal);
    renderPreview();
    buildTable();
  }

  function withBtn(btn, promise, onOk){
    btn.disabled = true; btn.style.opacity = '0.4';
    promise.then(function(res){
      if (res.ok){ BADGE_ADJUST_SAVED = JSON.parse(JSON.stringify(BADGE_ADJUST)); showToast(it ? '✓ Salvato' : '✓ Saved', false); if (onOk) onOk(); }
      else { showToast((it ? '✗ Salvataggio fallito: ' : '✗ Save failed: ') + (res.reason || ''), true); }
    }).finally(function(){ btn.disabled = false; btn.style.opacity = ''; });
  }

  function rebuild(){ if (!document.body.contains(overlay)){ if (langRefresh === myL) langRefresh = null; return; } var st = { cur: cur }; dockRebuild(function(){ close(); showBadgeAdjustEditor(st); }); }
  myL = rebuild; langRefresh = myL;

  sync();
}

// Statistiche: modale (dal bivio admin 'Area admin' → 'Statistiche') con 3 viste
// (tab): FAMIGLIE (colore), CATEGORIE (le 9 razze), TIPI (le etichette type-*).
// Legge dati + CARDCOLORS + i colori-etichetta AL VOLO, quindi rispecchia in tempo
// reale ogni modifica. Modale standalone: gestisce lockPageScroll da sé.
function showColorStats(initState) {
  if (document.getElementById('stats-modal')) return;
  var it = currentLang === 'it';
  var curTab = 'fam', myStatsL, myStatsT; // tab attiva + hook lingua/tema (per rebuild)
  var ov = document.createElement('div'); ov.id = 'stats-modal'; ov.className = 'fab-modal-overlay';
  var box = document.createElement('div'); box.className = 'fab-modal-box'; box.style.maxWidth = '660px'; box.style.maxHeight = 'calc(88vh / var(--zoomf, 1))'; box.style.overflowY = 'auto';
  ov.appendChild(box); document.body.appendChild(ov);
  lockPageScroll(true);
  var close = function(){ fabDismiss(ov); lockPageScroll(false); if (langRefresh===myStatsL) langRefresh=null; if (themeRefresh===myStatsT) themeRefresh=null; };
  ov.addEventListener('click', function(e){ if (e.target === ov) close(); });
  var cl = document.createElement('button'); cl.className = 'fab-modal-close'; cl.textContent = '×'; cl.onclick = close; box.appendChild(cl);
  var h = document.createElement('p'); h.style.cssText = 'font-weight:600;font-size:1.05rem;margin:0 0 0.5rem;';
  h.textContent = it ? 'Statistiche' : 'Statistics'; box.appendChild(h);
  var theme = ccTheme(), total = dati.length;
  // Tab
  var tabs = document.createElement('div'); tabs.style.cssText = 'display:flex;gap:0.4rem;margin:0 0 0.8rem;';
  var content = document.createElement('div'); var btns = {};
  [['fam', it?'Famiglie':'Families'], ['cat', it?'Categorie':'Categories'], ['type', it?'Tipi':'Types']].forEach(function(t){
    var b = document.createElement('button'); b.className = 'fab-modal-confirm'; b.style.cssText = 'flex:1;padding:0.4rem;font-size:0.85rem;';
    b.textContent = t[1]; b.onclick = function(){ setStatTab(t[0]); }; btns[t[0]] = b; tabs.appendChild(b);
  });
  box.appendChild(tabs); box.appendChild(content);
  // Riga-barra. o: {swatches?, name, n, max, barColor}
  function statRow(host, o){
    var pct = Math.round(o.n / total * 100);
    // Larghezza colonna nome RESPONSIVE, calcolata al build così NON sfora mai il
    // box (che su mobile è width:90%): si parte dalla larghezza desiderata (nameW,
    // desktop) e la si limita allo spazio realmente disponibile riservando swatch,
    // barra (min 24px), conteggio e gap. Uguale per tutte le righe a un dato
    // viewport → barre incolonnate; il nome VA A CAPO (niente ellissi) se la
    // colonna si stringe, quindi resta leggibile per intero anche su telefono.
    var swW = o.swatches ? 46 : 0;
    var reserved = swW + 80 /*conteggio*/ + (o.swatches ? 26 : 18) /*gap*/ + 24 /*barra min*/ + 4;
    var innerW = Math.min(660, window.innerWidth * 0.9) - 60 /*padding+bordo box*/;
    var nwPx = Math.max(40, Math.min(parseInt(o.nameW || '108', 10), Math.floor(innerW - reserved)));
    var nw = nwPx + 'px';
    var row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:' + (o.swatches ? ('46px ' + nw + ' minmax(24px,1fr) auto') : (nw + ' minmax(24px,1fr) auto')) + ';align-items:center;gap:0.55rem;margin:0.3rem 0;font-size:0.88rem;';
    if (o.swatches){ var sw = document.createElement('span'); sw.style.cssText = 'display:inline-flex;gap:3px;'; o.swatches.forEach(function(hx){ var s = document.createElement('span'); var base = 'width:20px;height:15px;border-radius:3px;display:inline-block;flex:none;'; if (hx && typeof hx === 'object'){ s.style.cssText = base + 'background:' + hx.bg + ';border:1px solid ' + hx.border + ';'; } else { s.style.cssText = base + 'border:1px solid rgba(128,128,128,0.4);background:' + hx + ';'; } sw.appendChild(s); }); row.appendChild(sw); }
    var nm = document.createElement('span'); nm.style.cssText = 'font-weight:600;overflow-wrap:anywhere;line-height:1.2;'; nm.textContent = o.name; nm.title = o.name; row.appendChild(nm);
    var track = document.createElement('span'); track.style.cssText = 'display:block;width:100%;height:13px;background:rgba(128,128,128,0.14);border-radius:7px;overflow:hidden;';
    var fill = document.createElement('span'); fill.style.cssText = 'display:block;height:100%;border-radius:7px;min-width:2px;width:' + (o.n / o.max * 100) + '%;background:' + o.barColor + ';'; track.appendChild(fill); row.appendChild(track);
    var cnt = document.createElement('span'); cnt.style.cssText = 'font-variant-numeric:tabular-nums;text-align:right;opacity:0.85;min-width:56px;'; cnt.replaceChildren(nodo('b', null, o.n), ' · ' + pct + '%'); row.appendChild(cnt);
    if (o.onClick){
      row.style.cursor = 'pointer'; row.style.borderRadius = '6px'; row.style.padding = '0.12rem 0.25rem'; row.style.margin = '0.18rem -0.25rem';
      row.tabIndex = 0; row.setAttribute('role', 'button'); row.setAttribute('aria-label', o.name + ', ' + o.n);
      var chev = document.createElement('span'); chev.textContent = ' ›'; chev.style.cssText = 'opacity:0.5;font-weight:700;'; cnt.appendChild(chev);
      var hoverBg = theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.07)';
      var on = function(){ row.style.background = hoverBg; }, off = function(){ row.style.background = ''; };
      row.addEventListener('mouseenter', on); row.addEventListener('mouseleave', off);
      row.addEventListener('focus', on); row.addEventListener('blur', off);
      row.addEventListener('click', o.onClick);
      row.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); o.onClick(); } });
    }
    host.appendChild(row);
  }
  function subLine(host, txt){ var s = document.createElement('p'); s.style.cssText = 'font-size:0.8rem;opacity:0.7;margin:0 0 0.8rem;'; s.textContent = txt; host.appendChild(s); }
  function noteLine(host, txt){ var n = document.createElement('p'); n.style.cssText = 'font-size:0.72rem;opacity:0.55;margin:0.9rem 0 0;border-top:1px solid rgba(128,128,128,0.2);padding-top:0.6rem;'; n.textContent = txt; host.appendChild(n); }
  // Colore di un'etichetta type-* letto dal CSS reale (tema attivo).
  function typeLabelColor(cls){ var pr = document.createElement('span'); pr.className = 'type-badge ' + cls; pr.style.cssText = 'position:absolute;left:-9999px;'; document.body.appendChild(pr); var c = getComputedStyle(pr).color; pr.remove(); return c; }
  // Colori REALI dell'etichetta come renderizzata nel tema corrente (testo,
  // sfondo tenue e bordo): lo swatch li usa per essere una mini-pill fedele
  // invece di un blocco pieno del solo colore-testo.
  function typeLabelStyle(cls){ var pr = document.createElement('span'); pr.className = 'type-badge ' + cls; pr.style.cssText = 'position:absolute;left:-9999px;'; document.body.appendChild(pr); var s = getComputedStyle(pr); var o = { color: s.color, bg: s.backgroundColor, border: s.borderTopColor }; pr.remove(); return o; }
  // Tutte le classi-etichetta di una voce (replica renderList/stripClassOf).
  function typeClassesOf(p){
    var tp = it ? p.tipo : (p.tipo_en || p.tipo);
    var cls = (p.nome !== 'Lúthien' && isAinu(p)) ? ['type-ainu'] : [];
    var segs = (p.tipo_color || '').split('|');
    if (tp) tp.split('|').forEach(function(seg, i){ var ov = (segs[i] || '').trim(); if (!/^type-[a-z-]*$/.test(ov)) ov = ''; cls.push(ov || tipoClass(seg.trim())); });
    return cls;
  }
  var acc = theme === 'light' ? '#5a6b7a' : '#8aa0b4';
  // ── Stack di viste (drill-down). Ogni vista è una fn(host). Il primo elemento
  //    è la vista base della tab corrente; push apre un dettaglio, pop torna su. ──
  var stack = [];
  function renderTop(){ content.replaceChildren(); box.scrollTop = 0; stack[stack.length - 1](content); }
  function pushView(fn){ stack.push(fn); renderTop(); }
  function popView(){ if (stack.length > 1){ stack.pop(); renderTop(); } }
  // Barra 'indietro' + titolo per le viste di dettaglio.
  function backBar(host, title, colorDot){
    var bar = document.createElement('div'); bar.style.cssText = 'display:flex;align-items:center;gap:0.5rem;margin:0 0 0.7rem;';
    var bk = document.createElement('button'); bk.className = 'fab-modal-confirm'; bk.style.cssText = 'width:auto;flex:none;padding:0.3rem 0.7rem;font-size:0.82rem;margin:0;'; bk.textContent = it ? '‹ Indietro' : '‹ Back'; bk.onclick = popView; bar.appendChild(bk);
    if (colorDot){ var d = document.createElement('span'); d.style.cssText = 'width:14px;height:14px;border-radius:3px;border:1px solid rgba(128,128,128,0.4);flex:none;background:' + colorDot + ';'; bar.appendChild(d); }
    var t = document.createElement('span'); t.style.cssText = 'font-weight:700;font-size:0.95rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'; t.textContent = title; bar.appendChild(t);
    host.appendChild(bar);
  }
  // Lista di personaggi (nomi, in ordine di classifica).
  function charList(host, chars){
    subLine(host, chars.length + (it ? ' personaggi' : ' characters'));
    var wrap = document.createElement('div'); wrap.style.cssText = 'display:flex;flex-direction:column;';
    chars.forEach(function(p){
      var r = document.createElement('div'); r.style.cssText = 'padding:0.3rem 0.35rem;font-size:0.9rem;border-bottom:1px solid rgba(128,128,128,0.12);';
      r.textContent = it ? (p.nome || p.nome_en) : (p.nome_en || p.nome); wrap.appendChild(r);
    });
    host.appendChild(wrap);
  }
  // Nome 'normalizzato' di una classe-etichetta (fallback: la classe senza prefisso).
  function typeName(cls){ var m = TYPE_LABEL[it ? 'it' : 'en']; return (m && m[cls]) || cls.replace(/^type-/, ''); }
  function charsOfType(cls){ return dati.filter(function(p){ return typeClassesOf(p).indexOf(cls) !== -1; }); }
  function charsOfFam(fam){ return dati.filter(function(p){ return familyOf(p) === fam; }); }

  // ── Viste di dettaglio ──
  function typeDetailView(cls){ return function(host){ var col = typeLabelColor(cls); backBar(host, typeName(cls), col); charList(host, charsOfType(cls)); }; }
  function famDetailView(fam){ return function(host){ backBar(host, fam, theme === 'light' ? ccFamHex(fam, 'light') : ccFamHex(fam, 'dark')); charList(host, charsOfFam(fam)); }; }
  function catDetailView(catKey, catName){
    return function(host){
      backBar(host, catName, null);
      var counts = {}; dati.forEach(function(p){ if (categoria(p) !== catKey) return; typeClassesOf(p).forEach(function(c){ if (c) counts[c] = (counts[c] || 0) + 1; }); });
      var rows = Object.keys(counts).map(function(k){ return { k:k, n:counts[k] }; }).sort(function(a, b){ return b.n - a.n; });
      var max = rows.length ? rows[0].n : 1;
      subLine(host, rows.length + (it ? ' tipi in questa categoria' : ' types in this category'));
      rows.forEach(function(r){ var st = typeLabelStyle(r.k); statRow(host, { swatches:[{bg:st.bg, border:st.border}], name: typeName(r.k), n:r.n, max:max, barColor:st.color, nameW:'172px', onClick: function(){ pushView(typeDetailView(r.k)); } }); });
      noteLine(host, it ? 'Tocca un tipo per vederne i personaggi.' : 'Tap a type to see its characters.');
    };
  }

  // ── Viste base (una per tab) ──
  function famView(host){
    var counts = {}, custom = 0;
    dati.forEach(function(x){ var f = familyOf(x); if (f === 'custom'){ custom++; return; } counts[f] = (counts[f] || 0) + 1; });
    var rows = Object.keys(counts).map(function(k){ return { k:k, n:counts[k] }; }).sort(function(a, b){ return b.n - a.n; });
    var max = rows.length ? rows[0].n : 1;
    subLine(host, total + (it?' personaggi in ':' characters in ') + rows.length + (it?' famiglie':' families') + (custom ? (' + ' + custom + (it?' individuali':' individual')) : ''));
    rows.forEach(function(r){ var d = ccFamHex(r.k,'dark'), l = ccFamHex(r.k,'light'); statRow(host, { swatches:[l,d], name:r.k, n:r.n, max:max, barColor: theme==='light'?l:d, onClick: function(){ pushView(famDetailView(r.k)); } }); });
    noteLine(host, it?'Tocca una famiglia per vederne i personaggi.':'Tap a family to see its characters.');
  }
  function catView(host){
    var counts = {}; dati.forEach(function(x){ var c = categoria(x); counts[c] = (counts[c] || 0) + 1; });
    var rows = CATS.map(function(k){ return { k:k, n:counts[k]||0 }; }).filter(function(r){ return r.n > 0; }).sort(function(a, b){ return b.n - a.n; });
    var max = rows.length ? rows[0].n : 1, CL = CAT_LABEL[it?'it':'en'];
    // Nomi di categoria PER ESTESO (come nel Pannello): la colonna nome è
    // allargata (nameW) così ci stanno interi, es. 'Esseri arcani/primordiali'.
    subLine(host, total + (it?' personaggi in ':' characters in ') + rows.length + (it?' categorie':' categories'));
    rows.forEach(function(r){ var nm = CL[r.k] || r.k; statRow(host, { name: nm, n:r.n, max:max, barColor:acc, nameW:'212px', onClick: function(){ pushView(catDetailView(r.k, nm)); } }); });
    noteLine(host, it?'Tocca una categoria per vedere i tipi al suo interno.':'Tap a category to see the types within.');
  }
  function typeView(host){
    var counts = {}; dati.forEach(function(x){ typeClassesOf(x).forEach(function(c){ if (c) counts[c] = (counts[c] || 0) + 1; }); });
    var rows = Object.keys(counts).map(function(k){ return { k:k, n:counts[k] }; }).sort(function(a, b){ return b.n - a.n; });
    var max = rows.length ? rows[0].n : 1, tot = rows.reduce(function(s, r){ return s + r.n; }, 0);
    subLine(host, tot + (it?' etichette su ':' labels across ') + total + (it?' personaggi, ':' characters, ') + rows.length + (it?' tipi':' types'));
    rows.forEach(function(r){ var st = typeLabelStyle(r.k); statRow(host, { swatches:[{bg:st.bg, border:st.border}], name: typeName(r.k), n:r.n, max:max, barColor:st.color, nameW:'172px', onClick: function(){ pushView(typeDetailView(r.k)); } }); });
    noteLine(host, it?'Tocca un tipo per vederne i personaggi; chi ha più etichette conta in più tipi.':'Tap a type to see its characters; a character with several labels counts in several types.');
  }
  function setStatTab(w){ curTab = w; Object.keys(btns).forEach(function(k){ btns[k].style.opacity = k===w ? '1' : '0.5'; }); stack = [ w==='fam' ? famView : w==='cat' ? catView : typeView ]; renderTop(); }
  setStatTab(initState && initState.tab ? initState.tab : 'fam');
  if (initState && initState.scroll) box.scrollTop = initState.scroll;
  // Scorciatoie L (lingua) e T (tema) mentre la modale è aperta: si ricostruisce
  // nel nuovo lingua/tema conservando tab e scroll (anti-jitter). La drill-down
  // torna alla vista base della tab (transitoria). Legge i colori al volo, quindi
  // rispecchia il tema corrente.
  function rebuildStats(){
    if (!document.body.contains(ov)) { if (langRefresh===myStatsL) langRefresh=null; if (themeRefresh===myStatsT) themeRefresh=null; return; }
    var st = { tab: curTab, scroll: box.scrollTop };
    close(); showColorStats(st);
  }
  myStatsL = rebuildStats; myStatsT = rebuildStats;
  langRefresh = myStatsL; themeRefresh = myStatsT;
}

function showColorEditor(initState) {
  if (document.getElementById('fab-modal')) return;
  var it = currentLang === 'it';
  var curTab = 'f', famSelectEl = null, myEdL; // tab + select famiglia + hook lingua (rebuild solo su L)
  injectFxEditorCss(); // il CSS del dock vive lì: serve anche aprendo QUESTO editor per primo
  var docked = dockAvailable(480);
  var overlay = document.createElement('div');
  overlay.id = 'fab-modal'; overlay.className = 'fab-modal-overlay' + (docked ? ' fxdock' : '') + (DOCK_RELAYOUT ? ' no-anim' : '');
  var box = document.createElement('div'); box.className = 'fab-modal-box';
  if (!docked) { box.style.maxWidth = '620px'; box.style.maxHeight = 'calc(90vh / var(--zoomf, 1))'; }
  box.style.overflowY = 'auto';
  overlay.appendChild(box); document.body.appendChild(overlay);
  if (docked) dockEngage(480); else lockPageScroll(true);
  // ── Anteprime LIVE della vista divisa e loro ripristini ──────────────────────
  // ⚠️ I salvataggi inviano TUTTO (dati + cardColors): un'anteprima non salvata
  // NON deve vivere negli oggetti che un salvataggio d'altro porterebbe con sé.
  // • FAMIGLIE: il colore in prova sta in CARDCOLORS.fam (serve alla pagina), ma
  //   la famiglia che si ABBANDONA (cambio famiglia/tab) torna all'ultimo salvato:
  //   così 'Salva colore' su B non committa mai la prova non salvata di A.
  //   Dopo un salvataggio riuscito SAVED è sincronizzato e il ripristino è un no-op.
  // • PERSONAGGIO: l'anteprima è SOLO DOM (mai p.cardrgb): si replica ciò che
  //   renderList fa per le voci custom (classe cc-custom + terne inline) sulla
  //   card vera, e si ripristina com'era. Il dato lo scrive solo 'Salva sul repo'.
  var dockFamPending = null, dockCharPending = null;
  function revertFamPending(){
    if (!dockFamPending) return;
    var f = dockFamPending; dockFamPending = null;
    if (CARDCOLORS_SAVED[f]) CARDCOLORS.fam[f] = JSON.parse(JSON.stringify(CARDCOLORS_SAVED[f]));
    reinjectFamilyColors();
  }
  function revertCharPreview(){
    if (!dockCharPending) return;
    var c = dockCharPending; dockCharPending = null;
    // Se renderList è girato nel frattempo (salvataggio, rimozione) il nodo è
    // stato sostituito da uno già corretto: non c'è nulla da ripristinare.
    if (c.el && document.body.contains(c.el)) { c.el.className = c.cls; c.el.style.cssText = c.css; }
  }
  var onRs;
  var close = function(){
    fabDismiss(overlay);
    window.removeEventListener('resize', onRs);
    revertCharPreview(); // solo DOM: si ripulisce anche nei rebuild tecnici
    if (docked) {
      dockRelease();
      if (!DOCK_RELAYOUT) { CARDCOLORS.fam = JSON.parse(JSON.stringify(CARDCOLORS_SAVED)); reinjectFamilyColors(); }
    } else lockPageScroll(false);
    if (langRefresh===myEdL) langRefresh=null;
  };
  onRs = function(){
    clearTimeout(onRs._t);
    onRs._t = setTimeout(function(){
      if (!document.body.contains(overlay)) return;
      if (dockAvailable(480) === docked) return;
      var st = { tab: curTab, fam: (curTab==='f' && famSelectEl) ? famSelectEl.value : null, scroll: box.scrollTop };
      dockRebuild(function(){ close(); showColorEditor(st); });
    }, 180);
  };
  window.addEventListener('resize', onRs);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) close(); });
  var cl = document.createElement('button'); cl.className = 'fab-modal-close'; cl.textContent = '×'; cl.onclick = close;
  box.appendChild(cl);

  // Due modalità: Mirata (singolo personaggio) e Famiglie.
  var tabs = document.createElement('div');
  tabs.style.cssText = 'display:flex;gap:0.4rem;margin:0 0 0.6rem;';
  var content = document.createElement('div');
  var tMirata = document.createElement('button'), tFam = document.createElement('button');
  [tMirata, tFam].forEach(function(t){ t.className = 'fab-modal-confirm'; t.style.cssText = 'flex:1;padding:0.4rem;'; });
  tMirata.textContent = it ? 'Personaggio' : 'Character';
  tFam.textContent = it ? 'Famiglie' : 'Families';
  function setTab(which){
    revertFamPending(); revertCharPreview();
    curTab = which;
    tMirata.style.opacity = which === 'm' ? '1' : '0.5';
    tFam.style.opacity = which === 'f' ? '1' : '0.5';
    content.replaceChildren();
    if (which === 'm') buildMirata(content); else buildFamilies(content);
  }
  tMirata.onclick = function(){ setTab('m'); };
  tFam.onclick = function(){ setTab('f'); };
  // Ordine: Famiglie a sinistra, Personaggio a destra; default = Famiglie.
  tabs.appendChild(tFam); tabs.appendChild(tMirata);
  box.appendChild(tabs); box.appendChild(content);
  setTab('f');
  // Ripristino stato dopo un rebuild da cambio lingua/tema (anti-jitter):
  // stessa tab, stessa famiglia selezionata, stesso scroll.
  if (initState){
    if (initState.tab) setTab(initState.tab);
    if (initState.tab === 'f' && initState.fam && famSelectEl){
      var _has = Array.prototype.some.call(famSelectEl.options, function(o){ return o.value === initState.fam; });
      if (_has){ famSelectEl.value = initState.fam; famSelectEl.onchange(); }
    }
    if (initState.scroll) box.scrollTop = initState.scroll;
  }
  // Scorciatoia L (lingua): ricostruisce l'editor nella nuova lingua conservando
  // tab, famiglia e scroll. La T (tema) NON ricostruisce: la modale si ricolora
  // da sé via CSS e l'anteprima mostra già ENTRAMBI i temi affiancati, quindi un
  // rebuild sul tema sarebbe inutile e perderebbe un eventuale colore scelto ma
  // non ancora salvato (che vive solo nello stato locale del controllo).
  function rebuildEditor(){
    if (!document.body.contains(overlay)) { if (langRefresh===myEdL) langRefresh=null; return; }
    var st = { tab: curTab, fam: (curTab==='f' && famSelectEl) ? famSelectEl.value : null, scroll: box.scrollTop };
    dockRebuild(function(){ close(); showColorEditor(st); });
  }
  myEdL = rebuildEditor;
  langRefresh = myEdL;

  // ── Modalità MIRATA: colore individuale per-tema (p.cardrgb {dark,light}) → 'custom' ──
  function buildMirata(root){
    var hint = document.createElement('p');
    hint.style.cssText = 'font-size:0.78rem;opacity:0.7;margin:0 0 0.5rem;';
    hint.textContent = it ? 'Cerca un personaggio e definisci solo il suo colore.' : 'Search a character and set only its colour.';
    var search = document.createElement('input'); search.type = 'text'; search.autocomplete = 'off';
    search.placeholder = it ? 'Cerca per nome...' : 'Search by name...';
    search.setAttribute('aria-label', it ? 'Cerca personaggio per nome' : 'Search character by name');
    var results = document.createElement('div');
    results.style.cssText = 'max-height:170px;overflow:auto;margin:0.4rem 0;display:flex;flex-direction:column;gap:2px;';
    var panel = document.createElement('div');
    root.appendChild(hint); root.appendChild(search); root.appendChild(results); root.appendChild(panel);
    function renderResults(q){
      results.replaceChildren(); panel.replaceChildren();
      q = (q || '').trim().toLowerCase(); if (q.length < 1) return;
      var hits = [];
      for (var i = 0; i < dati.length && hits.length < 20; i++){
        var p = dati[i];
        if ((p.nome||'').toLowerCase().indexOf(q) !== -1 || (p.nome_en||'').toLowerCase().indexOf(q) !== -1) hits.push(i);
      }
      hits.forEach(function(i){
        var p = dati[i];
        var row = document.createElement('button'); row.className = 'fab-modal-confirm';
        row.style.cssText = 'text-align:left;padding:0.4rem 0.6rem;font-size:0.9rem;';
        row.textContent = (it ? (p.nome||p.nome_en) : (p.nome_en||p.nome)) + '  ·  ' + familyOf(p);
        row.onclick = function(){ selectChar(i, panel); };
        results.appendChild(row);
      });
    }
    search.addEventListener('input', function(){ renderResults(search.value); });
    setTimeout(function(){ search.focus(); }, 60);
  }
  function selectChar(i, panel){
    var p = dati[i]; panel.replaceChildren();
    var cp = customPair(p);
    var isCustom = !!cp;
    var fam = familyOf(p);
    // Colori di partenza: se già individuale, le sue due terne per-tema;
    // altrimenti i colori della famiglia attuale nei due temi (base sensata).
    var curDark  = isCustom ? ccTripletToHex(cp.dark)  : ccFamHex(fam, 'dark');
    var curLight = isCustom ? ccTripletToHex(cp.light) : ccFamHex(fam, 'light');
    var name = document.createElement('p'); name.style.cssText = 'font-weight:600;margin:0.6rem 0 0.2rem;';
    name.textContent = it ? (p.nome||p.nome_en) : (p.nome_en||p.nome);
    var famLine = document.createElement('p'); famLine.style.cssText = 'font-size:0.78rem;opacity:0.7;margin:0 0 0.5rem;';
    function setFamLine(){ famLine.textContent = (it ? 'Famiglia attuale: ' : 'Current family: ') + familyOf(p) + (customPair(p) ? (it ? ' (colore individuale)' : ' (individual)') : ''); }
    setFamLine();
    var sampleTipo = ((it ? p.tipo : (p.tipo_en || p.tipo)) || '').split('|')[0].trim() || (it ? 'Tipo' : 'Type');
    // Controllo condiviso: scegli un colore, le varianti tema si derivano da sé
    // e l'anteprima mostra card + scheda nei due temi in tempo reale.
    var ctrl = buildColorControl(curDark, curLight, name.textContent, sampleTipo);
    if (docked) {
      revertCharPreview(); // si lascia pulito il personaggio precedente
      var liveCard = document.querySelector('.rank-item[data-idx="' + i + '"]');
      if (liveCard) liveCard.scrollIntoView({ block: 'center', behavior: 'smooth' });
      ctrl.hook = function(g){
        if (!liveCard || !document.body.contains(liveCard)) return;
        if (!dockCharPending) dockCharPending = { el: liveCard, cls: liveCard.className, css: liveCard.style.cssText };
        // Stessa resa di renderList per le voci custom: classe cc-custom al posto
        // della famiglia + terne per-tema inline (le regole iniettate mappano --ccrgb).
        liveCard.className = dockCharPending.cls.replace(/\bcc-[a-z-]+\b/g, '') + ' cc-custom';
        liveCard.style.setProperty('--ccdark', ccHexToTriplet(g.dark));
        liveCard.style.setProperty('--cclight', ccHexToTriplet(g.light));
      };
    }
    function apply(){ var g = ctrl.get(); dockCharPending = null; p.cardrgb = { dark: g.dark, light: g.light }; renderList(); setFamLine(); }
    var bSave = mkBtn(it ? 'Salva sul repo' : 'Save to repo', function(btn){ apply(); withBtn(btn, saveColorsToRepo('colori: colore individuale di ' + (p.nome||p.nome_en))); }, true);
    panel.appendChild(name); panel.appendChild(famLine); panel.appendChild(ctrl.el);
    if (isCustom) panel.appendChild(mkBtn(it ? 'Rimuovi colore individuale' : 'Remove individual colour', function(){ delete p.cardrgb; renderList(); showToast(it?'✓ Torna alla famiglia':'✓ Back to family', false); selectChar(i, panel); }));
    panel.appendChild(bSave);
  }

  // ── Modalità FAMIGLIE: colore (per tema), rinomina, sposta-per-tipo ──────────
  function buildFamilies(root){
    var lbl = document.createElement('p'); lbl.style.cssText = 'font-size:0.82rem;margin:0 0 0.3rem;';
    lbl.textContent = it ? 'Famiglia:' : 'Family:';
    var sel = document.createElement('select'); sel.style.cssText = 'width:100%;padding:0.4rem;'; sel.setAttribute('aria-label', it ? 'Famiglia colore' : 'Colour family'); famSelectEl = sel;
    Object.keys(CARDCOLORS.fam).sort().forEach(function(k){ var o = document.createElement('option'); o.value = k; o.textContent = k + ' (' + famCount(k) + ')'; sel.appendChild(o); });
    var panel = document.createElement('div');
    root.appendChild(lbl); root.appendChild(sel); root.appendChild(panel);
    sel.onchange = function(){ buildFamPanel(sel.value, panel); };
    buildFamPanel(sel.value, panel);
  }
  function famCount(fam){ var n = 0; for (var i = 0; i < dati.length; i++) if (familyOf(dati[i]) === fam) n++; return n; }
  function buildFamPanel(fam, panel){
    revertFamPending(); // la famiglia che si abbandona torna all'ultimo salvato
    panel.replaceChildren();
    // 1) Colore: si sceglie UN colore, le due varianti tema sono derivate in
    // automatico (AA-safe) e mostrate in anteprima. Titolo 'Colore' e tasto sono
    // dentro il controllo condiviso.
    var ctrl = buildColorControl(ccFamHex(fam,'dark'), ccFamHex(fam,'light'), fam, fam);
    if (docked) ctrl.hook = function(g){
      dockFamPending = fam;
      CARDCOLORS.fam[fam] = { dark: g.dark, light: g.light };
      reinjectFamilyColors(); // tutte le card della famiglia si aggiornano in pagina
    };
    // Rete di sicurezza: ultimo colore SALVATO (clic per ripristinare), allineato
    // a DESTRA. 'Salvato' = committato, non l'anteprima.
    var saved = CARDCOLORS_SAVED[fam] || CARDCOLORS.fam[fam] || { dark:'#9098a8', light:'#9098a8' };
    var srow = document.createElement('div'); srow.style.cssText = 'display:flex;align-items:center;justify-content:flex-end;gap:0.45rem;flex-wrap:wrap;margin:1.1rem 0 0.6rem;font-size:0.74rem;opacity:0.85;';
    srow.appendChild(document.createTextNode(it?'Ultimo salvato (clic per ripristinare):':'Last saved (click to restore):'));
    var restoreBtn = document.createElement('button');
    restoreBtn.title = it?'Ripristina l\'ultimo colore salvato (chiaro e scuro)':'Restore the last saved colour (light and dark)';
    restoreBtn.style.cssText = 'display:inline-flex;gap:3px;align-items:center;border:1px solid rgba(128,128,128,0.5);border-radius:6px;cursor:pointer;padding:2px 4px;background:transparent;';
    [saved.light, saved.dark].forEach(function(hx){ var s = document.createElement('span'); s.style.cssText = 'width:20px;height:16px;border-radius:3px;display:inline-block;background:' + hx + ';'; restoreBtn.appendChild(s); });
    restoreBtn.onclick = function(){ ctrl.set(saved.dark, saved.light); showToast(it?'✓ Ripristinato colore salvato':'✓ Restored saved colour', false); };
    srow.appendChild(restoreBtn);
    var bColSave = mkBtn(it ? 'Salva colore' : 'Save colour', function(btn){ var g = ctrl.get(); CARDCOLORS.fam[fam] = { dark: g.dark, light: g.light }; reinjectFamilyColors(); withBtn(btn, saveColorsToRepo('colori: colore famiglia ' + fam)); }, true);
    // 2) Rinomina
    var h2 = mkH(it ? 'Rinomina famiglia' : 'Rename family');
    var rin = document.createElement('input'); rin.type = 'text'; rin.value = fam; rin.style.cssText = 'width:60%;padding:0.35rem;'; rin.setAttribute('aria-label', it ? 'Nuovo nome famiglia' : 'New family name');
    var bRen = mkBtn(it ? 'Rinomina e salva' : 'Rename & save', function(btn){
      var nn = (rin.value||'').trim().toLowerCase().replace(/[^a-z0-9-]/g,'');
      if (!nn || nn === fam) { showToast(it?'Nome non valido':'Invalid name', true); return; }
      if (CARDCOLORS.fam[nn]) { showToast(it?'Nome già in uso':'Name already used', true); return; }
      CARDCOLORS.fam[nn] = CARDCOLORS.fam[fam]; delete CARDCOLORS.fam[fam];
      Object.keys(CARDCOLORS.map).forEach(function(t){ if (CARDCOLORS.map[t] === fam) CARDCOLORS.map[t] = nn; });
      dati.forEach(function(p){ if (p.cardcolor === fam) p.cardcolor = nn; });
      reinjectFamilyColors(); renderList();
      withBtn(btn, saveColorsToRepo('colori: rinomina famiglia ' + fam + ' -> ' + nn), function(){ if (document.body.contains(overlay)) close(); });
    }, true);
    // 3) Sposta per tipo → questa famiglia
    var h3 = mkH(''); h3.replaceChildren(it ? 'Sposta un tipo in ' : 'Move a type into ', nodo('strong', null, fam));
    var selT = document.createElement('select'); selT.style.cssText = 'width:100%;padding:0.35rem;'; selT.setAttribute('aria-label', it ? 'Tipo da spostare' : 'Type to move');
    // La destinazione è SEMPRE la famiglia in cima (fam). Nella option mostriamo
    // il tipo + la sua famiglia ATTUALE (senza freccia, che faceva sembrare la
    // option stessa una destinazione) + il conteggio voci.
    Object.keys(CARDCOLORS.map).sort().forEach(function(t){ var o = document.createElement('option'); o.value = t; o.textContent = t + '  (' + (it ? 'ora ' : 'now ') + CARDCOLORS.map[t] + ', ' + tipoCount(t) + ')'; selT.appendChild(o); });
    var bMove = mkBtn(it ? 'Sposta e salva' : 'Move & save', function(btn){
      var t = selT.value; var moved = 0;
      CARDCOLORS.map[t] = fam;
      dati.forEach(function(p){ if (!customPair(p) && stripClassOf(p) === t) { p.cardcolor = fam; moved++; } });
      reinjectFamilyColors(); renderList();
      withBtn(btn, saveColorsToRepo('colori: sposta ' + t + ' -> ' + fam + ' (' + moved + ' voci)'));
    }, true);
    [ctrl.el, srow, bColSave, h2, rin, bRen, h3, selT, bMove].forEach(function(el){ panel.appendChild(el); });
  }
  function tipoCount(t){ var n = 0; for (var i = 0; i < dati.length; i++) if (!customPair(dati[i]) && stripClassOf(dati[i]) === t) n++; return n; }

  // Anteprima in tempo reale: per ENTRAMBI i temi mostra tutti gli elementi che
  // il colore definisce. CARD: sfondo (rgba a 0.05 chiaro / 0.10 scuro) +
  // striscia (0.85) + nome + etichetta tipo (bordo/testo alla terna). SCHEDA:
  // bordo famiglia + testo AA-safe (--cctext via ccAaText) + filetto fonte.
  // Fedele a renderList/openModal; colori concreti (nessun var(), mai visto dal Nu).
  function renderPreview(host, darkHex, lightHex, sampleName, sampleTipo){
    host.replaceChildren();
    // [tema, hex, sfondoPagina, sfondoScheda, opacitàCard, coloreTesto]
    // Ordine: CHIARO a sinistra, SCURO a destra (in colonna con le caselle sopra).
    [['light', lightHex, '#F5F5F5', '#F4F4F4', 0.05, 'rgba(30,30,34,0.92)'],
     ['dark', darkHex, '#262626', '#252525', 0.10, 'rgba(232,232,232,0.92)']].forEach(function(row){
      var hex = row[1], pageBg = row[2], modalBg = row[3], cardOp = row[4], txt = row[5];
      var trip = ccHexToTriplet(hex);
      var cct = ccHexToTriplet(ccAaText(hex, modalBg, 4.5));
      // Testo della pill-tipo dell'anteprima reso AA sul fondo REALE della card
      // (pageBg miscelato con la terna a bassa opacità, come nella card vera),
      // stessa logica --cctext della scheda: tiene la tinta ma garantisce l'AA.
      var _bg = ccHexToTriplet(pageBg).split(',').map(Number), _fg = ccHexToTriplet(hex).split(',').map(Number);
      var cardBgHex = ccTripletToHex(_bg.map(function(c,i){ return Math.round(c*(1-cardOp)+_fg[i]*cardOp); }).join(','));
      var tct = ccHexToTriplet(ccAaText(hex, cardBgHex, 4.6));
      var col = document.createElement('div'); col.style.cssText = 'flex:1;min-width:0;';
      col.appendChild(nodo('div', { style: 'background:' + pageBg + ';border:1px solid rgba(128,128,128,0.5);border-radius:8px;padding:0.5rem;display:flex;flex-direction:column;gap:0.5rem;' },
        nodo('div', { style: 'position:relative;background:rgba(' + trip + ',' + cardOp + ');border:1px solid rgba(128,128,128,0.18);border-radius:6px;padding:0.4rem 0.5rem 0.4rem 0.75rem;overflow:hidden;' },
          nodo('span', { style: 'position:absolute;left:0;top:0;bottom:0;width:5px;background:rgba(' + trip + ',0.85);' }),
          nodo('div', { style: 'color:' + txt + ';font-weight:600;font-size:0.78rem;line-height:1.15;' }, sampleName),
          nodo('span', { style: 'display:inline-block;margin-top:0.28rem;font-size:0.6rem;padding:1px 6px;border-radius:4px;color:rgba(' + tct + ',1);border:1px solid rgba(' + trip + ',0.8);' }, sampleTipo)),
        nodo('div', { style: 'background:' + modalBg + ';border:1px solid rgba(' + trip + ',0.9);border-radius:6px;padding:0.4rem 0.55rem;' },
          nodo('div', { style: 'color:rgba(' + cct + ',1);font-size:0.56rem;letter-spacing:0.09em;font-weight:700;' }, (it ? 'POSIZIONE' : 'RANK') + ' 1'),
          nodo('div', { style: 'color:' + txt + ';font-size:0.74rem;margin:0.12rem 0 0.2rem;' }, sampleName),
          nodo('div', { style: 'color:rgba(' + cct + ',1);font-size:0.6rem;border-bottom:1px solid rgba(' + trip + ',0.32);padding-bottom:0.2rem;display:inline-block;' }, it ? 'Il Silmarillion' : 'The Silmarillion'))));
      host.appendChild(col);
    });
  }
  // Controllo colore condiviso (Personaggio e Famiglie): 'Scegli colore' apre il
  // picker; alla scelta le due varianti tema si derivano da sé (ccDerivePair) e
  // restano in sola lettura, con anteprima in tempo reale via renderPreview.
  // initDark/initLight = colori di partenza (mostrati finché non si sceglie un
  // nuovo colore, così aprire+salvare non altera un colore intoccato).
  function buildColorControl(initDark, initLight, sampleName, sampleTipo){
    var state = { dark: initDark, light: initLight };
    var wrap = document.createElement('div');
    var baseInput = document.createElement('input'); baseInput.type = 'color'; baseInput.setAttribute('aria-label', it ? 'Selettore colore' : 'Colour picker');
    baseInput.value = ccTheme() === 'light' ? initLight : initDark;
    baseInput.style.cssText = 'position:absolute;width:0;height:0;opacity:0;pointer-events:none;';
    var chooseBtn = document.createElement('button'); chooseBtn.className = 'fab-modal-confirm';
    chooseBtn.style.cssText = 'width:auto;padding:0.5rem 1.1rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.5rem;';
    var baseSw = document.createElement('span'); baseSw.style.cssText = 'width:18px;height:18px;border-radius:4px;border:1px solid rgba(128,128,128,0.5);display:inline-block;background:' + baseInput.value + ';';
    chooseBtn.appendChild(baseSw); chooseBtn.appendChild(document.createTextNode(it ? 'Scegli colore' : 'Pick colour'));
    chooseBtn.onclick = function(){ baseInput.click(); };
    // Campo HEX editabile accanto al tasto: digitare/incollare un colore aggiorna
    // tutto (anteprima + varianti tema) senza aprire il picker nativo, la cui
    // modalità HEX/RGB/HSL è cromo del browser e NON è impostabile via web.
    var hexInput = document.createElement('input'); hexInput.type = 'text'; hexInput.spellcheck = false;
    hexInput.maxLength = 7; hexInput.setAttribute('aria-label', it ? 'Codice colore HEX' : 'HEX colour code');
    hexInput.value = baseInput.value;
    hexInput.style.cssText = 'width:88px;padding:0.4rem 0.5rem;font-family:ui-monospace,monospace;font-size:0.82rem;text-align:center;border-radius:6px;border:1px solid rgba(128,128,128,0.5);background:transparent;color:inherit;';
    var centerBox = document.createElement('div'); centerBox.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;gap:0.5rem;';
    centerBox.appendChild(chooseBtn); centerBox.appendChild(hexInput);
    // Casella swatch+hex (senza etichetta): va agli estremi, per non confliggere
    // col tasto centrale.
    function swatchBox(){
      var box = document.createElement('div'); box.style.cssText = 'display:inline-flex;align-items:center;gap:0.4rem;font-size:0.76rem;';
      var sw = document.createElement('span'); sw.style.cssText = 'width:22px;height:18px;border-radius:4px;border:1px solid rgba(128,128,128,0.5);display:inline-block;flex:none;';
      var hx = document.createElement('span'); hx.style.cssText = 'font-family:ui-monospace,monospace;';
      box.appendChild(sw); box.appendChild(hx);
      return { box: box, sw: sw, hx: hx };
    }
    var swLight = swatchBox(), swDark = swatchBox();
    // Riga: casella chiaro a SINISTRA, tasto al CENTRO (colonna auto), casella
    // scuro a DESTRA. Grid 1fr/auto/1fr = tasto sempre centrato, caselle agli estremi.
    var topRow = document.createElement('div');
    topRow.style.cssText = 'display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:0.6rem;margin:0.4rem 0 1rem;';
    swLight.box.style.justifySelf = 'start'; swDark.box.style.justifySelf = 'end';
    topRow.appendChild(swLight.box); topRow.appendChild(centerBox); topRow.appendChild(swDark.box);
    topRow.appendChild(baseInput);
    // Etichette tema CENTRATE, ciascuna in testa al proprio riquadro (chiaro sx,
    // scuro dx, in colonna coi riquadri di anteprima sotto).
    var labRow = document.createElement('div'); labRow.style.cssText = 'display:flex;gap:0.6rem;margin:0 0 0.45rem;';
    [it ? 'Tema chiaro' : 'Light theme', it ? 'Tema scuro' : 'Dark theme'].forEach(function(t){
      var c = document.createElement('div'); c.style.cssText = 'flex:1;min-width:0;text-align:center;font-size:0.74rem;opacity:0.75;';
      c.textContent = t; labRow.appendChild(c);
    });
    var prevWrap = document.createElement('div'); prevWrap.style.cssText = 'display:flex;gap:0.6rem;margin:0;';
    function update(){
      swLight.sw.style.background = state.light; swLight.hx.textContent = state.light;
      swDark.sw.style.background = state.dark; swDark.hx.textContent = state.dark;
      renderPreview(prevWrap, state.dark, state.light, sampleName, sampleTipo);
      // Gancio dell'anteprima live (vista divisa): si aggancia DOPO la
      // costruzione, quindi la prima update() non lo chiama mai.
      if (api && api.hook) api.hook({ dark: state.dark, light: state.light });
    }
    function applyBase(hex, syncHex){ var pr = ccDerivePair(hex); state.dark = pr.dark; state.light = pr.light; baseInput.value = hex; baseSw.style.background = hex; if (syncHex) hexInput.value = hex; update(); }
    baseInput.addEventListener('input', function(){ applyBase(baseInput.value, true); });
    hexInput.addEventListener('input', function(){ var v = hexInput.value.trim(); if (v && v.charAt(0) !== '#') v = '#' + v; if (/^#[0-9a-fA-F]{6}$/.test(v)) applyBase(v.toLowerCase(), false); });
    hexInput.addEventListener('blur', function(){ hexInput.value = baseInput.value; });
    var api = {
      el: wrap,
      hook: null, // onChange dell'anteprima live (dock); anche il ripristino 'ultimo salvato' passa da qui via set()
      get: function(){ return { dark: state.dark, light: state.light }; },
      set: function(d, l){ state.dark = d; state.light = l; baseInput.value = ccTheme() === 'light' ? l : d; baseSw.style.background = baseInput.value; hexInput.value = baseInput.value; update(); }
    };
    update();
    wrap.appendChild(topRow); wrap.appendChild(labRow); wrap.appendChild(prevWrap);
    return api;
  }

  // Helper UI condivisi
  function mkBtn(label, fn, green){
    var b = document.createElement('button'); b.className = 'fab-modal-confirm'; b.textContent = label;
    if (green) b.style.cssText = 'background:rgba(90,200,110,0.16);';
    b.onclick = function(){ fn(b); };
    return b;
  }
  function mkH(txt){ var h = document.createElement('p'); h.style.cssText = 'font-weight:600;font-size:0.82rem;margin:0.7rem 0 0.2rem;border-top:1px solid rgba(128,128,128,0.2);padding-top:0.5rem;'; h.textContent = txt; return h; }
  function withBtn(btn, promise, onOk){
    btn.disabled = true; btn.style.opacity = '0.4';
    promise.then(function(res){
      if (res.ok) {
        // Salvataggio riuscito: l'ULTIMO SALVATO diventa lo stato attuale.
        CARDCOLORS_SAVED = JSON.parse(JSON.stringify(CARDCOLORS.fam));
        showToast(it?'✓ Salvato':'✓ Saved', false); if (onOk) onOk();
      }
      else { showToast((it?'✗ Salvataggio fallito: ':'✗ Save failed: ') + (res.reason||''), true); }
    }).finally(function(){ btn.disabled = false; btn.style.opacity = ''; });
  }
}
