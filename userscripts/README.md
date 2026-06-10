# Userscript per Tampermonkey

Script personali per il browser, gestiti dall'estensione
[Tampermonkey](https://www.tampermonkey.net/). Essendo ospitati su
GitHub Pages, si installano (e si aggiornano) direttamente dal loro URL.

## Qwant Immagini — apri subito l'immagine originale

**File:** `qwant-immagini-dirette.user.js`

Nella ricerca immagini di Qwant (`qwant.com` → scheda *Immagini*), il clic su
una miniatura normalmente apre un pannello di anteprima. Con questo script il
clic apre invece **direttamente il file dell'immagine originale**, in una
nuova scheda.

### Installazione

1. Installare l'estensione Tampermonkey nel browser (se non c'è già).
2. Aprire questo indirizzo:
   <https://roccobot.github.io/userscripts/qwant-immagini-dirette.user.js>
3. Tampermonkey riconosce il file e mostra la pagina di installazione:
   premere **Installa**.

Gli aggiornamenti futuri arrivano da soli: Tampermonkey ricontrolla
periodicamente lo stesso indirizzo (`@updateURL`).

### Personalizzazione

In cima allo script c'è una sola impostazione:

```js
const APRI_IN_NUOVA_SCHEDA = true;
```

- `true` (predefinito): l'immagine si apre in una **nuova scheda**, la
  griglia dei risultati resta dov'è.
- `false`: l'immagine si apre nella **scheda corrente**.

Per cambiarla: icona Tampermonkey → *Dashboard* → clic sul nome dello script
→ modificare il valore → salvare (Ctrl+S).

### Come funziona

La pagina di Qwant riceve i risultati da un servizio interno
(`api.qwant.com/.../search/images`) che per ogni immagine indica sia la
miniatura mostrata in griglia sia l'indirizzo del file originale. Lo script:

1. ascolta quelle risposte e memorizza la coppia *miniatura → originale*;
2. al clic su una miniatura apre l'originale, bloccando il pannello di
   anteprima;
3. riscrive anche i link della griglia, così funzionano pure il **tasto
   centrale** del mouse e "Copia indirizzo link";
4. se una miniatura non è ancora in memoria (es. risultati arrivati già
   dentro l'HTML iniziale), interroga l'API come farebbe la pagina; se
   neppure così trova l'originale, ripristina il comportamento normale di
   Qwant (meglio l'anteprima di un clic morto).

### Limiti noti

- Se Qwant rinomina i campi della sua API interna (`media` / `thumbnail`),
  lo script smette di agire e il sito torna al comportamento di serie: non
  si rompe nulla, ma va aggiornato.
- L'"originale" è l'URL dichiarato dal sito di provenienza: se quel sito ha
  rimosso il file, l'immagine può risultare irraggiungibile (capita anche
  con l'anteprima di Qwant stessa).
