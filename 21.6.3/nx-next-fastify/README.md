# nx-next-fastify

[my-project](./my-project) folder contains a sample `Nx` project which you can easily debug in `vs code`. You can debug code in `my-service`, `my-web`, `my-lib` and `my-ux` using `vs code`.

# Scaffold

Run [nx-next-fastify.ps1](nx-next-fastify.ps1) to create a `Nx` project with following:

- `fastify` service = `my-service` (PORT=3000)
- `next` website = `my-web` (PORT=3000)
- `ts library` = `my-lib`
- `react library` = `my-ux`

### Note 

Update variables in [nx-next-fastify.ps1](nx-next-fastify.ps1) and you can create your project with specific names.

## Debug

- Create or copy [launch.json](./my-project/.vscode/launch.json) to debug code in `my-service`, `my-web`, `my-lib` and `my-ux` using `vs code`

# Build

- Build  `my-service` = `npx nx run my-service:build`
- Build  `my-web` = `npx nx run my-web:build`
- Build  `my-ux` = `npx nx run my-ux:build`

## Run

- Run  `my-service` = `npx nx run my-service:serve`
- Run  `my-web` = `npx nx run my-web:dev`

