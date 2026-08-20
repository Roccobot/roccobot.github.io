# `ext/`: i repository di estensioni per Mihon e Aniyomi

⚠️ **Questa cartella non è un progetto**: è la **vetrina pubblica** di un altro repository,
[`Roccobot/mihon-aniyomi-ext`](https://github.com/Roccobot/mihon-aniyomi-ext), che è privato. Qui
non si sviluppa niente e non si modifica niente a mano: il codice delle estensioni vive là, e qui
arrivano solo gli APK già compilati e firmati, con l'indice che li descrive.

## A che cosa serve, e perché non basta la release

Le app **non hanno modo di sapere** che esiste una versione nuova di un'estensione installata a
mano: controllano gli aggiornamenti solo confrontando quello che hai installato con l'indice dei
**repository configurati**. Una release di GitHub non è un repository di estensioni, è solo un
posto da cui scaricare un file.

⚠️ **La release privata NON sparisce e NON crea doppioni**: l'app non la conosce nemmeno. Le due
strade servono a due cose diverse, la release a installare a mano, questa a farsi aggiornare.

## Come si aggiunge nell'app

Un indirizzo per applicazione, perché gli indici dei due ecosistemi non sono compatibili:

| app | indirizzo da incollare |
|---|---|
| **Mihon** | `https://roccobot.github.io/ext/mihon/index.min.json` |
| **Aniyomi** | `https://roccobot.github.io/ext/aniyomi/index.min.json` |

Si incolla in *Impostazioni -> Sorgenti -> Repository di estensioni*.

## Com'è fatto

Ogni cartella è un repository completo e indipendente:

- **`repo.json`**: nome del repository e **impronta della chiave di firma**. ⚠️ L'app confronta
  quell'impronta con la firma degli APK: se non combaciano li **rifiuta**. È la ragione per cui
  la chiave di firma delle estensioni deve essere stabile, cosa che vale di per sé ma qui
  diventa un requisito.
- **`index.min.json`**: una voce per estensione, con nome del pacchetto, versione, e le sorgenti
  che contiene. ⚠️ Il campo `code` è il numero che l'app confronta con quello installato per
  decidere se proporre l'aggiornamento: **se non cresce, nessuno si accorge della versione
  nuova**.
- **`apk/`**: gli APK, cercati dall'app in questa sottocartella con il nome scritto nell'indice.

⚠️ **L'identificativo di ogni sorgente non è arbitrario**: si calcola dal nome e dalla lingua
della sorgente, con la stessa formula che l'app usa al suo interno. È anche la ragione per cui
rinominare una sorgente **stacca la libreria** da quello che c'era prima, mentre cambiare il nome
del pacchetto non la tocca.
