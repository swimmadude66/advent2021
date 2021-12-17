import {join} from 'path'
import {readInput} from '../utils/utils'

const inputPath = join(__dirname, './input.txt')
const inputData = readInput(inputPath)

const lines = inputData
const polymerTemplate = lines.shift()
const [...rules] = lines

const ruleMap = rules.reduce((m, r) => {
    const [match, add] = r.split(/\s*-\s*>\s*/, 2)
    m[match] = add
    return m
}, {})

console.log(`template: ${polymerTemplate}`)

const pairMap: {[pair: string]: {pairs: string[], add: string}} = Object.entries(ruleMap).reduce((pm, [match, add]) => {
    if (!(match in pm))  {
        pm[match] = {pairs: [], add}
    }
    const [firstLetter, secondLetter] = Array.from(match)
    pm[match].pairs.push(`${firstLetter}${add}`)
    pm[match].pairs.push(`${add}${secondLetter}`)
    return pm
}, {})

interface PolymerState {
    pairCounts: {[pair: string] : number}
    letterCounts: {[key: string]: number}
}

function calculatePolymer(startCond: PolymerState, cycles: number): PolymerState {
    const letterCounts = startCond.letterCounts
    let pairCounts = startCond.pairCounts
    for (let i = 0; i < cycles; i++) {
        let newPairCount = {}
        Object.entries(pairCounts).forEach(([pair, count]) => {
            const {pairs, add} = pairMap[pair]
            letterCounts[add] = (letterCounts[add] ?? 0) + count
            pairs.forEach(p => {
                newPairCount[p] = (newPairCount[p] ?? 0) + count
            })
        })
        pairCounts = newPairCount
    }
    return {pairCounts, letterCounts}
}

let letterFreq = {}
let pairCnts: {[key: string]: number} = {}
const letters = Array.from(polymerTemplate)
letters.forEach((char, i, src) => {
    letterFreq[char] = (letterFreq[char] ?? 0) + 1 
    if (i > 0) {
        const pair =([src[i - 1],char].join(''))
        pairCnts[pair] = (pairCnts[pair] ?? 0) + 1 
    }
})
const TenCycles = calculatePolymer({pairCounts: pairCnts, letterCounts: letterFreq}, 10)
console.log('counts at cycle 10', JSON.stringify(TenCycles.letterCounts, null, 2))
const sorted = Object.entries(TenCycles.letterCounts).map(([letter, count]) => count).sort((a, b) => a - b)
const score = sorted[sorted.length -1] - sorted[0]
console.log(`Score at Cycle 10: ${score}`)

const FortyCycles = calculatePolymer(TenCycles, 30)
console.log('counts at cycle 40', JSON.stringify(FortyCycles.letterCounts, null, 2))
const sorted40 = Object.entries(FortyCycles.letterCounts).map(([letter, count]) => count).sort((a, b) => a - b)
const score40 = sorted40[sorted40.length -1] - sorted40[0]
console.log(`Score at Cycle 40: ${score40}`)
