# Playwright Base Tests

## allgemeines

dieses test set dient als basis um verschiedene tests, welche für alle projekte gültig sind.

bisherige tests:

- startseite hat einen page title
- startseite hat die supi extension implentiert und cookies lassen sich setzen
- projekt hat eine 404 seite mit einer entsprechenden h1
- key templates werden einem w3c check unterzogen
- key templates werden einem a11y check unterzogen

> alle einstellungen werden in einer dotenv datei im test root vorgenommen.

> achtung, es gibt im tests folder eine eigene nvmrc datei. bitte auf mögliche unterschiede zum verwendeten 
> projekt  ein `nvm use` anwenden

## how to use

* im app/tests (sofern vorhanden), das repository in ein eigenes verzeichnis clonen
  * beispiel: `app/tests/playwright-base`
* das git verzeichnis entfernen im playwright-base test verzeichnis ;)
* in das verzeichnis wechseln und
  * `nvm use` ausführen
  * `yarn install`

### ausführen der tests

* `yarn test-ui` zur verwendung mit der UI
* `yarn test` zum direkten anzeigen in der console
* `yarn report` zum zeigen eines html reports - ich empfehle aber die --ui variante.
