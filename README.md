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
