import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'
import { SUPPORTED_SOLVERS } from './dimacsAdapter.js'
import { SOLVER_TYPES } from '../src/domain/solverTypes.js'

export const ALL_SOLVERS = [SOLVER_TYPES.MINISAT, SOLVER_TYPES.BUILTIN, ...SUPPORTED_SOLVERS]

export function parseCliArgs(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      solver: {
        type: 'string',
        short: 's',
        default: SOLVER_TYPES.MINISAT
      }
    }
  })

  if (positionals.length > 1) {
    throw new Error(`Error: Unexpected extra argument "${positionals}". Only one input file is supported.`)
  }

  const [filePath] = positionals
  if (!filePath) {
    throw new Error(
      `Usage: node cli/index.js <file.eproto> [--solver <name>]\n` +
      `Available solvers: ${ALL_SOLVERS.join(', ')} (default: ${SOLVER_TYPES.MINISAT})`
    )
  }

  const solverName = values.solver.toLowerCase()
  if (!ALL_SOLVERS.includes(solverName)) {
    throw new Error(
      `Error: Unknown solver "${solverName}". Available: ${ALL_SOLVERS.join(', ')}`
    )
  }

  const resolvedPath = path.resolve(process.cwd(), filePath)
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Error: File not found -> ${resolvedPath}`)
  }

  return { filePath: resolvedPath, solverName }
}