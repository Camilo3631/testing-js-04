UI Test

Las pruebas UI normalemente aquí  son pruebas utulizandodipositivos fisicos y una interfaz grafica norlamente es por donde nuestros usuarios acceden, recuerda por ser
pruebas de UI no signfica de que son pruebas para fornt-end, front-end también se pueden hacer pruebas de Unit Test, de integración de End To End.

las UI signfiican emular dispositivos casi reales a los que el usuario tendría, o no casi literalemnte, pueden ser dispositivos reales allí también hacemos la prueba de conectarnos asía las bases de datos y probar todo el código en especifico.

Normalmente funcionan de este tipo nostros ya tenemos una interfaz, pueden ser nuestras aplicaciónes web una aplicación en dispositivo móvil y empezanos a interacturar con esa interfaz ahora lo que aga esa interfaz se conecta asia
una api y hacer pues todo lo que deba hacer ya lo controlamos por medio de 
esas pruebas.

Normlmente emepzamos a hacer clicks y taps y a llenar formularios y luego resolver
si luego de llenar cierta información es lo que se esperaba hacemos check.

Por ejemplo: si la momento hacer login sin con este tipo de usuario entonces ingresa a ya un tachurt o ingresa asi un panel administrativo, etc entonces ya estamos probando una interfaz real en el dispositivo como lo arian nuestros usuarios.

Veamos que herramientas vamos a usar para este tipo de pruebas:

1. Si la carpeta se encuentra vacia:

npm init-y 


Iniciamos el proyecto con node.js creamos nuestros archivos package.json

2. Copiamos nuestro archivo de .gitignore

3. Instalar dependencias después

Después de crear el package.json, puedes instalar dependencias de tu proyecto. Por ejemplo, para Playwright Test:

npm install -D @playwright/test@latest

3. Instalar navegadores (Chromium, Firefox, WebKit):

npx playwright install

4. Después de istalaa los navegadores ( para pruebas ) creamos un folder con  la siguiente terminacion tests

5. Dentro de ese folder creamos un archivo examples.spec.js con el siguiente contenido que es una prueba de UI:

const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
   await page.goto('https://playwright.dev/');
   // Url productiva
    // await page.goto('https://qa.playwright.dev/');
    // Para una serie de pruebas
   const title = page.locator('.navbar__inner .navbar__title');
   await expect(title).toHaveText('Playwright');
});

playwrigh respeta las nomenclaturas a la hora de hacer pruebas, puedes hacer un describe, un expect, lo que va a tener diferente son unos asertions (toHaveText) un poco especificos sobre todo para hacer pruebas de UI

Podemos tener diferentes tipo de pruebas cargar una página llenar formularios hacer click a botones, tener usuarios loguiados etc norlamente estas pruebas no se corren en producción, loaginado usuarios y creando libros, interactuando con nuestra interfaz y ver como funciona y como estamos corriendo  muchas pruebas  pues podriamos si lo corremos a producción estariamos llenando nuestra base de datos productiva pues de información real, de información que no va a tener sentido pues en nuestro aplicación porductiva.

Normalemnte lo que se hacen es crear subdominios en donde tenemos una versión de nuestra aplicación pero destinada a empezar hacer test y esta aplicación va y se conecta también a un API de test a una base de datos de test, etc.

Pero normalmente tenemos este tipo de URLS: 

https://qa.playwright.dev/' o https://v1.playwright.dev/' o https://stating.playwright.dev/'

Pero muy pocas veces a menos de que estemos haciendo otro tipo de pruebas le apuntamos a producción

6. Para correr la prueba ahi 2 comandos uno sin (Interefaz de usuario):

npx playwright test 

este normal 

npx playwright test --headed

Cuando ejecutas el siguiente comado npx playwright test  en la terminal esto sale si todo va 100% bien

camiloacosta@MacBook-Air-de-Camilo webapp % npx playwright test

Running 1 test using 1 worker

  ✓  1 tests/example.spec.js:3:1 › basic test (3.6s)

  1 passed (8.8s)
camiloacosta@MacBook-Air-de-Camilo webapp % 

El lee el expect es difertente al de jest porque usa spec.js 

7. Existen difrentes formas de configurarlo ahi un archivo llamado playwright.config.js


import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    /* Test against desktop browsers */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    /* Test against branded browsers. */
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }, // or 'chrome-beta'
    },
    {
      name: 'Microsoft Edge',
      use: { ...devic   es['Desktop Edge'], channel: 'msedge' }, // or 'msedge-dev'
    },
  ],
});

Donde podemos emepzar a crearquar, empezamos a usar otros navegaodres por ejemplo google chromiun, firefox, webkit por ejemplo para safari se puede hacer bastates cosas como ver si tiene un titulo, un atributo, si una parte de nuestra aplicación es visible etc.

playwright es muy potente para este tipo de pruebas.

Normalmente estas pruebas de UI necesitan un poco más de configuración es más si  algún momento al correr el comando  npx playwright test es que faltaron unos paquetes para poderlo correr.

Pero recuerda estamos viendo un poco estos fundamentos de como funcionan estos tipo de pruebas.

Seguramente abran cursos especificos en platzi de playwright donde si entremos más a fondo y las formas de configurar este tipo de pruebas es más no corren en el mismo repositorio porque son asgnosticas es decir realmente no importa si estan echas en react, angular, vue, lo que sea puede aver una especie de roles que ya serian un poco más de testers en donde escriban este tipo de scripts donde tengan una ambiente mejor configurado y estemos corriendo este tipo de pruebas qué son aparte de nuestros repositorios y posiblmente
emepiezan a levantar estos ambientes de creauar egnt y emepzamos a ejercitar ese tipo de pruebas.
