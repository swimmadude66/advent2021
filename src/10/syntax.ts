import {join} from 'path'
import {readInput} from '../utils/utils'

const inputPath = join(__dirname, './input.txt')
const inputData = readInput(inputPath)

const lines = inputData

const openBraces = ['(','[','{','<']
const closeBraces = [')',']','}','>']

const illegalsScoreTable = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
}

const completeScoreTable = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
}

function parseLine(line: string): {illegal?: string, remaining?: string[]} {
    let illegal
    let remaining
    const stack = []
    for(let i=0; i<line.length; i++) {
        const char = line[i]
        const closeInd = closeBraces.indexOf(char)
        if (closeInd >= 0) {
            const pair = stack.shift()
            if (!illegal && openBraces[closeInd] !== pair) {
                console.log(`error ar char :${i}. received illegal ${char}`)
                illegal = char
            }
        } else if (openBraces.indexOf(char) >= 0) {
            stack.unshift(char)
        }
    }
    if (!illegal) {
        remaining = stack.map(open => closeBraces[openBraces.indexOf(open)])
    }
    return {
        illegal, remaining
    }
}

let illegalScore = 0
let completeScores = []
lines.forEach(l => {
    const {illegal, remaining} = parseLine(l)
    if (illegal) {
        illegalScore += illegalsScoreTable[illegal]
    } else {
        let completionScore = 0
        remaining.forEach(c => {
            completionScore = (completionScore * 5) + completeScoreTable[c]
        })
        completeScores.push(completionScore)
    }
})

const sortedScores = completeScores.sort((a,b) => a-b)
const middleIndex = (completeScores.length-1)/2
const middleScore = sortedScores[middleIndex]
console.log(`\n---------\nFinal Scores\nValidator: ${illegalScore}\nAutocomplete: ${middleScore}`)