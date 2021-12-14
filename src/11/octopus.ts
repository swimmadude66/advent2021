import {join} from 'path'
import {readInput} from '../utils/utils'

const inputPath = join(__dirname, './input.txt')
const inputData = readInput(inputPath)

function getNeighborCoords(grid: number[][], row: number, col: number): {r: number, c: number}[] {
    const neighborCoords = []
    if (row >= 1) {
        if (col >= 1) {
            neighborCoords.push({r: row - 1, c: col - 1}) // top left
        }
        neighborCoords.push({r: row - 1, c: col}) // straight above
        if (col < grid[row].length - 1) {
            neighborCoords.push({r: row - 1, c: col + 1}) // top right
        }
    }
    if (col >= 1) {
        neighborCoords.push({r: row, c: col - 1}) // straight left
    }
    if (col < grid[row].length - 1) {
        neighborCoords.push({r: row, c: col + 1}) // straight right
    }
    if (row < grid.length - 1) {
        if (col >= 1) {
            neighborCoords.push({r: row + 1, c: col - 1}) // bottom left
        }
        neighborCoords.push({r: row + 1, c: col}) // straight below
        if (col < grid[row].length - 1) {
            neighborCoords.push({r: row + 1, c: col + 1}) // bottom right
        }
    }
    return neighborCoords
}

function processFlashes(grid: number[][], row: number, col: number): void {
    const neighborCoords = getNeighborCoords(grid, row, col)
    neighborCoords.forEach(({r,c}) => {
        const before = grid[r][c]
        grid[r][c] = before + 1
        if (before === 9) {
            processFlashes(grid, r, c)
        }
    })
}

function processStep(grid: number[][]): {grid: number[][], flashes: {r: number, c: number}[], sync: boolean} {
    const flashes = []
    let sync = true
    // normal increase
    for (let r = 0; r < grid.length; r++) {
        const row = grid[r]
        for (let c = 0; c < row.length; c ++) {
            grid[r][c] = grid[r][c] + 1 // increment
        }
    }
    // process flashes
    const willFlash = []
    for (let r = 0; r < grid.length; r++) {
        const row = grid[r]
        for (let c = 0; c < row.length; c ++) {
            const cell = grid[r][c]
            if (cell > 9) {
                willFlash.push({r, c})
            }
        }
    }
    willFlash.forEach(({r,c}) => processFlashes(grid, r, c))
    // count flashes and reset
    
    for (let r = 0; r < grid.length; r++) {
        const row = grid[r]
        let allCellsFlashed = true
        for (let c = 0; c < row.length; c ++) {
            const cell = grid[r][c]
            if (cell > 9) {
                flashes.push({r, c})
                grid[r][c] = 0
            } else {
                allCellsFlashed = false
            }
        }
        if (!allCellsFlashed) {
            sync = false
        }
        console.log(row.join(''))
    }
    console.log('\n')
    return {grid, flashes, sync}
}

let octoGrid = inputData.map(l => Array.from(l).map(c => Number(c)))
let totalFlashes = 0
let allFlashedStep
let i = 0
while ((!allFlashedStep) || i < 100) {
    const step = i + 1
    const {grid, flashes, sync} = processStep(octoGrid)
    if (i < 100) {
        totalFlashes += flashes.length
    }
    if (sync) {
        allFlashedStep = i
        console.log(`All octopi flashed together on step ${step}`)
    }
    console.log(`After ${step} cycles, there have been ${totalFlashes} flashes`)

    octoGrid = grid
    i++
}