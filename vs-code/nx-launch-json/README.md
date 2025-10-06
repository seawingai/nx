# NxLaunchConfigGenerator

A TypeScript class that automatically generates VS Code launch configurations for Nx monorepo projects.

## Features

- 🔍 **Auto-discovery**: Automatically scans your Nx workspace for services, web apps, and libraries
- 📝 **Template-based**: Uses predefined templates for different project types
- 🎯 **Compound configurations**: Creates fullstack and service combinations for easy debugging
- 🛡️ **Error handling**: Gracefully handles missing directories and other errors
- 📊 **Progress reporting**: Shows detailed progress during generation

## Usage

### Command Line Interface

```bash
# Show help
npx ts-node cli.ts --help

# Auto-detect workspace from current directory
npx ts-node cli.ts

# Specify workspace path explicitly
npx ts-node cli.ts "/path/to/workspace"
npx ts-node cli.ts "C:\path\to\workspace"
```

#### Examples

```bash
# From within an Nx workspace (auto-detection)
cd /path/to/nx-workspace
npx ts-node /path/to/vs-code/nx-launch-json/cli.ts

# With explicit Windows path
npx ts-node cli.ts "C:\data\seawingai\git\nx\21.6.3\nx-next-fastify\my-project"

# With explicit Unix path
npx ts-node cli.ts "/home/user/projects/my-nx-workspace"
```

### Programmatic Usage

```typescript
import { NxLaunchConfigGenerator, generateNxLaunchJson } from './cli';

// Option 1: Using the class directly
const generator = new NxLaunchConfigGenerator('/path/to/workspace');
await generator.generateLaunchJson();

// Option 2: Using the convenience function
await generateNxLaunchJson('/path/to/workspace');

// Option 3: Auto-detect workspace (from current working directory)
await generateNxLaunchJson();
```

## Directory Structure

The class scans these directories in your Nx workspace:

- `./apps/services/*` - Backend services
- `./apps/web/*` - Frontend web applications  
- `./libs/*` - Shared libraries

## Generated Configurations

### Services
- Node.js launch configuration using `nx serve`
- Integrated terminal for output
- Smart stepping enabled

### Web Applications
- **Server**: Node.js configuration using `pnpm exec nx run app:dev`
- **Client**: Chrome debugger configuration for frontend
- Source maps and debugging support
- Auto-attach to child processes

### Libraries
- Node.js test configuration using `nx test`
- Custom test pattern and timeout settings
- Cache skipping for debugging

### Compound Configurations

- **Fullstack**: Server + Client for each web app
- **Service combinations**: Web app + specific service for full-stack debugging

## Output

Creates `.vscode/launch.json` with:
- Individual debug configurations for each project
- Compound configurations for multi-project debugging
- Proper source mapping and debugging settings

## Requirements

- Node.js with TypeScript support
- Nx workspace with standard directory structure
- VS Code with debugging support

## Error Handling

- ✅ Validates workspace path exists
- ✅ Validates nx.json presence
- ✅ Reports progress and errors to console
- ✅ Creates `.vscode` directory if it doesn't exist
- ✅ Gracefully handles missing project directories
- ✅ Provides helpful error messages with suggestions

## CLI Arguments

| Argument         | Description                                      | Required |
| ---------------- | ------------------------------------------------ | -------- |
| `workspace-path` | Path to Nx workspace root (must contain nx.json) | No       |
| `--help`, `-h`   | Show help information                            | No       |

## Exit Codes

- `0` - Success
- `1` - Error (invalid path, missing nx.json, etc.)