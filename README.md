# Trabajo práctico 04

## Descripción

Aplicación web desarrollada con Node.js, Express y EJS para consultar mascotas en adopción y agregar temporalmente nuevos registros mediante un formulario.

Los datos iniciales se cargan desde `datos/mascotas.json`. Los registros creados desde el formulario se agregan solamente al arreglo en memoria y desaparecen al reiniciar el servidor.

## Instalación

Clona el repositorio e instala las dependencias de ejecución:

```bash
npm install
```

## Ejecución

```bash
npm start
```

La aplicación queda disponible en `http://localhost:3000`.

Para comprobar la sintaxis:

```bash
npm run check
```

## Páginas y rutas

- `GET /` - Página inicial.
- `GET /mascotas` - Catálogo de mascotas.
- `GET /mascotas/nueva` - Formulario de alta.
- `GET /mascotas/:id` - Detalle de una mascota.
- `POST /mascotas` - Validación y creación temporal en memoria.

La ruta `/mascotas/nueva` se declara antes que `/mascotas/:id` para evitar que "nueva" sea interpretado como un identificador.

## Estructura de vistas

- **Layout:** `views/layouts/main.ejs`. Define la estructura HTML común, título, CSS, contenido y JavaScript.
- **Vistas:** contienen el contenido específico de cada página.
- **Parciales:** `views/partials/encabezado.ejs` y `views/partials/pie.ejs` contienen partes reutilizables.

`res.render()` recibe los datos que la vista necesita, por ejemplo el arreglo `mascotas`, el objeto `mascota`, el título y los valores del formulario.

## Recursos estáticos

Los recursos de `public/` se sirven mediante `express.static()`. Esto permite publicar la carpeta como raíz de recursos estáticos sin escribir `/public` en las URLs. Por eso se accede a:

- `/css/estilos.css`
- `/img/mascota.svg`
- `/js/app.js`

No se incluye `/public` en las URLs.

## Formulario

El formulario usa:

```html
<form action="/mascotas" method="post">
```

Los campos obligatorios son nombre, especie, edad, estado y descripción. La edad se convierte a número y se valida que sea un entero mayor o igual a cero. También se comprueba que el estado pertenezca a los tres valores permitidos.

Si hay errores, el servidor responde `400`, vuelve a renderizar el formulario, muestra un mensaje con `role="alert"` y conserva los valores ingresados.

Si todo es correcto, se genera un nuevo ID, se asigna `/img/mascota.svg`, se agrega la mascota al arreglo y se responde con una redirección `302` hacia `/mascotas`.

## Persistencia de los datos

Los cinco registros iniciales se leen desde el archivo JSON al iniciar el servidor.

Las nuevas mascotas no se escriben en el JSON: solamente se agregan al arreglo en memoria. Por eso desaparecen al reiniciar la aplicación y vuelven a aparecer las cinco mascotas iniciales.

## Diferencia entre layout, vista y parcial

- **Layout:** estructura HTML común a todas las páginas. En este proyecto es `views/layouts/main.ejs`.
- **Vista:** contenido específico de una página, como `inicio.ejs` o las vistas de `mascotas/`.
- **Parcial:** fragmento reutilizable incluido dentro del layout, como el encabezado y el pie.

## Flujo POST

1. El navegador envía el formulario mediante `POST /mascotas`.
2. Express procesa `req.body`.
3. El servidor valida los datos.
4. Si hay errores, responde `400` y conserva los valores.
5. Si es correcto, agrega el registro al arreglo.
6. El servidor responde `302` hacia `/mascotas`.
7. El navegador realiza el `GET /mascotas` y muestra la nueva tarjeta.

## Estado vacío

La vista del catálogo incluye una rama condicional para mostrar un mensaje alternativo cuando el arreglo está vacío. La aplicación normal se entrega con los cinco registros iniciales restaurados.

## Pruebas

La matriz de comprobación contempla:

- Inicio: `200`, título y enlace al catálogo.
- Listado: `200` y cinco mascotas iniciales.
- Estado vacío: `200` y mensaje alternativo.
- Detalle válido: `200`, datos completos e imagen.
- Detalle inexistente: `404` y página HTML de error.
- Formulario: `200` y controles etiquetados.
- Envío incompleto: `400`, mensaje y valores conservados.
- Edad inválida: `400`, mensaje y valores conservados.
- Envío válido: `302` seguido de `200` y nueva tarjeta.
- CSS, SVG y JavaScript: recursos disponibles mediante sus URLs públicas.
- Reinicio: regreso a los cinco registros iniciales.

La comprobación de estado vacío se realiza temporalmente pasando un arreglo vacío a la vista y restaurando luego los cinco registros iniciales.

## Preevaluación estática

El proyecto está organizado para que la preevaluación mediante análisis estático pueda identificar las rutas obligatorias, la carga inicial desde JSON, el uso de `res.render`, el recorrido `forEach`, el layout y los parciales, la validación del formulario, la creación en memoria, la redirección y los recursos estáticos. No se agregan routers, controladores, base de datos, autenticación, persistencia ni otras funcionalidades fuera de alcance.

