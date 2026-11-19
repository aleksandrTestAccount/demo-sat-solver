export function clausesToDimacs(clauses) {
  if (!clauses?.length) {
    return { dimacs: 'p cnf 0 0\n', varMap: {}, varsCount: 0, clausesCount: 0 }
  }

  const nameToId = new Map()
  const varMap = {}
  let nextId = 1

  const getVarId = (name) => {
    if (!nameToId.has(name)) {
      nameToId.set(name, nextId)
      varMap[nextId] = name
      nextId += 1
    }
    return nameToId.get(name)
  }

  const lines = clauses.map((clause) => {
    const nums = clause.map((rawLit) => {
      const str = String(rawLit)
      const isNeg = str.startsWith('!')
      const varName = isNeg ? str.slice(1) : str
      const id = getVarId(varName)
      return isNeg ? -id : id
    })
    return `${nums.join(' ')} 0`
  })

  const varsCount = nextId - 1
  const clausesCount = lines.length
  const dimacs = `p cnf ${varsCount} ${clausesCount}\n${lines.join('\n')}\n`

  return { dimacs, varMap, varsCount, clausesCount }
}

export function parseDimacsSolution(rawOutput, varMap) {
  const text = String(rawOutput || '').trim()
  if (!text) return false

  const assignment = {}

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    
    if (!line || line.startsWith('c') || line.includes(':')) {
      continue
    }

    if (line === 'unsat' || line === 'UNSAT' || line === 's UNSATISFIABLE') {
      return false
    }

    if (line === 'sat' || line === 'SAT' || line === 's SATISFIABLE') {
      continue
    }
    
    const cleanLine = line.replace(/^(v|SAT|sat)\s+/, '')

    for (const token of cleanLine.split(/\s+/)) {
      const num = Number(token)
      if (Number.isInteger(num) && num !== 0) {
        const varName = varMap[Math.abs(num)]
        if (varName) {
          assignment[varName] = num > 0 ? 1 : 0
        }
      }
    }
  }

  return Object.keys(assignment).length > 0 ? assignment : false
}