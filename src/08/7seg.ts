import {join} from 'path'
import {readInput} from '../utils/utils'

const inputPath = join(__dirname, './input.txt')
const inputData = readInput(inputPath)

/**
 *  Reference for "real" signals
 * {
 *   0: 'abcefg',
 *   1: 'cf',
 *   2: 'acdeg',
 *   3: 'acdfg',
 *   4: 'bcdf',
 *   5: 'abdfg',
 *   6: 'abdefg',
 *   7: 'acf',
 *   8: 'abcdefg',
 *   9: 'abcdfg',
 * }
*/

const displays = inputData.map(d => {
    const [digits, output] = d.split(/\s*\|\s*/g)
    return {digits, output}
})

const allNumbers = []
let total = 0
displays.forEach(({digits, output}) => {
    const digitSignals = digits.split(/\s+/g).map(d => Array.from(d).sort().join(''))
    const digitMap = decodeSignal(digitSignals)
    const outputSignals = output.split(/\s+/g).map(s => Array.from(s).sort().join(''))
    const result = outputSignals.map(o => digitMap[o] ?? 'X')
    console.log(result)
    const resultNums = result.map(r => Number(r)).filter(r => !isNaN(r))
    allNumbers.push(...resultNums)
    total += Number(resultNums.join(''))
})
const ezDigits = [ 1, 4, 7, 8 ]
const ezNums = allNumbers.reduce((count, curr) => {
    if (ezDigits.indexOf(curr) >= 0) {
        count++
    }
    return count
},0)
console.log(`${ezNums} digits on display are 1, 4, 7, or 8`)
console.log(`totals: ${total}`)




function decodeSignal(digits: string[]): {[orig: string]: number} {
    const harderNumbers = []
    const decodedNumbers: {[num: number]: string} = {}
    digits.forEach((dig) => {
        const d = Array.from(dig).sort().join('')
        if (d.length === 2) {
            decodedNumbers[1] = d
        } else if (d.length === 3) {
            decodedNumbers[7] = d
        } else if (d.length === 4) {
            decodedNumbers[4] = d
        } else if (d.length === 7) {
            decodedNumbers[8] = d
        } else {
            harderNumbers.push(d)
        }
    })

    /**
     * '5': [ '2', '3', '5' ],
     * '6': [ '0', '6', '9' ],
     */
    // guarantee longer numbers are decoded first, for use with shorter ones
    harderNumbers.sort((a,b) => b.length - a.length).forEach((n: string) => {
        if (n.length === 6) {
            // 6, 0, or 9
            if (!(Array.from(decodedNumbers[7]).every(s => Array.from(n).indexOf(s) >= 0))) {
                // 6 is the only one without 7 inside it
                decodedNumbers[6] = n
            } else if (!(Array.from(decodedNumbers[4]).every(f => Array.from(n).indexOf(f) >= 0))) {
                // 0 is also missing the crossbar from 4
                decodedNumbers[0] = n
            } else {
                // 9 is the only other length-6
                decodedNumbers[9] = n
            }
        } else if (n.length === 5) {
            // 2, 3, 5
            if ((Array.from(decodedNumbers[7]).every(s => Array.from(n).indexOf(s) >= 0))) {
                // 3 contains 7
                decodedNumbers[3] = n
            } else {
                const comboSignals: string[] = Array.from(decodedNumbers[9] + decodedNumbers[6] + decodedNumbers[1])
                const freqMap = comboSignals.reduce((m, curr) => {
                    if (!(curr in m)) {
                        m[curr] = 0
                    }
                    m[curr] += 1
                    return m
                }, {})
                const eSignal = Object.keys(freqMap).find(s => freqMap[s] === 1)
                if (n.indexOf(eSignal) >= 0) {
                    decodedNumbers[2] = n
                } else {
                    decodedNumbers[5] = n
                }
            }
        }
    })

    const signalToNumber = Object.entries(decodedNumbers).reduce((m, [num, signal]) => {
        m[signal] = Number(num)
        return m
    }, {})
    return signalToNumber

}