# Widget de Chat en Vivo.

Este proyecto es un widget de chat en vivo implementado como un componente web personalizado utilizando React y TypeScript

## Características

- Componente web personalizado para fácil integración en cualquier sitio web
- Interfaz de usuario de chat con burbuja flotante y ventana de chat expandible
- Posicionamiento configurable (izquierda o derecha)
- Estilizado con Tailwind CSS para un diseño responsive y moderno

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- @r2wc/react-to-web-component (para convertir componentes React en Web Components)
- Lucide React (para iconos)

## Configuración y uso

1. Instala las dependencias:

```bash
npm install
```

2. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

3. Para construir el proyecto:

```bash
npm run build
```

4. Para probar el widget en un archivo HTML:

```bash
npm run preview
```

5. El proyecto utiliza ESLint para el linting y está configurado con reglas para React y TypeScript. Asegúrate de ejecutar el linter antes de hacer commit:

```bash
npm run lint
```

## Tests

En el directorio del proyecto puedes ejecutar los siguientes comandos:

Ejecuta las pruebas end-to-end.

```sh
npx playwright test
```

Inicia el modo interactivo de UI.

```sh
npx playwright test --ui
```

Ejecuta las pruebas solo en Chrome de escritorio.

```sh
npx playwright test --project=chromium
```

Ejecuta las pruebas en un archivo específico.

```sh
npx playwright test livechat
```

Ejecuta las pruebas en modo debug.

```sh
npx playwright test --debug
```

Genera pruebas automáticamente con Codegen.

```sh
npx playwright codegen
```


## Integración del widget

Copia y pega el siguiente script antes de cerrar la etiqueta </body> en la página donde deseas mostrar el LiveChat:

```html
<script id="live-chat-travelbot" src="https://widget.TravelBot/assets/js/widget.js" type="module"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    LiveChat.init({
      applicationUrl: "https://midominio.com/api/chat/general-setting/public/{key}/",
      position: "right",
    });
  });
</script>
```
- Substituye el valor de midominio.com con el dominio de tu aplicación de TravelBot.
- Substituye el valor de {key} con la clave de tu aplicación de TravelBot.

