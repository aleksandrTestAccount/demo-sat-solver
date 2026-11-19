import { WORKER_EVENTS } from './workerEvents.js'
import { clausesToDimacs } from './dimacsCodec.js'
import { createMinisatSolver } from './minisatSolver.js'
import { SOLVER_TYPES } from './solverTypes.js'

let EquationSolverClass = null

self.addEventListener('message', async (e) => {
  const {
    code,
    baseUrl,
    extractDimacs,
    externalAssignment,
    solverType = SOLVER_TYPES.MINISAT
  } = e.data || {}

  try {
    if (!EquationSolverClass) {
      const bundleUrl = new URL('libs/satBundle.min.js', baseUrl).href
      const module = await import(/* @vite-ignore */ bundleUrl)
      EquationSolverClass = module.EquationSolver || module.default
    }

    const solver = EquationSolverClass.create()

    solver.addOnProgress((msg) => {
      postMessage({
        type: WORKER_EVENTS.PROGRESS,
        payload: msg
      })
    })

    if (extractDimacs) {
      let exported = null
      solver.setSatSolverCallback((clauses) => {
        exported = clausesToDimacs(clauses)
        return false
      })
      solver.solve(code)

      postMessage({
        type: WORKER_EVENTS.SUCCESS,
        payload: exported || clausesToDimacs([])
      })
      return
    }

    if (externalAssignment !== undefined) {
      solver.setSatSolverCallback(() => externalAssignment)
    } else if (solverType === SOLVER_TYPES.MINISAT) {
      const minisatCallback = await createMinisatSolver(baseUrl)
      solver.setSatSolverCallback(minisatCallback)
    }

    const readyResult = solver.solve(code)

    postMessage({
      type: WORKER_EVENTS.SUCCESS,
      payload: readyResult
    })
  } catch (err) {
    postMessage({
      type: WORKER_EVENTS.FAILURE,
      payload: err
    })
  }
})