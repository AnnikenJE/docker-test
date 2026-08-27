# docker-test

> **Work in progress.** Nothing here is containerised yet, see the learning path below.

Learning Docker, step by step. The app is a copy of
[AnnikenJE/trump-verse](https://github.com/AnnikenJE/trump-verse), a React frontend and a
.NET 8 API over SQLite, used here only as something realistic to containerise.

## Learning path

| # | Module | Topic |
|---|---|---|
| 1 | Dockerfile for the API | `FROM`, `WORKDIR`, `COPY`, `RUN`, `ENTRYPOINT` |
| 2 | Build and run | `docker build`, `docker run -p`, `logs`, `exec` |
| 3 | Multi-stage build | SDK image builds, runtime image runs |
| 4 | Volumes | Keeping the database and uploaded images |
| 5 | Dockerfile for the frontend | Vite build served by nginx |
| 6 | Docker Compose | Two services on one network |
| 7 | Environment variables | The API URL out of the source code |

Currently on module 1 of 7.

## Three things that break in a container

Kept on purpose, each fixed in the module that explains it.

- `UseHttpsRedirection()`: no certificate inside the container
- `Database/TrumpVerse.db` and `wwwroot/images/`: wiped on every rebuild
- `serverURL = "http://localhost:5290"`: baked in at build time, and `localhost` means
  something else inside a container

## Running it

Needs Docker Desktop. Commands are added as each module lands.

Without Docker, with the .NET 8 SDK and Node.js 18+:

```bash
cd TrumpVerseAPI && dotnet run     # http://localhost:5290, Swagger at /swagger
cd trumpverse && npm install && npm run dev
```

**Disclaimer:** the original case was set by the school. This is a web development
exercise and expresses no political opinions or support.
