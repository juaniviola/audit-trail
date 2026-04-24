# Cómo contribuir a Audit Trail

¡Gracias por querer contribuir! Audit Trail es un monorepo para recibir, almacenar y consultar eventos de auditoría y logs de requests de servicios externos. El backend usa NestJS, TypeORM y PostgreSQL con una arquitectura DDD/hexagonal; el frontend usa Next.js y React para explorar la información registrada.

La contribución más valiosa no es tirar código a ciegas: es entender el problema, proponer una solución chica y verificable, y dejar el sistema mejor de lo que estaba.

## Formas de contribuir

- Reportar bugs con pasos reproducibles.
- Proponer mejoras de producto o arquitectura.
- Mejorar documentación, ejemplos y experiencia de instalación.
- Agregar tests o cubrir casos borde.
- Implementar features acordadas en un issue.

## Antes de abrir un pull request

1. Buscá si ya existe un issue o PR relacionado.
2. Si el cambio no es trivial, abrí un issue primero y explicá el problema.
3. Mantené el alcance chico. Un PR grande sin foco es difícil de revisar.
4. Seguí el estilo del proyecto: DDD en backend, módulos por dominio en frontend y nombres explícitos.
5. Agregá o actualizá tests cuando cambies comportamiento.
6. Actualizá documentación cuando cambies APIs, comandos, variables de entorno o flujos de uso.

## Setup local

Requisitos recomendados:

- Node.js 22+
- Yarn 1.x
- Docker y Docker Compose
- PostgreSQL 16 si no usás Docker

```bash
yarn install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker compose up -d postgres
yarn --cwd backend migration:run
```

Levantar servicios en desarrollo:

```bash
yarn backend:dev
yarn frontend:dev
```

URLs locales:

- Backend API: `http://localhost:5000/v1`
- Swagger: `http://localhost:5000/documentation`
- Frontend: `http://localhost:3000`

## Scripts útiles

```bash
yarn backend:test
yarn --cwd backend test --testPathPattern="audit-events"
yarn --cwd backend lint
yarn --cwd frontend type-check
yarn --cwd frontend lint
```

> Nota para contributors: no necesitás correr build para cambios de documentación. Para cambios de código, priorizá tests, type-check y lint según el área tocada.

## Convenciones de commits

Usamos Conventional Commits:

```text
feat: add audit event filters
fix: handle empty request log actor
chore: update contribution docs
docs: document docker deployment
```

Usá scopes cuando ayuden:

```text
feat(backend): add request log search criteria
fix(frontend): preserve audit filters in URL
```

## Pull requests

Un buen PR incluye:

- Qué problema resuelve.
- Qué enfoque elegiste y por qué.
- Cómo lo verificaste.
- Riesgos, tradeoffs o deuda técnica conocida.
- Capturas o ejemplos si cambia UI o API visible.

## Arquitectura del proyecto

- `backend/src/audit-events`: bounded context de eventos de auditoría.
- `backend/src/request-logs`: bounded context de logs HTTP recibidos desde servicios externos.
- `backend/src/shared`: infraestructura compartida, persistencia, configuración y building blocks.
- `frontend/src/modules`: módulos de dominio del frontend con repositories, hooks y UI relacionada.

La regla base: el dominio no debería depender de frameworks. Si una solución mete TypeORM, HTTP o detalles de UI dentro del modelo de dominio, pará y replantealo.

## Seguridad

No publiques credenciales, tokens, dumps de base de datos ni datos personales en issues o PRs. Si encontrás una vulnerabilidad, seguí `SECURITY.md`.

## Código de conducta

Todas las contribuciones están sujetas al `CODE_OF_CONDUCT.md`.
