import {join} from 'path'
import {readInput} from '../utils/utils'

const inputPath = join(__dirname, './input.txt')
const inputData = readInput(inputPath)

const floorMap = inputData.map(rowString => Array.from(rowString).map(h => Number(h)))

function getNeighborCoords(row: number, col: number): {r: number, c: number}[] {
    const neighborCoords = [
        row >= 1 ? {r: row - 1, c: col} : undefined, // above
        row < floorMap.length - 1 ? {r: row + 1, c: col} : undefined, // below
        col >= 1 ? {r: row, c: col - 1} : undefined, // left
        col < floorMap[row].length - 1 ? {r: row, c: col + 1} : undefined // right
    ].filter(h => h != null)
    return neighborCoords
}

function getNeighbors(row: number, col: number): number[] {
    const neighbors = getNeighborCoords(row, col).map(({r, c}) => floorMap[r][c])
    return neighbors
}

function isLowestNeighbor(row: number, col:  number): boolean {
    const neighbors = getNeighbors(row, col)
    const self = floorMap[row][col]
    return neighbors.every(n => n > self)
}

function findLowPoints(map: number[][]): number[] {
    const lowPoints = []
    map.forEach((row, rowIndex)  => {
        let printRow = ''
        row.forEach((col, colIndex) => {
            if (isLowestNeighbor(rowIndex, colIndex)) {
                lowPoints.push(col)
                printRow += col
            } else {
                printRow += '.'
            }
        })
        console.log(`${printRow}`)
    })
    return lowPoints
}

function exploreBasin(map: {val: number, seen: boolean}[][], row: number, col: number): number[] {
    const includedInd = []
    const self =  map[row][col]
    if (self.seen) {
        return includedInd
    }
    if (self.val === 9) {
        return includedInd
    }
    includedInd.push(self.val)
    self.seen = true
    const neighbors = getNeighborCoords(row, col)
    neighbors.forEach(({r, c}) => {
        const neighborIncludes = exploreBasin(map, r, c)
        includedInd.push(...neighborIncludes)
    })
    return includedInd
}


const lowPoints = findLowPoints(floorMap)
const total = lowPoints.reduce((t, curr) => t + curr, 0)
const riskTotal = total + lowPoints.length
console.log(`low points:`, lowPoints, `risk total:`, riskTotal)

const basins = []
const visitMap = floorMap.map(r => r.map(c => ({val: c, seen: false})))
visitMap.forEach((r, ri) => r.forEach((c, ci) => {
    const basinAtLoc = exploreBasin(visitMap, ri, ci)
    if (basinAtLoc.length) {
        basins.push(basinAtLoc)
    }
}))

const top3 = basins.sort((a,b) => b.length - a.length).slice(0, 3)
const product = top3.reduce((prod, curr) => prod * curr.length, 1)
console.log(`product of top3 sizes: ${product}`)