import SolverWorker from './solver.worker.js?worker'
import { WORKER_EVENTS } from './workerEvents.js'

export class SolverWrapper {
  #worker = null

  solve(code, { onProgress, onSuccess, onFailure, extraPayload = {} } = {}) {
    this.terminate()

    try {
      this.#worker = new SolverWorker()

      this.#worker.onmessage = (e) => {
        const { type, payload } = e.data || {}

        if (type === WORKER_EVENTS.PROGRESS) {
          onProgress?.(payload)
          return
        }

        this.terminate()

        if (type === WORKER_EVENTS.SUCCESS) {
          onSuccess?.(payload)
        } else if (type === WORKER_EVENTS.FAILURE) {
          onFailure?.(payload)
        }
      }

      this.#worker.onerror = (err) => {
        this.terminate()
        onFailure?.(new Error(err.message || 'Worker thread crashed'))
      }

      this.#worker.postMessage({
        code,
        baseUrl: window.location.href,
        ...extraPayload
      })
    } catch (err) {
      this.terminate()
      onFailure?.(err)
    }
  }

  terminate() {
    if (this.#worker) {
      try {
        this.#worker.terminate()
      } catch {}
      this.#worker = null
    }
  }
}
