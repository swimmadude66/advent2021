import {join} from 'path'
import {readInput} from '../utils/utils'

const inputPath = join(__dirname, './input.txt')
const inputData = readInput(inputPath)

let gammaOneCounts = []
inputData.forEach((row) => {
    const bits = [...row.trim()]
    bits.forEach((b, i) => {
        gammaOneCounts[i] = (gammaOneCounts[i] ?? 0) + Number(b)
    })
})
const gammaArray = gammaOneCounts.map((gb) => Number(gb >= inputData.length/2))
const epsilonArray = gammaArray.map(gb => Number(!gb))
const gamma = gammaArray.join('')
const epsilon = epsilonArray.join('')

const oxygen = filterForResults(inputData)
const co2 = filterForResults(inputData, false)


const gammaDec = parseInt(gamma, 2)
const epsilonDec = parseInt(epsilon, 2)
const powerMult = gammaDec * epsilonDec

const oxygenDec = parseInt(oxygen, 2)
const co2Dec = parseInt(co2, 2)
const lifeSupportMult = oxygenDec * co2Dec

function filterForResults(data: string[], mostCommon = true, pos = 0): string {
    const onesInPlace = data.reduce((acc, d) => (acc + (Number(d[pos]))), 0)
    const mostCommonBit = Number(onesInPlace >= data.length / 2)
    const filter = mostCommon ? mostCommonBit : Number(!mostCommonBit)
    const matches = data.filter(d => d[pos] === `${filter}`)
    if (matches.length === 1) {
        return matches[0]
    } else {
        return filterForResults(matches, mostCommon, pos+1)
    }
}

console.log(`Power Results\nGamma:   ${gamma} (${gammaDec})\nEpsilon: ${epsilon} (${epsilonDec})\nPower Mult: ${powerMult}\n`)
console.log(`Life Support Results\nO2:  ${oxygen} (${oxygenDec})\nCO2: ${co2} (${co2Dec})\nLife Support Mult: ${lifeSupportMult}`)