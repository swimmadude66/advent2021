import { readFileSync } from 'fs'
import { join } from 'path'

const inputContents = readFileSync(join(__dirname, './input.txt')).toString()
const depthRecords = inputContents.split(/\s*\n\s*/g).filter(d => d && d.length).map(d => Number(d))

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
