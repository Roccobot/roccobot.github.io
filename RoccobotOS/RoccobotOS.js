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
  const VERSIONE = "3.40";
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
// DISPOSIZIONE su smartphone: l'indice in basso a SINISTRA nell'angolo, inizio e fine pagina
// in basso a DESTRA. Su desktop non cambia niente: i due salti in basso a destra, e l'indice
// non serve perche' la colonna laterale e' sempre in vista.
//
// VISIBILITA' su smartphone: tutti e tre si vedono mentre si SCORRE e spariscono dopo 3
// secondi di quiete. Ognuno ha in piu' una condizione sua, e sono tutte e tre della stessa
// natura: si nasconde il comando che in quel momento non porta da nessuna parte.
//   - 'vai in cima' non compare se si e' gia' in cima, 'vai in fondo' se si e' gia' in fondo;
//   - l'indice non compare quando l'indice e' gia' APERTO, e li' c'e' anche la ragione per
//     cui l'utente ha chiesto il cambio: il pannello arriva fino in fondo allo schermo, e un
//     tasto in quell'angolo gli copriva la parte bassa.
//
// ⚠️ STORIA, perche' il codice da solo non la racconta: fino al 2026-08-01 c'era anche un
// gruppo di SINISTRA (tema piu' indice) visibile a pagina FERMA, cioe' l'esatto opposto della
// destra. L'idea era buona ma si scontrava col pannello dell'indice; il tasto del tema e'
// finito dietro un flag e l'indice e' passato di qua. Se un domani si vuole riprovare la
// simmetria, il difetto da risolvere prima e' quello.
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

  // ⚠️ FEATURE FLAG. Anche il pulsante del tema sparisce (istruzione dell'utente,
  // 2026-08-01): con l'indice aperto i comandi di sinistra ne coprivano il fondo, e fra i
  // due questo e' il sacrificabile, perche' il tema segue gia' la preferenza del SISTEMA e
  // l'utente dice di non commutarlo quasi mai. La logica del tema resta tutta al suo posto,
  // tasto `T` compreso: sparisce il bottone, non la funzione.
  const FLAG_TASTO_TEMA = false;

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

  // Stessa sorte del pulsante delle tabelle: fuori dal giro del Tab e invisibile ai lettori
  // di schermo, non solo nascosto al CSS.
  if (!FLAG_TASTO_TEMA) {
    tastoTema.hidden = true;
    tastoTema.setAttribute("aria-hidden", "true");
    tastoTema.setAttribute("tabindex", "-1");
  }

  // ── Indice su smartphone ──
  // ⚠️ Aprire o chiudere l'indice cambia anche la visibilita' del suo pulsante, quindi le due
  // funzioni chiamano aggiornaComandi(): a indice aperto il pulsante se ne va, per non
  // coprire il fondo del pannello. Se ci si dimentica la chiamata il difetto non si vede
  // subito, perche' il primo scorrimento successivo rimette tutto a posto da solo.
  function chiudiIndice() {
    html.removeAttribute("data-mobile-toc");
    if (tastoIndice) {
      tastoIndice.setAttribute("aria-pressed", "false");
      tastoIndice.setAttribute("aria-expanded", "false");
    }
    aggiornaComandi();
  }
  function commutaIndice() {
    if (!mqMobile.matches) return;
    if (html.getAttribute("data-mobile-toc") === "open") return chiudiIndice();
    html.setAttribute("data-mobile-toc", "open");
    if (tastoIndice) {
      tastoIndice.setAttribute("aria-pressed", "true");
      tastoIndice.setAttribute("aria-expanded", "true");
    }
    aggiornaComandi();
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
  // ⚠️ Il gruppo di SINISTRA non esiste piu' (2026-08-01). Era tema piu' indice, visibile a
  // pagina ferma; ma quando l'indice si apre, il pannello arriva fino in fondo allo schermo e
  // quei due tasti ne coprivano la parte bassa. Il tema e' sparito dietro un flag, e l'indice
  // e' passato alla regola di destra: si vede mentre si SCORRE. In piu' sparisce a indice
  // aperto, perche' li' non serve piu': le uniche mosse sensate sono toccare una voce o
  // toccare fuori per chiudere.

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
      const indiceAperto = html.getAttribute("data-mobile-toc") === "open";
      if (tastoIndice) (inMovimento && !indiceAperto) ? mostra(tastoIndice) : nascondi(tastoIndice);
      if (tastoCima) (inMovimento && !bordi.inCima) ? mostra(tastoCima) : nascondi(tastoCima);
      if (tastoFondo) (inMovimento && !bordi.inFondo) ? mostra(tastoFondo) : nascondi(tastoFondo);
    } else {
      if (FLAG_TASTO_TEMA) mostra(tastoTema);
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
