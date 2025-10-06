# vs-code

A set of TypeScript CLI tools to generate various aspects of `Nx` projects

## Tools

### [nx-launch-json](./nx-launch-json/cli.ts)

Automatically generates VS Code launch configurations for Nx monorepo projects.

#### Usage

```bash
# Auto-detect workspace from current directory
npx ts-node nx-launch-json/cli.ts

# Specify workspace path explicitly
npx ts-node nx-launch-json/cli.ts "/path/to/workspace"
npx ts-node nx-launch-json/cli.ts "C:\path\to\workspace"

# Show help
npx ts-node nx-launch-json/cli.ts --help
```

#### Features

- 🔍 **Auto-discovery**: Automatically scans your Nx workspace for services, web apps, and libraries
- 📝 **Template-based**: Uses predefined templates for different project types
- 🎯 **Compound configurations**: Creates fullstack and service combinations for easy debugging
- 🛡️ **Error handling**: Gracefully handles missing directories and other errors
- 📊 **Progress reporting**: Shows detailed progress during generation
- 🖥️ **CLI support**: Command-line interface with workspace path arguments

#### Examples

```bash
# From within an Nx workspace (auto-detection)
cd /path/to/nx-workspace
npx ts-node /path/to/vs-code/nx-launch-json/cli.ts

# With explicit workspace path
npx ts-node nx-launch-json/cli.ts "C:\data\seawingai\git\nx\21.6.3\nx-next-fastify\my-project"

# Using pnpm scripts
pnpm generate
pnpm generate "/path/to/workspace"
```