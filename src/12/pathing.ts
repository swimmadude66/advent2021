import {join} from 'path'
import {readInput} from '../utils/utils'

const inputPath = join(__dirname, './input.txt')
const inputData = readInput(inputPath)

const vertices = inputData.map(l => l.split(/\s*-\s*/, 2))

const graph: Record<string, Set<string>> = vertices.reduce((g, [start, end]) => {
    if (!(start in g)) {
        g[start] = new Set()
    }
    (g[start] as Set<string>).add(end)
    if (!(end in g)) {
        g[end] = new Set()
    }
    (g[end] as Set<string>).add(start)
    return g
}, {})

function walkGraph(startNode: string, visitedNodes: string[]): string[][] {
    const paths = []
    const availablePaths = Array.from(graph[startNode]).filter(n => !(/^[a-z]/.test(n) && visitedNodes.indexOf(n) >= 0))
    const path = [...visitedNodes, startNode]
    availablePaths.forEach(p => {
        if (p === 'end') {
            paths.push([...path, p])
        } else {
            paths.push(...walkGraph(p, path))
        }
    })
    return paths
}

function walkGraph2(startNode: string, visitedNodes: string[]): string[][] {
    const paths = []
    const availablePaths = Array.from(graph[startNode]).filter(n => n!== 'start')
    const path = [...visitedNodes, startNode]
    availablePaths.forEach(p => {
        if(/^[a-z]/.test(p) && path.indexOf(p) >= 0) {
            const seenSmall = []
            const small = path.filter(v => /^[a-z]/.test(v))
            for(let i = 0; i < small.length; i++) {
                if (seenSmall.indexOf(small[i]) >= 0) {
                    return
                } else {
                    seenSmall.push(small[i])
                }
            }
            
        }
        if (p === 'end') {
            const fullPath = [...path, p]
            paths.push(fullPath)
        } else {
            paths.push(...walkGraph2(p, path))
        }
    })
    return Array.from(paths)
}

const pt1Results = walkGraph('start', [])
const pt2Results = walkGraph2('start', [])

console.log(`There are ${pt1Results.length} unique paths through the caves`)
console.log(`There are ${pt2Results.length} paths with a duplicate small cave`)