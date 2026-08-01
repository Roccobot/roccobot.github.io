/* Pagine.js - tasto T sulle SOTTO-PAGINE di RoccobotOS
   (Caratteri.html, Formati.html, AdServers.html, 'Metodi di fusione.html').

   Le sotto-pagine non hanno il pulsante del tema, che vive nella pagina principale: qui il
   tema si cambia solo col tasto T, come chiesto dall'utente il 2026-08-01.

   NIENTE localStorage, di proposito (stessa istruzione): la pagina si apre sempre secondo la
   preferenza del SISTEMA operativo, e il tasto T vale per la visita in corso. Il tema scelto
   nella pagina principale non arriva fin qui, perche' nemmeno lei lo memorizza.

   Come funziona: finche' nessuno preme T non c'e' nessun attributo data-theme, quindi decide
   la media query prefers-color-scheme di Pagine.css. Al primo T si scrive data-theme con il
   verso opposto a quello che si sta vedendo, e da li' in poi vince l'attributo. Il tema di
   partenza si legge da matchMedia, non dall'attributo, o la prima pressione non farebbe
   nulla su un sistema in tema scuro.

   Le due guardie sono obbligatorie e sono le stesse della pagina principale: si esce se e'
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
