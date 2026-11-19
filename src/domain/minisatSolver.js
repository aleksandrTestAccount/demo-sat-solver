import { clausesToDimacs, parseDimacsSolution } from './dimacsCodec.js'

let createMinisatFactory = null

function resolvePublicAsset(relativePath, baseUrl) {
  const normalizedBase = baseUrl.endsWith('/') || baseUrl.endsWith('.html')
    ? baseUrl
    : `${baseUrl}/`
  return new URL(relativePath, normalizedBase).href
}

export async function createMinisatSolver(baseUrl) {
  if (!createMinisatFactory) {
    const minisatJsUrl = resolvePublicAsset('libs/minisat.js', baseUrl)
    const module = await import(/* @vite-ignore */ minisatJsUrl)
    createMinisatFactory = module.default || module.Module || module
  }

  const minisat = await createMinisatFactory({
    noInitialRun: true,
    stdin: () => null,
    print: () => {},
    printErr: () => {},
    locateFile: (fileName) => resolvePublicAsset(`libs/${fileName}`, baseUrl)
  })

  return (clauses) => {
    if (!clauses?.length) return {}

    const { dimacs, varMap } = clausesToDimacs(clauses)
    minisat.FS.writeFile('/in.cnf', dimacs)

    try {
      minisat.callMain(['-verb=0', '/in.cnf', '/out.txt'])
    } catch (err) {
      // MiniSat exits with status 10 (SAT) or 20 (UNSAT)
      if (err?.name !== 'ExitStatus') {
        throw err
      }
    }

    const rawOutput = minisat.FS.readFile('/out.txt', { encoding: 'utf8' })

    try {
      minisat.FS.unlink('/in.cnf')
      minisat.FS.unlink('/out.txt')
    } catch {
      // ignore cleanup errors
    }

    return parseDimacsSolution(rawOutput, varMap)
  }
}