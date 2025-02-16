## Mistra WEB APP

#### Frontend
Ho impostato Yarn come i progetti di lavoro quindi ti basta:
- yarn dentro la cartella frontend per scaricare i pacchetti
- yarn start per far partire tutto

Il frontend è su localhost:3000

#### Backend 
- yarn in backend

Poi navighi dentro la cartella plugins/test-plugin e fai:
- yarn
- yarn build (builda il plugin di strapi)

Poi torni in /backend e fai:
- yarn build
- yarn develop (fa partire strapi in modalità develop)

per accedere al portale admin di configurazione di Strapi è: localhost:1337, utente: davide.rossignolo@studenti.univr.it, pwd: Project@Pose2
In teoria non credo tu debba accedere al portale di CMS di strapi (è una roba tipo la gestione contenuti di wordpress).

#### Per Paolo
Di seguito ti lascio la parte di Testo del progetto e ti evidenzio in grassetto la parte che dovresti implementare tu:

"Parte di configurazione Si deve realizzare un sito web (locale) basato su STRAPI copiando le pagine dell’attuale sito
MISTRA. Essendo STRAPI un (headless) Content Management System (CMS), le pagine di Mistra saranno inseriti
come articoli/documenti in STRAPI.
L’organizzazione delle pagine pubbliche del sito dovrà essere circa uguale a quella del sito MISTRA attuale. Se
si trovano soluzione esteticamente migliori, sono ben accette.
**La parte accessibile dal pubblico dovrà essere validata secondo l’accessibilità AA WCAG 2.1. Visto che il sistema
è un CMS, non si può garantire l’accessibilità AA per le pagine che verranno inserite in futuro. Quello che si chiede
è che i menù, eventuali immagini e lo scheletro del sito pubblico siano accessibili secondo il livello AA.**"

Link alla documentazione accessibilità: https://www.w3.org/Translations/WCAG21-it/

#### Tempistiche
Non so quanto sia di lavoro da fare, ma ti direi che se riesci ad incastrare tutto tra impegni/lavoro e riposo mi piacerebbe avere la parte di accessibilità pronta per il **7 Febbraio**
così posso con calma controllare anche tutto il resto e vedere che sia tutto apposto (ovviamente se ti serve una mano chiedimi pure). Credo che con la tua esperienza non dovrebbe essere una cosa infattibile, tieni conto che il frontend è fatto con REACT e credo che tu debba solo andare a sistemare le classi CSS di Tailwind per l'accessibilità.


#### Test
Una volta finito il progetto si dovrà fare una presentazione, per la parte che riguarda l'accessibilità il testo dice così: 
- Preparare 2 slide in cui si mostra il processo di validazione AA WCAG 2.1 (che strumenti si sono scelti, che prove si sono fatte). Queste prove si devono poi mostrare dal vivo.
(ho visto che dovrebbero esistere dei software che ti aiutano a fare questo processo di testing di validazione, GPT mi aveva dato dei consigli, prova a richiedergli)

## Accessibilità

Riepilogo delle Modifiche per l'Accessibilità WCAG 2.1 AA

Questo documento riassume le modifiche principali apportate ai componenti React per renderli conformi alle linee guida WCAG 2.1 AA.

1. Struttura Semantica HTML:

Utilizzo corretto degli elementi HTML5: Abbiamo impiegato elementi come <article>, <aside>, <nav>, <main>, <section>, <ul>, <ol>, e <li> per strutturare il contenuto in modo significativo e gerarchico. Questo fornisce una mappa chiara della pagina per le tecnologie assistive.

Intestazioni (Headings): Utilizzo appropriato degli elementi <h1> - <h6> per strutturare il contenuto, assicurando che l'ordine delle intestazioni sia logico e rifletta la gerarchia del contenuto.

2. Attributi ARIA (Accessible Rich Internet Applications):

aria-label: Fornire alternative testuali per elementi non testuali o elementi interattivi che non hanno un'etichetta di testo chiara.

aria-labelledby: Associare regioni, sezioni o elementi complessi alle loro intestazioni o etichette descrittive, migliorando la navigazione e la comprensione del contenuto.

aria-describedby: Fornire informazioni aggiuntive o descrizioni per elementi interattivi, come campi di input.

aria-hidden="true": Nascondere elementi puramente decorativi (come icone SVG) dalle tecnologie assistive per evitare ridondanza e confusione.

aria-live="polite": Creare aree live per annunciare dinamicamente aggiornamenti di stato (caricamento, errori, messaggi) agli screen reader senza interrompere l'utente.

role="alert": Indicare che un elemento contiene un messaggio di avviso importante che richiede attenzione immediata.

role="list" e role="listitem": Definire le liste per gli screen reader.

3. Alternative Testuali:

Testo alternativo per immagini (alt attribute): Fornire descrizioni testuali significative per tutte le immagini, assicurando che il contenuto visivo sia accessibile agli utenti non vedenti.

title attribute per gli iframe: Aggiungere titoli descrittivi agli elementi iframe per fornire un contesto agli utenti di screen reader.

4. Accessibilità dei Form:

Label esplicite: Associare ogni campo di input a una label descrittiva utilizzando l'attributo for e l'ID corrispondente.

Attributi name e id: Usare attributi name ed id per gestire correttamente i form.

5. Accessibilità dei Link:

Testo del link significativo: Assicurarsi che il testo del link descriva chiaramente la destinazione del link.

aria-label per i link: Fornire etichette accessibili più specifiche per i link, se necessario.

rel="noopener noreferrer": Aggiungere questo attributo ai link che si aprono in una nuova scheda per migliorare la sicurezza e le prestazioni.

6. Accessibilità delle Tabelle:

summary attribute: Fornire una breve descrizione del contenuto della tabella utilizzando l'attributo summary.

scope="col" e scope="row": Utilizzare questi attributi per associare le intestazioni di colonna e di riga alle celle di dati corrispondenti, migliorando la navigabilità.

7. Contrasto di Colore:

Verifica del contrasto: Assicurarsi che il contrasto di colore tra il testo e lo sfondo sia conforme agli standard WCAG 1.4.3 (minimo 4.5:1 per il testo normale e 3:1 per il testo grande).

8. Gestione del Focus:

Ordine di focus logico: Assicurarsi che l'ordine di focus degli elementi interattivi segua un percorso logico e intuitivo.

Indicatore di focus visibile: Verificare che l'indicatore di focus sia chiaramente visibile su tutti gli elementi interattivi.

Aggiungere il tabIndex ai container: Aggiungiamo tabIndex="0" in modo che l'elemento possa essere raggiunto tramite tastiera.

9. Test e Validazione:

Test con screen reader: Utilizzare screen reader come NVDA, VoiceOver o JAWS per sperimentare le pagine come farebbero gli utenti con disabilità visive.

Test con tastiera: Navigare nelle pagine utilizzando solo la tastiera per verificare che tutti gli elementi siano accessibili e che l'ordine di focus sia logico.

Strumenti automatici: Utilizzare strumenti automatici di controllo dell'accessibilità come WAVE, axe DevTools o Lighthouse (in Chrome DevTools) per identificare potenziali problemi.

Ok, ecco un riepilogo più focalizzato sui tipi specifici di modifiche apportate durante la revisione dei componenti React, per renderli conformi a WCAG 2.1 AA.

**Riepilogo delle Modifiche Specifiche per l'Accessibilità WCAG 2.1 AA (Progetto React)**

Questo documento riassume le modifiche concrete apportate ai componenti React per migliorarne l'accessibilità, in linea con le WCAG 2.1 AA.

**1. Etichettatura e Descrizioni (WCAG 1.1.1, 2.4.4, 4.1.2):**

*   **`aria-label` dinamici per immagini:** Implementato testo alternativo dinamico negli attributi `alt` delle immagini. Se il CMS fornisce un testo alternativo, viene usato; altrimenti, si genera un testo predefinito basato sul contesto (es. "Immagine del servizio \[nome]").
*   **Descrizioni contestuali per link con `aria-label`:** Aggiunto `aria-label` ai componenti `Link` e `Button`, descrivendo la destinazione o l'azione che il componente intraprende (es. `aria-label="Vai alla pagina del servizio X"`).
*   **Titoli descrittivi per `iframe` con attributo `title`:** Inserito l'attributo `title` negli `iframe`, usando dinamicamente la descrizione fornita dal CMS o un testo predefinito ("Video da \[URL]").
*   **Identificazione delle sezioni con `aria-labelledby`:** Utilizzo di questa proprietà sulle sezioni e porzioni di codice più ampie per migliorarne la navigazione.

**2. Miglioramenti alla Struttura e alla Semantica (WCAG 1.3.1, 2.4.1, 2.4.6):**

*   **Uso appropriato di intestazioni (Headings):** Convertito elementi `div` con stili da intestazione nei tag semantici `<h1>`, `<h2>`, `<h3>` etc. ove appropriato, rispettando la gerarchia del contenuto.
*   **Implementazione di regioni con `<section>` e `<nav>`:** Racchiuso blocchi di contenuto correlati in elementi `<section>` o `<nav>`, fornendo un'etichetta tramite `aria-labelledby` per facilitare la navigazione.
*   **Liste semanticamente corrette (`<ul>`, `<ol>`, `<li>`):** Ove applicabile, convertito blocchi di `div` in liste, marcando le singole voci con `<li>` e aggiungendo `role="list"` ai contenitori.
*    **Implementazione corretta di `<table>`:** quando necessario abbiamo implementato l'utilizzo di `<table>` con i tag `<th>` che usano `scope="col"`

**3. Gestione del Focus e Interattività (WCAG 2.1.1, 2.4.7):**

*   **Aggiunta di `tabIndex="0"` a elementi interattivi non focusabili nativamente:** Reso navigabili da tastiera elementi come `div` e `span`, ove necessario.

**4. Avvisi e Messaggi Dinamici (WCAG 4.1.3):**

*   **Aggiunta di aree live con `aria-live="polite"`:** Implementato un div nascosto con `aria-live="polite"` per notificare cambiamenti di stato (es. caricamento, errori) agli screen reader in modo non intrusivo.
*   **Notifiche di errore con `role="alert"`:** Usato `role="alert"` per annunciare messaggi di errore o avvisi importanti, assicurando che gli utenti siano immediatamente consapevoli di problemi.

**5. Altro:**

*   **Icone Decorative Nascoste:** Aggiunta l'attributo `aria-hidden="true"` alle icone.
*   **Definizione dei tipi**: Definito i tipi in Typescript per una maggiore leggibilità del codice e per evitare l'utilizzo di `any`.

**Considerazioni aggiuntive:**

*   **Test con Screen Reader:** Continuare a testare ogni componente con screen reader reali (NVDA, VoiceOver, JAWS) per convalidare l'efficacia delle modifiche.
*   **Contrasto:** Assicurarsi che il contrasto di colore sia sempre corretto.
