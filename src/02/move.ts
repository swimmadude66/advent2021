import {readInput} from '../utils/utils'
import {join} from 'path'

const inputPath = join(__dirname, './input.txt')
const instructions = readInput(inputPath)

let hPos = 0
let vPos = 0

let depth = 0
let aim = 0

instructions.forEach((i) => {
    const [direction, amplitude] = i.trim().toLowerCase().split(/\s+/)
    const numAmp = Number(amplitude)
    if (isNaN(numAmp)) {
        throw new Error(`Invalid amplitude: ${amplitude}`)
    }
    switch (direction) {
        case ('down'): {
            vPos += numAmp
            aim += numAmp
            break
        }
        case ('up'): {
            vPos = Math.max(0, vPos - numAmp) // don't go above water line
            aim -= numAmp
            break
        }
        case ('forward'): {
            hPos += numAmp
            depth += (aim * numAmp)
            break
        }
        default: {
            throw new Error(`Encountered invalid instruction: ${direction}`)
        }
    }
})

console.log(`Final position\nh: ${hPos},\npart1 depth: ${vPos},\npart 1 mult: ${hPos * vPos},\npart 2 depth: ${depth},\npart 2 mult: ${hPos * depth}`)