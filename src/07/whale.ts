import {join} from 'path'
import {readInput} from '../utils/utils'

const inputPath = join(__dirname, './input.txt')
const inputData = readInput(inputPath)

const positions = []
let min = Infinity
let max = 0
inputData[0].split(/\s*,\s*/g).forEach(p => {
    const n = Number(p)
    if (n < min) {
        min = n
    }
    if (n > max) {
        max = n
    }
    positions.push(n)
})

let minFuelAmt = Infinity
let minInd = -1
let pt2MinFuelAmt = Infinity
let pt2MinInd = -1
for (let i = min; i<=max; i++) {
    let fuelSpent = positions.reduce((total, curr) => {
        const top = Math.max(curr, i)
        const bottom = Math.min(curr, i)
        total += top - bottom
        return total
    }, 0)
    if (fuelSpent < minFuelAmt) {
        minFuelAmt = fuelSpent
        minInd = i
    }
    let pt2FuelSpent = positions.reduce((total, curr) => {
        const top = Math.max(curr, i)
        const bottom = Math.min(curr, i)
        const n = top - bottom
        const linearFuel = (n *(n + 1)) / 2 // https://math.stackexchange.com/questions/593318/factorial-but-with-addition/593323
        total += linearFuel
        return total
    }, 0)
    if (pt2FuelSpent < pt2MinFuelAmt) {
        pt2MinFuelAmt = pt2FuelSpent
        pt2MinInd = i
    }
}

console.log(`Part 1 Move to position: ${minInd}; fuel spent: ${minFuelAmt}`)
console.log(`PArt 2 Move to position: ${pt2MinInd}; fuel spent: ${pt2MinFuelAmt}`)