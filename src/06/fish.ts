import {join} from 'path'
import {readInput} from '../utils/utils'

const inputPath = join(__dirname, './input.txt')
const inputData = readInput(inputPath)

// naiive approach, causes stack overflow
// function calculateGrowth(initialState: number[], days: number): number[] {
//     let fish = initialState
//     for (let i = 1; i <= days; i++) {
//         const oldFish = []
//         const newFish = []
//         fish.forEach((f, i) => {
//             f--
//             if (f < 0) {
//                 f = 6
//                 newFish.push(8) // extra 2 days for maturity
//             }
//             oldFish.push(f)
//         })
//         fish = [...oldFish, ...newFish] // red fish, blue fish
//     }
//     return fish
// }

function batchCalculate(initialState: {[cycle: number]: number}, days: number): {[cycle: number]: number} {
    
    let currCounts = initialState
    for (let i = 1; i <= days; i++) {
        const newMap = {}
        for(let cycle = 0; cycle <= 8; cycle++) {
            const count = currCounts[cycle] ?? 0
            if (cycle === 0) {
                newMap[8] = count
                newMap[6] = (newMap[6] ?? 0) + count
            } else {
                const next = cycle - 1
                newMap[next] = (newMap[next] ?? 0) + count
            } 
        }
        currCounts = {...newMap}
    }
    return currCounts
}

function countFish(state: {[cycle: number]: number}): number {
    return Object.entries(state).reduce((acc: number, [cycle, count]: [any, number]) => acc + count, 0)
}

const start = inputData[0].split(/\s*,\s*/g).map(f => Number(f))
const countByCycle = start.reduce((cycleMap, curr) => {
    if (!(curr in cycleMap)) {
        cycleMap[curr] = 0
    }
    cycleMap[curr] += 1
    return cycleMap
}, {})
const eightyDays = batchCalculate(countByCycle, 80)
const eightyCount = countFish(eightyDays)
console.log(`After 80 days, there are a total of ${eightyCount} fish`)
const remaining = 256 - 80
const twofivesixDays = batchCalculate(eightyDays, remaining)
const twofivesixCount = countFish(twofivesixDays)
console.log(`After 256 days, there are a total of ${twofivesixCount} fish`)

