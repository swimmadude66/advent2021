import {join} from 'path'
import {init2dArray, readInput} from '../utils/utils'

const inputPath = join(__dirname, './input.txt')
const inputData = readInput(inputPath)

const dots = []
const folds = []
let maxX = 0
let maxY = 0
inputData.forEach((l) => {
    if(/^fold/.test(l)) {
        const fold = l.replace(/^.*?((x|y).*)$/i, '$1')
        const [axis, coord] = fold.split('=')
        folds.push({axis, coord: Number(coord)})
    } else {
        const [x, y] = l.split(',').map((v) => Number(v))
        if (x > maxX) {
            maxX = x
        }
        if (y > maxY) {
            maxY = y
        }
        dots.push({x, y})
    }
})

let paperX = maxX + 1
let paperY = maxY + 1
const paper = init2dArray(paperY, paperX, false)

dots.forEach(({x, y}) => {
    paper[y][x] = true
})

let beforeFold = paper
folds.forEach(({axis, coord}, i) => {
    const folded = []
    paperX = (axis === 'x') ? (coord) : paperX
    paperY = (axis === 'y') ? (coord) : paperY
    for (let y = 0; y < paperY; y ++) {
        folded[y] = []
        for (let x = 0; x < paperX; x++) {
            folded[y][x] = beforeFold[y][x]
        }
    }
    if (axis === 'y') {
        for (let y = coord + 1; y < beforeFold.length; y++) {
            const reflectedY = coord - (y - coord)
            for (let x = 0; x < beforeFold[y].length; x++) {
                folded[reflectedY][x] = folded[reflectedY][x] || beforeFold[y][x]
            }
        }
    } else {
        for (let y = 0; y < beforeFold.length; y++) {
            for (let x = coord + 1; x < beforeFold[y].length; x++) {
                const reflectedX = coord - (x - coord)
                folded[y][reflectedX] = folded[y][reflectedX] || beforeFold[y][x]
            }
        }
    }
    beforeFold = folded
    console.log(`After ${i + 1} folds`)
    let showingDots = 0
    folded.forEach(row => {
        let rowString = ''
        row.forEach(col => {
            if (col) {
                showingDots ++
                rowString += '#'
            } else {
                rowString += ' '
            }
        })
        console.log(rowString)
    })
    console.log(`${showingDots} visible\n`)
})