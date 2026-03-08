# Solarium

Projecte generat amb [Angular CLI](https://github.com/angular/angular-cli) versio 21.0.5 Angular 21 per gestionar plantes solars d'usuaris autenticats amb Supabase, incloent registre/inici de sessio, visualitzacio en taula i targetes, mapa interactiu per coordenades i edicio de perfil.

## Elements avaluables

### Formulari de login i registre amb signalForms i validacions

![Pantalla de login](/public/docs/formulari_login.png)

![Pantalla de login](/public/docs/formulari_registre.png)

### Formulari de plantes solars amb localització per mapa i validacions

![Pantalla de login](/public/docs/validacio_formulari_plantes.png)

![Pantalla de login](/public/docs/formulari_plantes.png)

### Llista de plantes i detall individual

![Pantalla de login](/public/docs/llista_plantes.png)

![Pantalla de login](/public/docs/detall_plantes.png)

### Formulari de perfil amb visualizació de imatge

![Pantalla de login](/public/docs/formulari_perfil.png)

### Mapa amb ubicació de les plantes carregades a Supabase

![Pantalla de login](/public/docs/localitzacio_plantes.png)

## Altres

### Model UML a Supabase

![Pantalla de login](/public/docs/uml.png)

## Servidor de desenvolupament

Per iniciar un servidor de desenvolupament local, executa:

```bash
ng serve
```

Quan el servidor estigui en marxa, obre el navegador i ves a `http://localhost:4200/`. L'aplicacio es recarregara automaticament cada vegada que modifiquis qualsevol fitxer font.

## Generacio de codi

Angular CLI inclou eines potents de generacio de codi. Per generar un component nou, executa:

```bash
ng generate component component-name
```

Per veure la llista completa d'esquemes disponibles (com ara `components`, `directives` o `pipes`), executa:

```bash
ng generate --help
```

## Compilacio

Per compilar el projecte, executa:

```bash
ng build
```

Aixo compilara el projecte i desara els artefactes de compilacio al directori `dist/`. Per defecte, la compilacio de produccio optimitza l'aplicacio per obtenir millor rendiment i velocitat.

## Execucio de proves unitaries

Per executar proves unitaries amb el motor de proves [Vitest](https://vitest.dev/), utilitza la comanda seguent:

```bash
ng test
```

## Execucio de proves end-to-end

Per executar proves end-to-end (e2e), executa:

```bash
ng e2e
```

Angular CLI no inclou per defecte cap framework de proves end-to-end. Pots triar el que millor s'adapti a les teves necessitats.

## Recursos addicionals

Per obtenir mes informacio sobre l'us d'Angular CLI, incloent referencies detallades de comandes, visita la pagina [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
