# docker-test

> **Work in progress.** The API builds, runs and keeps its data. The frontend is still
> outside Docker, and the API URL it calls is still hardcoded, until modules 5 to 7.

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

Modules 1 to 4 done. Currently on module 5 of 7.

## Three things that break in a container

Kept on purpose, each fixed in the module that explains it.

- `UseHttpsRedirection()`: no certificate inside the container
- ~~`Database/TrumpVerse.db` and `wwwroot/images/`: excluded by `.dockerignore` in module 2~~
  — fixed in module 4, both are bind mounts now
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
docker exec -it trumpverse-api sh    # a shell inside, look at /app
docker images                        # 1.96 GB before module 3, 380 MB after
docker stop trumpverse-api
```

### Module 3: multi-stage build

The Dockerfile now has two stages. The first one compiles with the SDK image, the second
one copies only the published output into a runtime image. Nothing else crosses over.

```bash
cd TrumpVerseAPI
docker build -t trumpverse-api:multistage .
docker images trumpverse-api           # 1.96 GB single-stage, 380 MB multi-stage
docker run --rm --name trumpverse-api -p 8080:8080 trumpverse-api:multistage
```

Proof the SDK stayed behind, from another terminal:

```bash
docker exec trumpverse-api dotnet --list-sdks       # empty
docker exec trumpverse-api dotnet --list-runtimes   # Microsoft.AspNetCore.App 8.0.31
docker exec trumpverse-api sh -c 'ls /app'          # 36 files, no source, no obj/
```

`aspnet:8.0` is the right runtime image, not `runtime:8.0` — the latter has no ASP.NET
Core libraries and the API fails on startup.

Layer caching is the second half of the module. `TrumpVerseAPI.csproj` is copied on its
own before the rest of the source, so `dotnet restore` only reruns when the project file
changes:

```bash
# change any .cs file, then
docker build -t trumpverse-api:multistage .   # RUN dotnet restore -> CACHED
```

Debugging a multi-stage build, stopping at a named stage:

```bash
docker build --target build -t api-build .
docker run --rm api-build ls /app/out
```

### Module 4: volumes

The image is the program. A volume is the data. They meet when the container starts, and
not before — nothing is ever added to the image itself:

```bash
docker run --rm --entrypoint sh trumpverse-api:multistage -c 'ls /app/Database'
# ls: cannot access '/app/Database': No such file or directory

# same image, one flag added
docker run --rm --entrypoint sh -v ${PWD}/Database:/app/Database   trumpverse-api:multistage -c 'ls /app/Database'
# TrumpVerse.db
```

That is why the same 380 MB image can run against a test database here and a real one on a
server: the mount is chosen at run time, not at build time.

The image still has no `Database/` and no `wwwroot/images/` — `.dockerignore` kept them out
in module 2. That is only half the reason `/api/TrumpMerch` returns 500. The other half is
that a container's writable layer is deleted with the container, so even a database copied
into the image would reset on every `docker run --rm`. Data that has to outlive a container
must live outside the image.

Two ways to mount:

| | Bind mount | Named volume |
|---|---|---|
| Syntax | `-v <host path>:<container path>` | `-v <name>:<container path>` |
| Storage | a directory you pick on the host | managed by Docker, `docker volume ls` |
| Visible on the host | yes, edit it in the editor | only through a container |
| First start | host content wins, empty host dir stays empty | empty volume is seeded from the image path |

Rule of thumb: bind mount for data that already exists and that you want to look at,
named volume for data only the container owns.

Both paths here are bind mount cases. `Database/TrumpVerse.db` is a seeded database that
lives in the repository, and `wwwroot/images/` holds the product images the frontend
requests by name — nothing to seed a named volume from, since neither path exists in the
image at all.

Mount the *directory*, not `TrumpVerse.db` alone: SQLite writes `TrumpVerse.db-journal`
next to the database, and a single-file mount leaves that sibling in the container layer.

```bash
cd TrumpVerseAPI
docker run --rm --name trumpverse-api -p 8080:8080 \
  -v ${PWD}/wwwroot/images:/app/wwwroot/images \
  -v ${PWD}/Database:/app/Database \
  trumpverse-api:multistage
```

Proof that the mounts took, from another terminal:

```bash
docker exec trumpverse-api sh -c 'ls /app/Database /app/wwwroot/images'
docker inspect -f '{{json .Mounts}}' trumpverse-api
curl http://localhost:8080/api/TrumpMerch          # 200 and JSON, not 500 any more
```

Proof that writes survive the container:

```bash
curl -X POST http://localhost:8080/api/TrumpMerch \
  -H 'Content-Type: application/json' \
  -d '{"name":"Volume Test Cap","price":99,"image":"MagaCap.jpg"}'
docker stop trumpverse-api                          # --rm deletes the container

docker run --rm --name trumpverse-api -p 8080:8080   -v ${PWD}/wwwroot/images:/app/wwwroot/images   -v ${PWD}/Database:/app/Database   trumpverse-api:multistage

Gicurl http://localhost:8080/api/TrumpMerch           # "Volume Test Cap" is still there
```

`git status` shows `TrumpVerseAPI/Database/TrumpVerse.db` as modified afterwards — the
container wrote straight into the working tree. That is the bind mount doing its job, and
the reason a named volume is the safer default once the data is not yours to inspect.

Named volumes, for comparison:

```bash
docker volume create trumpverse-db
docker volume ls
docker volume inspect trumpverse-db      # Mountpoint, inside the Docker VM on Windows
docker volume rm trumpverse-db
```

Without Docker, with the .NET 8 SDK and Node.js 18+:

```bash
cd TrumpVerseAPI && dotnet run     # http://localhost:5290, Swagger at /swagger
cd trumpverse && npm install && npm run dev
```

**Disclaimer:** the original case was set by the school. This is a web development
exercise and expresses no political opinions or support.
