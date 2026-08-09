/* Pages.js - tasto T sulle SOTTO-PAGINE di RoccobotOS
   (Characters.html, Formats.html, AdServers.html, 'BlendModes.html').

   Le sotto-pagine non hanno il pulsante del tema, che vive nella pagina principale: qui il
   tema si cambia solo col tasto T, come chiesto dall'utente il 2026-08-01.

   NIENTE localStorage, di proposito (stessa istruzione): la pagina si apre sempre secondo la
   preferenza del SISTEMA operativo, e il tasto T vale per la visita in corso. Il tema scelto
   nella pagina principale non arriva fin qui, perché nemmeno lei lo memorizza.

   Come funziona: finché nessuno preme T non c'è nessun attributo data-theme, quindi decide
   la media query prefers-color-scheme di Pages.css. Al primo T si scrive data-theme con il
   verso opposto a quello che si sta vedendo, e da lì in poi vince l'attributo. Il tema di
   partenza si legge da matchMedia, non dall'attributo, o la prima pressione non farebbe
   nulla su un sistema in tema scuro.

   Le due guardie sono obbligatorie e sono le stesse della pagina principale: si esce se è
   premuto un modificatore (o si rubano le scorciatoie del browser) e se il focus sta in un
   campo di testo (o scrivere una 't' commuterebbe il tema). */
(function () {
  var radice = document.documentElement;

  function scuroAdesso() {
    var forzato = radice.getAttribute("data-theme");
    if (forzato) return forzato === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "t" && ev.key !== "T") return;
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    var a = document.activeElement;
    if (a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) return;
    radice.setAttribute("data-theme", scuroAdesso() ? "light" : "dark");
  });
})();

/* ── FAB 'indietro' ──
   Le sotto-pagine non avevano NESSUN modo di tornare a index.html: ci si arrivava da un link
   e da lì restava solo il tasto indietro del browser, che non c'è su tutte le tastiere e non
   si vede. Il pulsante si crea da JS invece di scriverlo in quattro pagine: la fonte resta una
   sola, come per il foglio di stile. Si compone con createElement e textContent, mai con
   innerHTML (regola non derogabile). Se lo script non gira non compare, e la pagina resta
   esattamente com'era: nessuna dipendenza nuova per il contenuto. */
(function () {
  if (document.querySelector(".pg-back")) return;
  var a = document.createElement("a");
  a.className = "pg-back";
  a.href = "index.html";
  a.setAttribute("aria-label", "Torna alla pagina principale di RoccobotOS");
  a.title = "Torna alla pagina principale";
  var g = document.createElement("span");
  g.className = "pg-back-glyph";
  g.setAttribute("aria-hidden", "true");
  g.textContent = "←";
  a.appendChild(g);
  function metti() { document.body.insertBefore(a, document.body.firstChild); }
  if (document.body) metti();
  else document.addEventListener("DOMContentLoaded", metti);
})();
