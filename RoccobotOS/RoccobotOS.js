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
  const VERSIONE = "3.20";
  // Due punti di resa, uno per formato: la pillola nell'angolo dell'indice su desktop,
  // il numero sopra il logo su mobile. A deciderlo e' il CSS, qui si scrivono entrambi.
  for (const id of ["siteVersion", "tocVersion"]) {
    const el = document.getElementById(id);
    if (el) el.textContent = "v" + VERSIONE;
  }
}();
!function(){const t=document.documentElement,e=window.matchMedia("(prefers-color-scheme: dark)"),n=document.getElementById("themeToggle"),o=document.getElementById("iconSun"),s=document.getElementById("iconMoon"),r=document.getElementById("tablesToggle"),a=document.getElementById("tablesIcon"),l=document.getElementById("scrollTopToggle"),i=document.getElementById("scrollBottomToggle"),c=document.getElementById("tocToggle"),d=document.getElementById("mweb_toc_list_iid");if(!n||!o||!s)return;
  /* Chi ha chiesto meno animazioni al sistema non riceve nemmeno lo scorrimento animato: la
     query si legge a ogni salto, non una volta sola, perche' l'impostazione puo' cambiare a
     pagina aperta. La controparte CSS sta in RoccobotOS.css. */
  const RMQ = window.matchMedia("(prefers-reduced-motion: reduce)"), SBV = () => RMQ.matches ? "auto" : "smooth";

/* Il pulsante del tema DICE quale tema e' attivo: prima l'etichetta era la sola parola
   'Cambia tema' e un lettore di schermo non poteva sapere da che parte si stava andando.
   aria-pressed e' lo stato, l'etichetta lo ripete a parole per chi non sente lo stato. */
function m(e){t.setAttribute("data-theme",e?"dark":"light"),o.style.display=e?"none":"",s.style.display=e?"":"none";const T=e?"Tema scuro attivo: passa al chiaro":"Tema chiaro attivo: passa allo scuro";n.setAttribute("aria-pressed",e?"true":"false"),n.setAttribute("aria-label",T),n.setAttribute("title",T)}function u(){m(e.matches)}u();let y=!1;e.addEventListener("change",()=>{y||u()}),n.addEventListener("click",()=>{y=!0;m(!("dark"===t.getAttribute("data-theme"))),setTimeout(()=>{y=!1},1500)});
  // ── Tasto T: cambia tema al volo ──
  // Come su 'I Grandi di Arda' (richiesta dell'utente, 2026-08-01). Tasto NUDO, quindi vale
  // solo dove c'e' una tastiera; con un modificatore premuto si lascia passare, o si
  // ruberebbero le scorciatoie del browser. La guardia sui campi di testo e' obbligatoria:
  // senza, scrivere una 't' nella ricerca del browser commuterebbe il tema.
  document.addEventListener("keydown", ev => {
    if (ev.key !== "t" && ev.key !== "T") return;
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    const a = document.activeElement;
    if (a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) return;
    y = !0;
    m(!("dark" === t.getAttribute("data-theme")));
    setTimeout(() => { y = !1 }, 1500);
  });const h=window.matchMedia("(max-width: 600px)");let p=!1;function f(e){"cards"===e?(t.setAttribute("data-tables","cards"),r&&r.setAttribute("aria-pressed","true"),a&&(a.textContent="▤"),function(){if(p)return;document.querySelectorAll(".markdown-body table").forEach(t=>{const e=t.querySelectorAll("thead th");if(!e.length)return;const n=Array.from(e).map(t=>t.textContent.trim());if(e.length<3)return;t.querySelectorAll("tbody tr").forEach(t=>{t.querySelectorAll("td").forEach((t,e)=>{const o=n[e];o&&(t.hasAttribute("data-label")||t.setAttribute("data-label",o))})})}),p=!0}()):(t.setAttribute("data-tables","standard"),r&&r.setAttribute("aria-pressed","false"),a&&(a.textContent="≡"))}function g(){t.removeAttribute("data-mobile-toc"),c&&(c.setAttribute("aria-pressed","false"),c.setAttribute("aria-expanded","false"))}function b(){if(!h.matches)return;"open"===t.getAttribute("data-mobile-toc")?g():h.matches&&(t.setAttribute("data-mobile-toc","open"),c&&(c.setAttribute("aria-pressed","true"),c.setAttribute("aria-expanded","true")))}function E(){l&&(l.style.opacity="",l.style.pointerEvents="",l.style.transform="translateX(0)")}function v(){i&&(i.style.opacity="",i.style.pointerEvents="",i.style.transform="translateX(0)")}
  /* Un comando a opacita' zero e' invisibile ma NON e' fuori dal giro del Tab: chi naviga da
     tastiera ci finiva sopra senza vedere nulla. opacity e pointer-events non bastano, e
     l'unico stato che il resto del codice conosce e' proprio l'opacita' in linea: la si legge
     e si adegua tabindex. Va richiamata dopo OGNI cambio di visibilita', non solo all'avvio. */
  function KB(){[n,r,l,i,c].forEach(el=>{if(!el)return;if("0"===el.style.opacity){el.setAttribute("tabindex","-1"),el.setAttribute("aria-hidden","true")}else{el.removeAttribute("tabindex"),el.removeAttribute("aria-hidden")}})}f("standard"),r&&r.addEventListener("click",()=>{if(!h.matches)return;f("cards"===t.getAttribute("data-tables")?"standard":"cards")}),l&&l.addEventListener("click",()=>{window.scrollTo({top:0,behavior:SBV()})}),i&&i.addEventListener("click",()=>{const F=()=>{const t=document.documentElement,e=document.body;return Math.max(t.scrollHeight,e.scrollHeight,t.offsetHeight,e.offsetHeight)};window.scrollTo({top:F(),behavior:SBV()});let k=0;const R=setInterval(()=>{const m=F()-(window.innerHeight||0);(++k>10||window.pageYOffset>=m-2)&&clearInterval(R),window.pageYOffset<m-2&&window.scrollTo({top:F(),behavior:SBV()})},300)}),c&&c.addEventListener("click",t=>{t.preventDefault(),b()}),d&&d.addEventListener("click",t=>{t.target.closest("a.toc-link")&&h.matches&&g()}),document.addEventListener("keydown",e=>{"Escape"===e.key&&"open"===t.getAttribute("data-mobile-toc")&&g()}),document.addEventListener("click",e=>{if(!h.matches)return;if("open"!==t.getAttribute("data-mobile-toc"))return;const n=document.querySelector(".mweb_toc_wrap_ct"),o=c;!n||n.contains(e.target)||o&&o.contains(e.target)||g()},!0);/* La distanza dal fondo del tasto dell'indice NON si memorizza all'avvio: se in quel momento
   la finestra e' larga il tasto e' nascosto e il valore letto sarebbe 'auto', che dopo una
   rotazione del telefono lo spediva fuori schermo per sempre. Per rimetterlo a posto si
   azzera lo stile in linea e si lascia decidere al CSS. */function A(){if(!l||!i)return;const{atTop:t,atBottom:e}=function(){const t=document.documentElement,e=document.body,n=window.pageYOffset||t.scrollTop||e.scrollTop||0;return{atTop:n<=4,atBottom:n+(window.innerHeight||t.clientHeight||e.clientHeight||0)>=Math.max(e.scrollHeight,t.scrollHeight,e.offsetHeight,t.offsetHeight,e.clientHeight,t.clientHeight)-4}}();t&&!e?(l&&(l.style.opacity="0",l.style.pointerEvents="none",l.style.transform="translateX(var(--hide-shift,16px))"),v()):e&&!t?(E(),i&&(i.style.opacity="0",i.style.pointerEvents="none",i.style.transform="translateX(var(--hide-shift,16px))")):(E(),v()),function(t,e){if(c&&h.matches)if(t&&!e&&l){const t=window.getComputedStyle(l);c.style.bottom=t.bottom}else if(e&&!t&&i){const t=window.getComputedStyle(i);c.style.bottom=t.bottom}else c.style.bottom=""}(t,e),KB()}let _=null;function S(){n.style.opacity="",n.style.pointerEvents="",n.style.transform="translateX(0)",r&&(r.style.opacity="",r.style.pointerEvents="",r.style.transform="translateX(0)"),l&&(l.style.opacity="",l.style.pointerEvents="",l.style.transform="translateX(0)"),i&&(i.style.opacity="",i.style.pointerEvents="",i.style.transform="translateX(0)"),c&&(c.style.opacity="",c.style.pointerEvents="",c.style.transform="translateX(0)"),A()}A(),h.matches&&S(),window.addEventListener("load",()=>{A(),h.matches&&S()}),window.addEventListener("scroll",()=>{A(),h.matches&&(n.style.opacity="0",n.style.pointerEvents="none",n.style.transform="translateX(var(--hide-shift,16px))",r&&h.matches&&(r.style.opacity="0",r.style.pointerEvents="none",r.style.transform="translateX(var(--hide-shift,16px))"),l&&h.matches&&(l.style.opacity="0",l.style.pointerEvents="none",l.style.transform="translateX(var(--hide-shift,16px))"),i&&h.matches&&(i.style.opacity="0",i.style.pointerEvents="none",i.style.transform="translateX(var(--hide-shift,16px))"),c&&h.matches&&(c.style.opacity="0",c.style.pointerEvents="none",c.style.transform="translateX(var(--hide-shift,16px))"),null!==_&&clearTimeout(_),_=setTimeout(()=>{S()},1e3),KB())},{passive:!0})}(),document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("markdown_content");if(!t)return;const e=t.querySelectorAll("h1,h2,h3,h4,h5,h6");const n=new Set;t.querySelectorAll("[id]").forEach(t=>{t.id&&n.add(t.id)}),e.forEach(t=>{if(t.id&&!/^mweb_tt_id_\d+$/.test(t.id))return void n.add(t.id);let e=function(t){if(!t)return"Section";const e=(""+t).trim();let n=e.replace(/[^A-Za-z0-9\u00C0-\u017F]+/g," ");if(n=n.replace(/\s+/g," ").trim(),!n)return"Section";const o=n.split(/\s+/),s=o.every(t=>t===t.toUpperCase());let r=e.replace(/[^\w\u00C0-\u017F]+/g,"_").replace(/^_+|_+$/g,"").replace(/_+/g,"_");if(r||(r=o.join("_")),s){let t=r.toUpperCase();return t=t.replace(/^[^A-Za-z]+/,""),t||(t="Section"),t}let a=o.map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join("");return a=a.replace(/^[^A-Za-z]+/,""),a||(a="Section"),a}(t.getAttribute("data-heading-label")||t.textContent||t.innerText||""),o=e,s=2;for(;n.has(o);)o=e+"_"+s,s+=1;t.id=o,n.add(o)}),"undefined"!=typeof tocbot&&tocbot.init({tocSelector:"#mweb_toc_list_iid",contentSelector:"#markdown_content",headingSelector:"h1, h2, h3, h4, h5, h6",orderedList:!1,collapseDepth:6,scrollEndCallback:function(){const t=document.querySelector("#mweb_toc_list_iid li.is-active-li"),e=document.querySelector("#mweb_toc_list_iid>ul>li:first-child");if(e&&e.classList.contains("is-active-li")){const t=document.getElementById("mweb_toc_list_iid");return void(t&&(t.scrollTop=0))}t&&("function"==typeof t.scrollIntoViewIfNeeded?t.scrollIntoViewIfNeeded():t.scrollIntoView(!0))}})}),// ── Caricamento pigro delle immagini ──
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
