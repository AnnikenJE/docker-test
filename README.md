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

## Command reference

The modules below are a log of how this was learned, in order. This section is the
manual: enough to get from a clean machine to a running container without rereading them.

### The shape of a docker command

```
docker run  [flags]  IMAGE  [command]
```

The image name is always the last argument before an optional command. Everything before
it is flags; anything after it replaces the image's `ENTRYPOINT`. A flag that goes missing
turns its value into the image name, which is what `invalid reference format` means.

### Flags used in this repo

| Flag | Long form | What it does |
|---|---|---|
| `-t` | `--tag` | Names the image being built: `-t name:tag`. Without a tag, `:latest` is implied |
| `-p` | `--publish` | Maps `<host port>:<container port>`. Without it the container's ports are unreachable from the host |
| `-v` | `--volume` | Mounts `<host path>:<container path>[:ro]`. One flag per mount |
| `-d` | `--detach` | Runs in the background instead of holding the terminal. Without it, `Ctrl+C` stops the container |
| `-e` | `--env` | Sets an environment variable inside the container: `-e ASPNETCORE_ENVIRONMENT=Development` |
| `-it` | `--interactive --tty` | Keeps a terminal attached. Needed for `docker exec -it ... sh`, pointless otherwise |
| | `--rm` | Deletes the container when it stops. Without it, stopped containers pile up in `docker ps -a` |
| | `--name` | Gives the container a fixed name, so later commands can say `trumpverse-api` instead of a hash |
| | `--target` | Stops a multi-stage build at a named stage: `--target build` |
| | `--entrypoint` | Replaces the image's `ENTRYPOINT` for one run: `--entrypoint ls` |

### Paths in `-v`

Three rules, and every mount mistake in this repo broke one of them:

1. **The host side must be absolute.** `./Database` is rejected — the Docker daemon does
   not know your working directory. `${PWD}` expands to it, and works in both PowerShell
   and bash.
2. **The container side is always a Linux path,** whatever the host is. Mixing is normal:
   `-v D:\dev\...\Database:/app/Database`.
3. **A bind mount replaces the mount point, it does not merge.** Mounting `/app/wwwroot`
   hides everything the build put there. Mount the narrowest path that solves the problem.

`${PWD}` is a shell variable, not Docker syntax — the shell substitutes it before Docker
ever sees the command.

### Shell differences

The blocks below are tagged `bash`, but almost every command is identical in PowerShell.
Two things are not:

- **Line continuation.** `\` at end of line is bash. PowerShell uses a backtick `` ` ``.
  Copying a multi-line block into PowerShell fails — join it into one line instead.
- **`${PWD}`.** Works in both, which is why it is used everywhere below. Plain `$PWD`
  works too, but the braces keep it from running into the next character.

### Everyday commands

```bash
docker build -t name:tag .          # build from ./Dockerfile, "." is the build context
docker run ...                      # create and start a container from an image
docker ps                           # running containers
docker ps -a                        # including stopped ones
docker logs <name>                  # stdout from the app; add -f to follow
docker exec -it <name> sh           # a shell inside a running container
docker exec <name> <cmd>            # one command inside, no shell
docker stop <name>                  # SIGTERM, then SIGKILL after 10s
docker images                       # local images and their sizes
docker rm <name>                    # delete a stopped container
docker rmi <image>                  # delete an image
docker volume ls                    # named volumes
docker inspect <name>               # full JSON: mounts, ports, env, entrypoint
docker system df                    # disk used by images, containers, volumes
docker system prune                 # delete everything unused. Asks first
```

### From nothing to running

Docker Desktop must be installed and running — `docker ps` fails with a daemon error if it
is not.

```bash
git clone <this repo>
cd docker-test/TrumpVerseAPI
docker build -t trumpverse-api:multistage .
```

Then the run command from module 4 below, which is the current complete one. Check it
worked:

```bash
docker ps                                    # STATUS says Up
curl http://localhost:8080/api/TrumpMerch    # 200 and JSON
```

### When something is wrong

| Symptom | Cause | Fix |
|---|---|---|
| `Cannot connect to the Docker daemon` | Docker Desktop is not running. The `docker` command is only a client; the daemon does the work | Start Docker Desktop, wait for the whale icon to stop animating |
| `docker: invalid reference format` | A flag went missing, so its value ended up where the image name belongs. Docker reads the last non-flag argument as the image | Check that every mount has its own `-v` in front of it, and that the image name is last |
| `port is already allocated` | An earlier container still holds host port 8080. `--rm` only cleans up on stop, not on a crashed terminal | `docker ps` to find it, `docker stop <name>`, then run again |
| `docker ps` says Up, but `/api/TrumpMerch` returns 500 | The app started fine; SQLite only opens the file on the first request. No `Database/` mount means no database | Add the `-v` for `Database`, and check `docker logs <name>` for the real exception |
| Images 404 after mounting | The two sides of `:` point at different directories. A mount never corrects a path, it just overlays one | Both sides must end in `wwwroot/images` |
| Files in the image disappeared after mounting | A bind mount replaces the mount point rather than merging into it | Mount the narrowest path that solves the problem, not its parent |
| The terminal hangs after `docker run` | Not an error. Without `-d` the container runs in the foreground and owns the terminal | `Ctrl+C` to stop it, or add `-d` and use `docker logs -f <name>` |
| A `.cs` change does not show up | The image was not rebuilt. `docker run` always uses the image as it was built | `docker build` again before `docker run` |

## Running it

Needs Docker Desktop. Each module below adds its commands, in the order they were
learned — so module 2 still describes the 500 that module 4 fixed. For the current working
setup, read the command reference above instead.

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
