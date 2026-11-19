import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseCliArgs } from './args.js'
import { SOLVER_DRIVERS, createDimacsSolver } from './dimacsAdapter.js'
import { printError, printResult, printStart } from './reporter.js'
import { createMinisatSolver } from '../src/domain/minisatSolver.js'
import { SOLVER_TYPES } from '../src/domain/solverTypes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_BASE_URL = `${pathToFileURL(path.resolve(__dirname, '../public')).href}/`

async function resolveSolverBackend(solverName) {
  if (solverName === SOLVER_TYPES.MINISAT) {
    return {
      label: 'MiniSat (WASM)',
      callback: await createMinisatSolver(PUBLIC_BASE_URL)
    }
  }

  if (solverName === SOLVER_TYPES.BUILTIN) {
    return {
      label: 'Built-in JS Solver',
      callback: null
    }
  }

  const driver = SOLVER_DRIVERS[solverName]
  return {
    label: `${driver.label} (DIMACS)`,
    callback: createDimacsSolver(solverName)
  }
}

async function main() {
  let options

  try {
    options = parseCliArgs(process.argv.slice(2))
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }

  const backend = await resolveSolverBackend(options.solverName)
  const bundleUrl = new URL('libs/satBundle.min.js', PUBLIC_BASE_URL).href
  const { EquationSolver } = await import(bundleUrl)

  const code = fs.readFileSync(options.filePath, 'utf8')
  const solver = EquationSolver.create()
  solver.setSatSolverCallback(backend.callback)
  const start = new Date()

  printStart(backend.label, start)

  try {
    const result = solver.solve(code)
    printResult(result, start)
  } catch (err) {
    printError(err, start)
    process.exit(1)
  }
}

main()