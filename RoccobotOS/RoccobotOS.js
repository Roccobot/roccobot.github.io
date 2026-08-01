/* RoccobotOS - il numero di versione NON si scrive qui: la sua unica fonte e' la costante
   VERSIONE poco sotto, che il numero in pagina legge a runtime. Un numero in questo commento
   sarebbe un secondo posto, e due posti prima o poi divergono.
   Vedi RoccobotOS/CLAUDE.md, sezione sulla versione. */

// ── Numero di versione in pagina ──
// Visibile dal 2026-07-31, in due punti alternativi secondo il formato (dal 2026-08-01): una
// pillola nell'angolo dell'indice su desktop, il numero sopra il logo su mobile. Il testo si
// scrive con textContent, mai con innerHTML (regola non derogabile). I due elementi in
// index.html nascono VUOTI: se questo script non gira il CSS li nasconde con :empty, invece di
// mostrare una 'v' senza numero.
!function () {
  const VERSIONE = "3.30";
  // Due punti di resa, uno per formato: la pillola nell'angolo dell'indice su desktop,
  // il numero sopra il logo su mobile. A deciderlo e' il CSS, qui si scrivono entrambi.
  for (const id of ["siteVersion", "tocVersion"]) {
    const el = document.getElementById(id);
    if (el) el.textContent = "v" + VERSIONE;
  }
}();
// ── Comandi fissi: tema, tabelle, indice, salti ──
// Riscritto in chiaro il 2026-08-01, prima era il minificato dell'export: la regola di
// visibilita' e' cambiata abbastanza da rendere il rattoppo meno leggibile della riscrittura.
//
// DISPOSIZIONE su smartphone (richiesta dell'utente, 2026-08-01): a SINISTRA tema e indice,
// a DESTRA inizio e fine pagina. Su desktop restano dov'erano: tema in alto a destra, i due
// salti in basso a destra, l'indice non serve perche' la colonna laterale e' sempre in vista.
//
// VISIBILITA' su smartphone, e i due lati sono l'esatto opposto l'uno dell'altro:
//   - a sinistra si vede quando la pagina sta FERMA (e all'apertura), e sparisce appena si
//     scorre;
//   - a destra si vede mentre si SCORRE, e sparisce dopo 3 secondi di quiete.
// Un solo temporizzatore governa i due gruppi, e per questo il comparire di un lato coincide
// con lo sparire dell'altro: se fossero due, prima o poi divergerebbero di qualche decina di
// millisecondi e si vedrebbero tutti e quattro insieme, o nessuno.
// I due salti hanno in piu' la regola dei BORDI, che vale sempre: 'vai in cima' non compare
// quando si e' gia' in cima, 'vai in fondo' quando si e' gia' in fondo.
!function () {
  const html = document.documentElement;
  const mqScuro = window.matchMedia("(prefers-color-scheme: dark)");
  const mqMobile = window.matchMedia("(max-width: 600px)");
  const mqMenoMoto = window.matchMedia("(prefers-reduced-motion: reduce)");

  const tastoTema = document.getElementById("themeToggle");
  const iconaSole = document.getElementById("iconSun");
  const iconaLuna = document.getElementById("iconMoon");
  const tastoTabelle = document.getElementById("tablesToggle");
  const iconaTabelle = document.getElementById("tablesIcon");
  const tastoCima = document.getElementById("scrollTopToggle");
  const tastoFondo = document.getElementById("scrollBottomToggle");
  const tastoIndice = document.getElementById("tocToggle");
  const listaIndice = document.getElementById("mweb_toc_list_iid");
  if (!tastoTema || !iconaSole || !iconaLuna) return;

  // ⚠️ FEATURE FLAG. Lo switch fra tabelle standard e schede resta nel codice ma non ha piu'
  // un pulsante: l'utente non l'ha mai usato (istruzione del 2026-08-01). Per rimetterlo basta
  // questo true, il pulsante e il CSS delle schede sono al loro posto. Non si cancella perche'
  // il lavoro di adattamento delle tabelle strette e' fatto e riaverlo costerebbe caro.
  const FLAG_SWITCH_TABELLE = false;

  // Quiete richiesta prima di invertire i due gruppi. Vale in un verso e nell'altro.
  const QUIETE = 3000;

  // Chi ha chiesto meno animazioni al sistema non riceve nemmeno lo scorrimento animato: la
  // query si legge a ogni salto, non una volta sola, perche' l'impostazione puo' cambiare a
  // pagina aperta. La controparte CSS sta in RoccobotOS.css.
  const andatura = () => mqMenoMoto.matches ? "auto" : "smooth";

  // ── Tema ──
  // Il pulsante DICE quale tema e' attivo: 'Cambia tema' da solo non faceva sapere a un
  // lettore di schermo da che parte si stava andando.
  function applicaTema(scuro) {
    html.setAttribute("data-theme", scuro ? "dark" : "light");
    iconaSole.style.display = scuro ? "none" : "";
    iconaLuna.style.display = scuro ? "" : "none";
    const etichetta = scuro ? "Tema scuro attivo: passa al chiaro" : "Tema chiaro attivo: passa allo scuro";
    tastoTema.setAttribute("aria-pressed", scuro ? "true" : "false");
    tastoTema.setAttribute("aria-label", etichetta);
    tastoTema.setAttribute("title", etichetta);
  }
  function temaDiSistema() { applicaTema(mqScuro.matches); }
  temaDiSistema();

  // Dopo una scelta manuale il sistema non comanda piu' per un momento, o il tema tornerebbe
  // indietro da solo se l'utente commuta proprio mentre il sistema cambia.
  let sceltaManuale = false;
  function commutaTema() {
    sceltaManuale = true;
    applicaTema(html.getAttribute("data-theme") !== "dark");
    setTimeout(() => { sceltaManuale = false }, 1500);
  }
  mqScuro.addEventListener("change", () => { if (!sceltaManuale) temaDiSistema() });
  tastoTema.addEventListener("click", commutaTema);

  // ── Tasti nudi e scorciatoie ──
  // T commuta il tema (come su 'I Grandi di Arda'). Tasto NUDO, quindi vale solo dove c'e'
  // una tastiera; con un modificatore premuto si lascia passare, o si rubano le scorciatoie
  // del browser.
  // ⌘/Ctrl + freccia su o giu' portano in cima e in fondo, come i due pulsanti e come su
  // 'I Grandi di Arda' (richiesta dell'utente, 2026-08-01). Si fa preventDefault perche'
  // l'override sulla scorciatoia del browser e' esplicitamente voluto; il salto e' ISTANTANEO,
  // sempre come su Arda, dove i pulsanti sono fluidi e la tastiera no.
  // La guardia sui campi di testo e' obbligatoria in entrambi i casi: senza, scrivere una 't'
  // nella ricerca del browser commuterebbe il tema, e le frecce non scriverebbero piu'.
  function inCampoDiTesto() {
    const a = document.activeElement;
    return !!(a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)));
  }
  document.addEventListener("keydown", ev => {
    if (inCampoDiTesto()) return;
    if ((ev.metaKey || ev.ctrlKey) && !ev.altKey && !ev.shiftKey) {
      if (ev.key === "ArrowUp") { ev.preventDefault(); vaiInCima(false); return; }
      if (ev.key === "ArrowDown") { ev.preventDefault(); vaiInFondo(false); return; }
      return;
    }
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (ev.key === "t" || ev.key === "T") commutaTema();
    if (ev.key === "Escape" && html.getAttribute("data-mobile-toc") === "open") chiudiIndice();
  });

  // ── Tabelle a schede (dietro il flag) ──
  let etichetteMesse = false;
  function etichettaCelle() {
    if (etichetteMesse) return;
    document.querySelectorAll(".markdown-body table").forEach(tab => {
      const th = tab.querySelectorAll("thead th");
      if (th.length < 3) return;
      const nomi = Array.from(th).map(x => x.textContent.trim());
      tab.querySelectorAll("tbody tr").forEach(tr => {
        tr.querySelectorAll("td").forEach((td, k) => {
          if (nomi[k] && !td.hasAttribute("data-label")) td.setAttribute("data-label", nomi[k]);
        });
      });
    });
    etichetteMesse = true;
  }
  function modoTabelle(modo) {
    const schede = modo === "cards";
    html.setAttribute("data-tables", schede ? "cards" : "standard");
    if (tastoTabelle) tastoTabelle.setAttribute("aria-pressed", schede ? "true" : "false");
    if (iconaTabelle) iconaTabelle.textContent = schede ? "▤" : "≡";
    if (schede) etichettaCelle();
  }
  modoTabelle("standard");
  if (tastoTabelle) {
    if (FLAG_SWITCH_TABELLE) {
      tastoTabelle.addEventListener("click", () => {
        if (!mqMobile.matches) return;
        modoTabelle(html.getAttribute("data-tables") === "cards" ? "standard" : "cards");
      });
    } else {
      // Fuori dal giro del Tab e invisibile ai lettori di schermo, non solo nascosto al CSS.
      tastoTabelle.hidden = true;
      tastoTabelle.setAttribute("aria-hidden", "true");
      tastoTabelle.setAttribute("tabindex", "-1");
    }
  }

  // ── Indice su smartphone ──
  function chiudiIndice() {
    html.removeAttribute("data-mobile-toc");
    if (tastoIndice) {
      tastoIndice.setAttribute("aria-pressed", "false");
      tastoIndice.setAttribute("aria-expanded", "false");
    }
  }
  function commutaIndice() {
    if (!mqMobile.matches) return;
    if (html.getAttribute("data-mobile-toc") === "open") return chiudiIndice();
    html.setAttribute("data-mobile-toc", "open");
    if (tastoIndice) {
      tastoIndice.setAttribute("aria-pressed", "true");
      tastoIndice.setAttribute("aria-expanded", "true");
    }
  }
  if (tastoIndice) tastoIndice.addEventListener("click", ev => { ev.preventDefault(); commutaIndice() });
  if (listaIndice) listaIndice.addEventListener("click", ev => {
    if (ev.target.closest("a.toc-link") && mqMobile.matches) chiudiIndice();
  });
  document.addEventListener("click", ev => {
    if (!mqMobile.matches) return;
    if (html.getAttribute("data-mobile-toc") !== "open") return;
    const pannello = document.querySelector(".mweb_toc_wrap_ct");
    if (pannello && pannello.contains(ev.target)) return;
    if (tastoIndice && tastoIndice.contains(ev.target)) return;
    chiudiIndice();
  }, true);

  // ── Salti in cima e in fondo ──
  function altezzaPagina() {
    const d = document.documentElement, b = document.body;
    return Math.max(d.scrollHeight, b.scrollHeight, d.offsetHeight, b.offsetHeight);
  }
  function vaiInCima(fluido) {
    window.scrollTo({ top: 0, behavior: fluido ? andatura() : "auto" });
  }
  // Il fondo si rimisura: le immagini a caricamento pigro allungano la pagina mentre si
  // scende, e un solo scrollTo si fermerebbe dove il fondo era un attimo prima. Dieci
  // tentativi a 300 ms sono il tetto: oltre, e' un caso che non si chiudera' comunque.
  function vaiInFondo(fluido) {
    const modo = fluido ? andatura() : "auto";
    window.scrollTo({ top: altezzaPagina(), behavior: modo });
    let giri = 0;
    const t = setInterval(() => {
      const meta = altezzaPagina() - (window.innerHeight || 0);
      if (++giri > 10 || window.pageYOffset >= meta - 2) return clearInterval(t);
      window.scrollTo({ top: altezzaPagina(), behavior: modo });
    }, 300);
  }
  if (tastoCima) tastoCima.addEventListener("click", () => vaiInCima(true));
  if (tastoFondo) tastoFondo.addEventListener("click", () => vaiInFondo(true));

  // ── Visibilita' dei comandi ──
  const SINISTRA = [tastoTema, tastoIndice];
  const DESTRA = [tastoCima, tastoFondo];

  function mostra(el) {
    if (!el) return;
    el.style.opacity = "";
    el.style.pointerEvents = "";
    el.style.transform = "translateX(0)";
  }
  function nascondi(el) {
    if (!el) return;
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
    el.style.transform = "translateX(var(--hide-shift,16px))";
  }
  function aiBordi() {
    const d = document.documentElement, b = document.body;
    const y = window.pageYOffset || d.scrollTop || b.scrollTop || 0;
    const h = window.innerHeight || d.clientHeight || b.clientHeight || 0;
    return { inCima: y <= 4, inFondo: y + h >= altezzaPagina() - 4 };
  }

  // Un comando a opacita' zero e' invisibile ma NON e' fuori dal giro del Tab: chi naviga da
  // tastiera ci finiva sopra senza vedere nulla. Si adegua tabindex leggendo l'opacita' in
  // linea, che e' l'unico stato che il resto del codice conosce.
  function sincronizzaTab() {
    [tastoTema, tastoTabelle, tastoCima, tastoFondo, tastoIndice].forEach(el => {
      if (!el) return;
      if (el.hidden) return;
      if (el.style.opacity === "0") {
        el.setAttribute("tabindex", "-1");
        el.setAttribute("aria-hidden", "true");
      } else {
        el.removeAttribute("tabindex");
        el.removeAttribute("aria-hidden");
      }
    });
  }

  // Vero mentre si scorre, falso dopo QUIETE millisecondi di fermo. Su desktop non serve:
  // la' i comandi stanno sempre in vista.
  let inMovimento = false;

  function aggiornaComandi() {
    const bordi = aiBordi();
    if (mqMobile.matches) {
      SINISTRA.forEach(el => inMovimento ? nascondi(el) : mostra(el));
      if (tastoCima) (inMovimento && !bordi.inCima) ? mostra(tastoCima) : nascondi(tastoCima);
      if (tastoFondo) (inMovimento && !bordi.inFondo) ? mostra(tastoFondo) : nascondi(tastoFondo);
    } else {
      mostra(tastoTema);
      bordi.inCima ? nascondi(tastoCima) : mostra(tastoCima);
      bordi.inFondo ? nascondi(tastoFondo) : mostra(tastoFondo);
    }
    sincronizzaTab();
  }

  let orologio = null;
  function segnalaScorrimento() {
    if (!mqMobile.matches) { aggiornaComandi(); return; }
    inMovimento = true;
    aggiornaComandi();
    if (orologio !== null) clearTimeout(orologio);
    orologio = setTimeout(() => { inMovimento = false; aggiornaComandi() }, QUIETE);
  }

  aggiornaComandi();
  window.addEventListener("load", aggiornaComandi);
  window.addEventListener("scroll", segnalaScorrimento, { passive: true });
  // Passando da smartphone a finestra larga (o girando il telefono) la regola cambia del
  // tutto: si riparte dallo stato di quiete invece di ereditare quello di prima.
  mqMobile.addEventListener("change", () => {
    inMovimento = false;
    if (orologio !== null) { clearTimeout(orologio); orologio = null }
    chiudiIndice();
    aggiornaComandi();
  });
}(),document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("markdown_content");if(!t)return;const e=t.querySelectorAll("h1,h2,h3,h4,h5,h6");const n=new Set;t.querySelectorAll("[id]").forEach(t=>{t.id&&n.add(t.id)}),e.forEach(t=>{if(t.id&&!/^mweb_tt_id_\d+$/.test(t.id))return void n.add(t.id);let e=function(t){if(!t)return"Section";const e=(""+t).trim();let n=e.replace(/[^A-Za-z0-9\u00C0-\u017F]+/g," ");if(n=n.replace(/\s+/g," ").trim(),!n)return"Section";const o=n.split(/\s+/),s=o.every(t=>t===t.toUpperCase());let r=e.replace(/[^\w\u00C0-\u017F]+/g,"_").replace(/^_+|_+$/g,"").replace(/_+/g,"_");if(r||(r=o.join("_")),s){let t=r.toUpperCase();return t=t.replace(/^[^A-Za-z]+/,""),t||(t="Section"),t}let a=o.map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join("");return a=a.replace(/^[^A-Za-z]+/,""),a||(a="Section"),a}(t.getAttribute("data-heading-label")||t.textContent||t.innerText||""),o=e,s=2;for(;n.has(o);)o=e+"_"+s,s+=1;t.id=o,n.add(o)}),"undefined"!=typeof tocbot&&tocbot.init({tocSelector:"#mweb_toc_list_iid",contentSelector:"#markdown_content",headingSelector:"h1, h2, h3, h4, h5, h6",orderedList:!1,collapseDepth:6,scrollEndCallback:function(){const t=document.querySelector("#mweb_toc_list_iid li.is-active-li"),e=document.querySelector("#mweb_toc_list_iid>ul>li:first-child");if(e&&e.classList.contains("is-active-li")){const t=document.getElementById("mweb_toc_list_iid");return void(t&&(t.scrollTop=0))}t&&("function"==typeof t.scrollIntoViewIfNeeded?t.scrollIntoViewIfNeeded():t.scrollIntoView(!0))}})}),// ── Caricamento pigro delle immagini ──
// Restava solo il ramo utile. C'era anche un IntersectionObserver che sorvegliava img[data-src]
// e aggiungeva la classe lazy-loaded: nessuna immagine della pagina usa data-src, quindi non
// osservava niente e la classe non arrivava mai (le sue regole CSS sono cadute con lui). Il
// caricamento pigro vero lo fa il browser con l'attributo loading.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img:not([loading])").forEach(img => img.setAttribute("loading", "lazy"));
});

// ── Scorrimento da tastiera dei contenitori larghi ──
// Tabelle e blocchi di codice che sbordano in orizzontale si scorrevano solo col dito o col
// mouse. Il tabindex si mette SOLO dove serve davvero (scrollWidth > clientWidth): metterlo su
// tutte le tabelle infilerebbe una quarantina di fermate inutili nel giro del Tab. La misura si
// rifa' al ridimensionamento, perche' una tabella stretta puo' diventare larga e viceversa.
document.addEventListener("DOMContentLoaded", () => {
  const CANDIDATI = ".markdown-body table, .markdown-body pre, .markdown-body div > pre, .plist-box";
  function sync() {
    document.querySelectorAll(CANDIDATI).forEach(el => {
      const ov = getComputedStyle(el).overflowX;
      const scorre = (ov === "auto" || ov === "scroll") && el.scrollWidth > el.clientWidth + 1;
      if (scorre) {
        if (el.getAttribute("tabindex") !== "0") {
          el.setAttribute("tabindex", "0");
          el.setAttribute("role", "region");
          el.setAttribute("aria-label", "Contenuto scorrevole in orizzontale");
        }
      } else if (el.getAttribute("tabindex") === "0") {
        el.removeAttribute("tabindex");
        el.removeAttribute("role");
        el.removeAttribute("aria-label");
      }
    });
  }
  sync();
  window.addEventListener("load", sync);
  let t = null;
  window.addEventListener("resize", () => { null !== t && clearTimeout(t); t = setTimeout(sync, 200) });
});
