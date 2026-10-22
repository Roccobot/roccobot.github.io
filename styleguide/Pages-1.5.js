/* Keep the theme shortcut and return to the public RoccobotOS site. */
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


(function () {
  if (document.querySelector(".pg-back")) return;
  var a = document.createElement("a");
  a.className = "pg-back";
  a.href = "https://roccobot.github.io/RoccobotOS/";
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
