# Dockerfile for TrumpVerseAPI (.NET 8)
# Modul 3: multi-stage build. Steg 1 bygger med SDK-imaget, steg 2 kjorer
# resultatet i et lite runtime-image. Bare det siste steget blir til imaget;
# alt i byggesteget kastes.

# ---------- Steg 1: build ----------
# "AS build" gir steget et navn vi kan kopiere fra lenger nede.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Kopier prosjektfila alene forst og hent pakkene. Dette laget bygges pa nytt
# bare nar TrumpVerseAPI.csproj endrer seg, ikke hver gang en .cs-fil endrer seg.
COPY TrumpVerseAPI.csproj .
RUN dotnet restore

# Sa resten av kildekoden, som endrer seg ofte.
COPY . .
RUN dotnet publish -c Release -o /app/out --no-restore

# ---------- Steg 2: runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT [ "dotnet", "TrumpVerseAPI.dll" ]