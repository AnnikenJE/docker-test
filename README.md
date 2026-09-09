# docker-test

> **Work in progress.** The API builds and runs in a container. The database and the
> uploaded images are deliberately left out of the image until module 4, so
> `/api/TrumpMerch` returns 500 for now.

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

Modules 1 and 2 done. Currently on module 3 of 7.

## Three things that break in a container

Kept on purpose, each fixed in the module that explains it.

- `UseHttpsRedirection()`: no certificate inside the container
- `Database/TrumpVerse.db` and `wwwroot/images/`: excluded by `.dockerignore` in module 2,
  mounted as volumes in module 4
- `serverURL = "http://localhost:5290"`: baked in at build time, and `localhost` means
  something else inside a container

## Running it

Needs Docker Desktop. Commands are added as each module lands.

### Module 2: build and run the API

```bash
cd TrumpVerseAPI
docker build -t trumpverse-api .
docker run --rm --name trumpverse-api -p 8080:8080 trumpverse-api
```

The API listens on <http://localhost:8080>. Two things differ from `dotnet run`:

- No Swagger. `launchSettings.json` is not part of `dotnet publish`, so
  `ASPNETCORE_ENVIRONMENT` is unset and the app starts in `Production`.
- `/api/TrumpMerch` returns 500 until module 4. The image has no `Database/` directory,
  so SQLite cannot open `Data Source=Database/TrumpVerse.db`. The container still starts
  and looks healthy in `docker ps`; the failure only shows up on a request.

Inspecting a running container:

```bash
docker ps                            # running containers
docker logs trumpverse-api           # stdout from the app
docker exec -it trumpverse-api sh    # a shell inside, look at /app and /app/out
docker images                        # ~2 GB on disk, the whole SDK ships in the image
docker stop trumpverse-api
```

Without Docker, with the .NET 8 SDK and Node.js 18+:

```bash
cd TrumpVerseAPI && dotnet run     # http://localhost:5290, Swagger at /swagger
cd trumpverse && npm install && npm run dev
```

**Disclaimer:** the original case was set by the school. This is a web development
exercise and expresses no political opinions or support.
