# OvaProjetct

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Runtime env variables (Supabase)

This app reads `SUPABASE_URL` and `SUPABASE_ANON_KEY` at runtime from `window.__env__`. To configure it locally copy `src/assets/env.example.js` to `src/assets/env.js` and replace the placeholders with your Supabase project's values.

Then include the script in `src/index.html` before the app's main script:

```html
<script src="assets/env.js"></script>
```

This makes `window.__env__` available to `src/environments/environment.ts` when the Angular app bootstraps.

### Iniciar sesión y crear cuenta Admin

- Para que el panel de administración `/admin` funcione, debes crear un usuario con `role = 'admin'` en la tabla `profiles`.
- Puedes crear un admin fácilmente con el script incluido. Exporta las variables y ejecútalo:

```bash
export SUPABASE_URL="https://<your-project>.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
export ADMIN_EMAIL="admin@example.com"
export ADMIN_PASSWORD="supersecret"
bun run scripts/create-admin.ts
```

- En la UI, puedes iniciar sesión con:
	- Link de correo (OTP): escribe tu email y presiona "Iniciar"; Supabase te enviará un link mágico por correo.
	- Contraseña: los admins creados con el script anterior tienen contraseña, así que puedes rellenar el campo "Contraseña" y pulsar "Iniciar".

- Para cerrar sesión, usa el botón "Cerrar" que aparece en la esquina superior derecha.

Cuando un usuario con `role = 'admin'` inicia sesión, debería poder navegar a `/admin` sin ser redirigido.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
