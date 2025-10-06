
# Variables
$nxVersion = "21.6.3"
$projectName = "my-project"
$serviceName = "my-service"
$webAppName = "my-web"
$libName = "my-lib"
$uxLibName = "my-ux"

# WORKSPACE
npx create-nx-workspace@latest $projectName --name=$projectName --preset=apps --unitTestRunner=none --eslint=false --prettier=false --ci=skip --cache=true --packageManager=pnpm --defaultBase=main --useProjectJson=true --workspaces=true --workspaceType=integrated --tags=saas --no-interactive 

cd $projectName

pnpm add -w -w @nx/next@$nxVersion @nx/js@$nxVersion @nx/node@$nxVersion 

# SERVICE
npx nx g @nx/node:app --directory=apps/services/$serviceName --framework=fastify --unitTestRunner=none --docker=true --packageManager=pnpm --tags=service,fastify --no-interactive

# WEBSITE (NEXT)
npx nx g @nx/next:app --directory=apps/web/$webAppName --unitTestRunner=jest --e2eTestRunner=none --docker=true --packageManager=pnpm --tags=web,next --no-interactive

# JS LIBS
npx nx g @nx/js:lib --directory=libs/$libName --unitTestRunner=jest --packageManager=pnpm --tags=lib,js --no-interactive

# COMPONENT LIB (REACT - GENERAL PURPOSE)
npx nx g @nx/react:lib --directory=libs/$uxLibName --unitTestRunner=jest --packageManager=pnpm --tags=lib,react --no-interactive

# DEPENDENCIES
pnpm i

# BUILD
npx nx run-many --target=build --all --parallel

