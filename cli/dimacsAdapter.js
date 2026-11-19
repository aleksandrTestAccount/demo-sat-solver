import { execFileSync } from 'node:child_process'
import { clausesToDimacs, parseDimacsSolution } from '../src/domain/dimacsCodec.js'

export const SOLVER_DRIVERS = {
  z3: { label: 'Z3 SMT/SAT Solver', bin: 'z3', args: ['-in', '-dimacs'] },
  cadical: { label: 'CaDiCaL SAT Solver', bin: 'cadical', args: ['--quiet'] },
  cryptominisat: { label: 'CryptoMiniSat Solver', bin: 'cryptominisat5', args: ['--verb=0'] }
}

export const SUPPORTED_SOLVERS = Object.keys(SOLVER_DRIVERS)

const MAX_STDIO_BUFFER = 64 * 1024 * 1024

export function createDimacsSolver(solverName = 'z3') {
  const driver = SOLVER_DRIVERS[solverName]
  if (!driver) {
    throw new Error(
      `Unknown solver "${solverName}". Allowed solvers: ${SUPPORTED_SOLVERS.join(', ')}, builtin`
    )
  }

  return function solveClauses(clauses) {
    if (!clauses?.length) return {}

    const { dimacs, varMap, varsCount, clausesCount } = clausesToDimacs(clauses)

    console.log(`Invoking external solver "${driver.bin}" (${varsCount} vars, ${clausesCount} clauses)...`)

    let stdout
    try {
      stdout = execFileSync(driver.bin, driver.args, {
        input: dimacs,
        encoding: 'utf8',
        maxBuffer: MAX_STDIO_BUFFER
      })
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`Solver binary "${driver.bin}" not found in PATH.`, { cause: err })
      }
      if (err.status === 10 || err.status === 20) {
        stdout = err.stdout || ''
      } else {
        throw err
      }
    }

    return parseDimacsSolution(stdout, varMap)
  }
}