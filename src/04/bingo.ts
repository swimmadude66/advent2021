import {join} from 'path'
import {readInput} from '../utils/utils'

const inputPath = join(__dirname, './input.txt')
const inputData = readInput(inputPath)

const numberCalls = inputData.shift().trim().split(/,\s*/)
const boards: string[][][] = []
const hits: boolean[][][] = []

let boardData = inputData
while(boardData.length) {
    const [row1, row2, row3, row4, row5, ...rest] = boardData
    boards.push([row1, row2, row3, row4, row5].map(rstring => rstring.split(/\s+/g)))
    hits.push(JSON.parse(JSON.stringify([...new Array(5).fill([...new Array(5).fill(false)])])))
    boardData = rest
}

let boardWon = boards.map(_ => false)

let winData = []

numberCalls.forEach((called, calledIndex) => {
    boards.forEach((board, boardIndex) => {
        board.forEach((boardRow, rowIndex) => {
            boardRow.forEach((boardEntry, colIndex) => {
                if (boardEntry === called) {
                    hits[boardIndex][rowIndex][colIndex] = true
                }
                const rowWin = hits[boardIndex][rowIndex].every(h => h)
                const colWin = hits[boardIndex].every(row => row[colIndex] === true)
                if ((rowWin || colWin) && !boardWon[boardIndex]) {
                    boardWon[boardIndex] = true
                    const missedSum = board.reduce((rowTotals: number[], row, hitsRowIndex) => {
                        const misses = row.filter((v, i) => !hits[boardIndex][hitsRowIndex][i])
                        rowTotals[hitsRowIndex] = misses.reduce((total, curr) => total + (Number(curr)), 0)
                        return rowTotals
                    }, [] as number[]).reduce((acc, r) => acc + r, 0)
                    const score = missedSum * Number(called)
                    winData.push({boardIndex, calledIndex, called, score})
                }
            })
        })
    })
})

const bestBoard = winData[0]
const worstBoard = winData[winData.length - 1]

console.log(`board_${bestBoard.boardIndex} has won first on turn_${bestBoard.calledIndex} with the number: ${bestBoard.called}`)
console.log(`Winning Score: ${bestBoard.score}`)
console.log('\n\n')
console.log(`board_${worstBoard.boardIndex} has won last on turn_${worstBoard.calledIndex} with the number: ${worstBoard.called}`)
console.log(`Winning Score: ${worstBoard.score}`)