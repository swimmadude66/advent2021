import { join } from 'path'
import {readInput} from '../utils/utils'

const inputPath = join(__dirname, './input.txt')
const depthRecords = readInput(inputPath).map(d => Number(d))

let totalIncreases = 0
let windowIncreases = 0

let firstRecord = depthRecords.shift()
const window = [firstRecord]
depthRecords.forEach((d) => {
    if (d > window[window.length-1]) {
        totalIncreases += 1
    }
    window.push(d)
    if (window.length > 3) {
        const removed = window.shift()
        if (removed < d) {
            // window got bigger
            windowIncreases++
        }
    }
})

console.log('total increases', totalIncreases)
console.log('window increases', windowIncreases)
