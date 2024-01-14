import { join } from 'path';
import assert from 'assert';
import { existsSync } from 'fs';
import { sync } from 'cross-spawn';
import chalk from 'chalk'

interface CreateScriptsOptions {
  scriptsName?: string;
  dir?: string;
}

export function createScripts(opts: CreateScriptsOptions = {}) {
  const { dir = '.', scriptsName = 'walrus-cli' } = opts;
  const argv = process.argv.slice(2)
  const [name, ...throughArgs] = argv
  const scriptsPath = join(__dirname, `${dir}/${name}.ts`)

  assert(
    existsSync(scriptsPath) && !name.startsWith('.'),
    `Executed script '${chalk.red(name)}' does not exist`
  )

  console.log(chalk.cyan(`${scriptsName}: ${name}\n`))

  // current dir path may contain spaces
  const scriptPathAsStr = JSON.stringify(scriptsPath)
  const spawn = sync(
    'tsx',
    [scriptPathAsStr, ...throughArgs],
    {
      env: process.env,
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true
    }
  )
  if (spawn.status !== 0) {
    console.log(chalk.red(`walrus-cli: ${name} execute fail`))
    process.exit(1)
  }
}
