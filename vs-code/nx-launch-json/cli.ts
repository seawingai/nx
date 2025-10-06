import { existsSync, mkdirSync, readdirSync, writeFileSync, Dirent } from 'fs';
import { join, dirname } from 'path';

interface LaunchConfiguration {
  type: string;
  request: string;
  name: string;
  program?: string;
  args?: string[];
  cwd?: string;
  skipFiles?: string[];
  console?: string;
  internalConsoleOptions?: string;
  smartStep?: boolean;
  runtimeExecutable?: string;
  runtimeArgs?: string[];
  sourceMaps?: boolean;
  outFiles?: string[];
  autoAttachChildProcesses?: boolean;
  url?: string;
  webRoot?: string;
  sourceMapPathOverrides?: Record<string, string>;
}

interface CompoundConfiguration {
  name: string;
  configurations: string[];
  stopAll: boolean;
}

interface LaunchJson {
  version: string;
  configurations: LaunchConfiguration[];
  compounds: CompoundConfiguration[];
}

export class NxLaunchConfigGenerator {
  private workspaceFolder: string;
  private vscodeFolder: string;
  private launchJsonPath: string;

  constructor(workspaceFolder?: string) {
    this.workspaceFolder = workspaceFolder || this.findWorkspaceRoot();
    this.vscodeFolder = join(this.workspaceFolder, '.vscode');
    this.launchJsonPath = join(this.vscodeFolder, 'launch.json');
  }

  private findWorkspaceRoot(): string {
    let currentDir = process.cwd();
    
    while (currentDir !== dirname(currentDir)) {
      const nxJsonPath = join(currentDir, 'nx.json');
      if (existsSync(nxJsonPath)) {
        return currentDir;
      }
      currentDir = dirname(currentDir);
    }
    
    throw new Error(
      'Could not find workspace root (nx.json not found in any parent directory).\n' +
      'Please run this from within an Nx workspace or specify the workspace folder:\n' +
      '  new NxLaunchConfigGenerator("/path/to/workspace")'
    );
  }

  private ensureVscodeFolder(): void {
    if (!existsSync(this.vscodeFolder)) {
      console.log(`Creating .vscode folder at: ${this.vscodeFolder}`);
      mkdirSync(this.vscodeFolder, { recursive: true });
    }
  }

  private getDirectoryNames(dirPath: string): string[] {
    try {
      if (!existsSync(dirPath)) {
        console.log(`Directory does not exist: ${dirPath}`);
        return [];
      }

      return readdirSync(dirPath, { withFileTypes: true })
        .filter((dirent: Dirent) => dirent.isDirectory())
        .map((dirent: Dirent) => dirent.name);
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
      return [];
    }
  }

  private createServiceConfiguration(serviceName: string): LaunchConfiguration {
    return {
      type: "node",
      request: "launch",
      name: serviceName,
      program: "${workspaceFolder}/node_modules/nx/bin/nx.js",
      args: ["serve", serviceName],
      cwd: "${workspaceFolder}",
      skipFiles: [
        "<node_internals>/**",
        "**/node_modules/**"
      ],
      console: "integratedTerminal",
      internalConsoleOptions: "neverOpen",
      smartStep: true
    };
  }

  private createWebServerConfiguration(webName: string): LaunchConfiguration {
    return {
      type: "node",
      request: "launch",
      name: `${webName} (server)`,
      runtimeExecutable: "pnpm",
      runtimeArgs: ["exec", "nx", "run", `${webName}:dev`],
      console: "integratedTerminal",
      internalConsoleOptions: "neverOpen",
      skipFiles: [
        "<node_internals>/**",
        "**/node_modules/**"
      ],
      sourceMaps: true,
      outFiles: [
        `\${workspaceFolder}/dist/apps/web/${webName}/**/*.(m|c|)js`,
        "!**/node_modules/**"
      ],
      autoAttachChildProcesses: true,
      smartStep: true
    };
  }

  private createWebClientConfiguration(webName: string): LaunchConfiguration {
    return {
      type: "chrome",
      request: "launch",
      name: `${webName} (client)`,
      url: "http://localhost:3000",
      webRoot: `\${workspaceFolder}/apps/web/${webName}`,
      smartStep: true,
      sourceMaps: true,
      sourceMapPathOverrides: {
        [`webpack://${webName}/*`]: "${webRoot}/src/*",
        [`webpack://${webName}/./src/*`]: "${webRoot}/src/*",
        "webpack:///./*": "${webRoot}/*",
        "webpack:///src/*": "${webRoot}/src/*",
        "webpack:///*": "*"
      }
    };
  }

  private createLibConfiguration(libName: string): LaunchConfiguration {
    return {
      type: "node",
      request: "launch",
      name: libName,
      program: "${workspaceFolder}/node_modules/nx/bin/nx.js",
      args: [
        "test",
        libName,
        "--testPathPattern=example.spec.ts",
        "--testTimeout=9999999",
        "--skip-nx-cache"
      ],
      cwd: "${workspaceFolder}",
      skipFiles: [
        "<node_internals>/**",
        "**/node_modules/**"
      ],
      console: "integratedTerminal",
      internalConsoleOptions: "neverOpen",
      smartStep: true
    };
  }

  private createWebFullstackCompound(webName: string): CompoundConfiguration {
    return {
      name: `${webName} (fullstack)`,
      configurations: [
        `${webName} (server)`,
        `${webName} (client)`
      ],
      stopAll: true
    };
  }

  private createWebServiceCompound(webName: string, serviceName: string): CompoundConfiguration {
    return {
      name: `${webName} (${serviceName})`,
      configurations: [
        `${webName} (server)`,
        `${webName} (client)`,
        serviceName
      ],
      stopAll: true
    };
  }

  public async generateLaunchJson(): Promise<void> {
    try {
      console.log('Starting launch.json generation...');
      console.log(`Workspace folder: ${this.workspaceFolder}`);

      this.ensureVscodeFolder();

      const configurations: LaunchConfiguration[] = [];
      const compounds: CompoundConfiguration[] = [];

      console.log('\n🔍 Scanning for services...');
      const servicesPath = join(this.workspaceFolder, 'apps', 'services');
      const services = this.getDirectoryNames(servicesPath);
      console.log(`Found ${services.length} services: ${services.join(', ')}`);

      services.forEach(service => {
        console.log(`  ✅ Adding service configuration: ${service}`);
        configurations.push(this.createServiceConfiguration(service));
      });

      console.log('\n🔍 Scanning for web apps...');
      const webPath = join(this.workspaceFolder, 'apps', 'web');
      const webApps = this.getDirectoryNames(webPath);
      console.log(`Found ${webApps.length} web apps: ${webApps.join(', ')}`);

      webApps.forEach(webApp => {
        console.log(`  ✅ Adding web configurations: ${webApp}`);
        configurations.push(this.createWebServerConfiguration(webApp));
        configurations.push(this.createWebClientConfiguration(webApp));
        
        console.log(`  ✅ Adding fullstack compound: ${webApp}`);
        compounds.push(this.createWebFullstackCompound(webApp));
      });

      console.log('\n🔍 Scanning for libraries...');
      const libsPath = join(this.workspaceFolder, 'libs');
      const libs = this.getDirectoryNames(libsPath);
      console.log(`Found ${libs.length} libraries: ${libs.join(', ')}`);

      libs.forEach(lib => {
        console.log(`  ✅ Adding library configuration: ${lib}`);
        configurations.push(this.createLibConfiguration(lib));
      });

      console.log('\n🔍 Creating web + service compounds...');
      webApps.forEach(webApp => {
        services.forEach(service => {
          console.log(`  ✅ Adding web-service compound: ${webApp} + ${service}`);
          compounds.push(this.createWebServiceCompound(webApp, service));
        });
      });

      const launchJson: LaunchJson = {
        version: "0.2.0",
        configurations,
        compounds
      };

      console.log('\n💾 Writing launch.json...');
      writeFileSync(this.launchJsonPath, JSON.stringify(launchJson, null, 2));
      
      console.log(`✨ Successfully generated launch.json with:`);
      console.log(`   - ${configurations.length} configurations`);
      console.log(`   - ${compounds.length} compounds`);
      console.log(`   - File location: ${this.launchJsonPath}`);

    } catch (error) {
      console.error('❌ Error generating launch.json:', error);
      throw error;
    }
  }
}

export async function generateNxLaunchJson(workspaceFolder?: string): Promise<void> {
  const generator = new NxLaunchConfigGenerator(workspaceFolder);
  await generator.generateLaunchJson();
}

function printUsage(): void {
  console.log(`
🚀 Nx Launch Config Generator CLI

Usage:
  npx ts-node cli.ts [workspace-path]

Arguments:
  workspace-path    Optional path to Nx workspace root (must contain nx.json)
                   If not provided, will auto-detect from current directory

Examples:
  npx ts-node cli.ts
  npx ts-node cli.ts /path/to/workspace
  npx ts-node cli.ts "C:\\path\\to\\workspace"

Programmatic Usage:
  import { NxLaunchConfigGenerator, generateNxLaunchJson } from './cli';
  
  const generator = new NxLaunchConfigGenerator('/path/to/workspace');
  await generator.generateLaunchJson();
  
  // Or use convenience function
  await generateNxLaunchJson('/path/to/workspace');
`);
}

function parseCliArgs(): { workspacePath?: string; showHelp: boolean } {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    return { showHelp: true };
  }
  
  const workspacePath = args[0];
  return { workspacePath, showHelp: false };
}

async function runCli(): Promise<void> {
  try {
    const { workspacePath, showHelp } = parseCliArgs();
    
    if (showHelp) {
      printUsage();
      return;
    }
    
    console.log('🎯 Nx Launch Config Generator');
    
    if (workspacePath) {
      console.log(`📂 Using workspace: ${workspacePath}`);
      
      // Validate workspace path
      if (!existsSync(workspacePath)) {
        console.error(`❌ Error: Workspace path does not exist: ${workspacePath}`);
        process.exit(1);
      }
      
      const nxJsonPath = join(workspacePath, 'nx.json');
      if (!existsSync(nxJsonPath)) {
        console.error(`❌ Error: Not a valid Nx workspace. Missing nx.json in: ${workspacePath}`);
        console.log('💡 Make sure the path points to the root of an Nx workspace.');
        process.exit(1);
      }
    } else {
      console.log('🔍 Auto-detecting workspace from current directory...');
    }
    
    await generateNxLaunchJson(workspacePath);
    
  } catch (error) {
    console.error('❌ CLI Error:', error instanceof Error ? error.message : error);
    console.log('\n💡 Use --help for usage information');
    process.exit(1);
  }
}

// Execute if this file is run directly
if (require.main === module) {
  runCli().catch(console.error);
}
