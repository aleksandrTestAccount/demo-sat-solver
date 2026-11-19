import { ref, onBeforeUnmount } from 'vue'
import { SolverWrapper } from '../domain/SolverWrapper.js'
import { SOLVER_TYPES } from '../domain/solverTypes.js'

const PROGRESS_DELAY_MS = 180

function formatTimestamp(date) {
  const pad2 = (n) => String(n).padStart(2, '0')
  const pad3 = (n) => String(n).padStart(3, '0')
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}.${pad3(date.getMilliseconds())}`
}

function buildTiming(startTime) {
  const endTime = new Date()
  return {
    startedAt: formatTimestamp(startTime),
    endedAt: formatTimestamp(endTime),
    duration: endTime - startTime
  }
}

export function useSolver({ onStart, onFinish } = {}) {
  const isCalculating = ref(false)
  const progressMsg = ref('')

  const solverWrapper = new SolverWrapper()
  let progressTimeout = null
  let startTime = null

  const clearTimerAndStatus = () => {
    if (progressTimeout) {
      clearTimeout(progressTimeout)
      progressTimeout = null
    }
    isCalculating.value = false
    progressMsg.value = ''
  }

  const executeWorker = (code, extraPayload = {}) => {
    onStart?.()
    clearTimerAndStatus()

    startTime = new Date()

    progressTimeout = setTimeout(() => {
      isCalculating.value = true
      progressMsg.value = 'Compiling to 3-CNF and starting solver...'
    }, PROGRESS_DELAY_MS)

    solverWrapper.solve(code, {
      extraPayload,
      onProgress: (msg) => {
        progressMsg.value = msg
      },
      onSuccess: (result) => {
        const timing = buildTiming(startTime)
        clearTimerAndStatus()
        onFinish?.({ ...result, _timing: timing })
      },
      onFailure: (err) => {
        const timing = buildTiming(startTime)
        clearTimerAndStatus()
        onFinish?.({
          isCrashError: true,
          message: err?.msg || err?.message || 'Solver Error occurred',
          details: err?.details || err?.stack || '',
          _timing: timing
        })
      }
    })
  }

  const solve = (code, { solverType = SOLVER_TYPES.MINISAT } = {}) =>
    executeWorker(code, { solverType })

  const applyExternalAssignment = (code, assignment) =>
    executeWorker(code, { externalAssignment: assignment })

  const compileToDimacs = (code) =>
    new Promise((resolve, reject) => {
      solverWrapper.solve(code, {
        extraPayload: { extractDimacs: true },
        onSuccess: (dimacsPayload) => resolve(dimacsPayload),
        onFailure: (err) => reject(err)
      })
    })

  const stop = () => {
    clearTimerAndStatus()
    solverWrapper.terminate()
    onFinish?.({
      isCrashError: true,
      message: 'Solver Error: Stopped by user'
    })
  }

  onBeforeUnmount(() => {
    clearTimerAndStatus()
    solverWrapper.terminate()
  })

  return {
    isCalculating,
    progressMsg,
    solve,
    stop,
    compileToDimacs,
    applyExternalAssignment
  }
}