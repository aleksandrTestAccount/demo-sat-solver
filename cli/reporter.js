function formatTime(date) {
  const ms = String(date.getMilliseconds()).padStart(3, '0')
  return `${date.toTimeString().slice(0, 8)}.${ms}`
}

function printSection(title, lines) {
  if (!lines?.length) return
  console.log(`\n${title}`)
  for (const line of lines) {
    console.log(`  ${line}`)
  }
}

export function printStart(backendLabel, startDate) {
  console.log(`Backend: ${backendLabel}`)
  console.log(`Started at ${formatTime(startDate)};`)
}

export function printError(err, startDate, endDate = new Date()) {
  console.log(`  ended with error at ${formatTime(endDate)}; duration: ${endDate - startDate}ms\n`)
  console.error('ERROR:')

  if (err?.name === 'SolverError') {
    console.error(err.msg)
    if (err.details) console.error(err.details)
    return
  }

  console.error(err?.message || err)
}

export function printResult(result, startDate, endDate = new Date()) {
  console.log(`  ended at ${formatTime(endDate)}; duration: ${endDate - startDate}ms`)

  const isSat = result.results !== false
  console.log(`\nResult: ${isSat ? 'True' : 'False'}`)

  if (result.sat3Stats) {
    printSection('3-SAT', [
      `vars: ${result.sat3Stats.varsCount ?? '(empty)'}`,
      `clauses: ${result.sat3Stats.clausesCount ?? '(empty)'}`
    ])
  }

  if (!isSat) {
    printSection('binarySearchSteps', result.binarySearchSteps)
    console.log('')
    return
  }

  printSection('Format', result.format)
  printSection('binarySearchSteps', result.binarySearchSteps)

  if (result.inputVarsResults) {
    const vars = Object.entries(result.inputVarsResults).map(([k, v]) => `${k}: ${v}`)
    printSection('Results', vars)
  }

  if (result.tokensLines?.length) {
    const equations = result.tokensLines.map((tokens) => {
      const evaluated = tokens
        .map((t) => result.inputVarsResults?.[t] ?? t)
        .join(' ')
      return `${evaluated}  --->  [ ${tokens.join(' ')} ]`
    })
    printSection('Equations', equations)
  }

  console.log('')
}