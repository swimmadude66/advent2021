import {join} from 'path'
import {init2dArray, readInput} from '../utils/utils'

const inputPath = join(__dirname, './input.txt')
const inputData = readInput(inputPath)

let maxX = 0
let maxY = 0
const touchedPoints: [number, number][] = []
const diagPoints: [number, number][] = []
inputData.forEach((lineString) => {
    const [start, end] = lineString.split(/\s+->\s+/)
    const [startX, startY] = start.split(/\s*,\s*/).map(v => Number(v))
    const [endX, endY] = end.split(/\s*,\s*/).map(v => Number(v))

    const lowerY = Math.min(startY, endY)
    const upperY = Math.max(startY, endY)
    const lowerX = Math.min(startX, endX)
    const upperX = Math.max(startX, endX)

    if (upperX > maxX) {
        maxX = upperX
    }

    if (upperY > maxY) {
        maxY = upperY
    }
    
    let touched: [number, number][] = []
    if (startX === endX) {
        // populate Ys
        const x = startX
        for (let y = lowerY; y <= upperY; y++) {
            touched.push([x, y])
        }
        touchedPoints.push(...touched)
    } else if (startY === endY) {
        // populate Xs
        const y = startY
        for (let x = lowerX; x <= upperX; x++) {
            touched.push([x, y])
        }
        touchedPoints.push(...touched)
    } else {
        let currX = startX
        let currY = startY
        // skip for pt1
        while(currX !== endX && currY !== endY) {
            touched.push([currX, currY])
            if (endX < currX) {
                currX--
            } else {
                currX++
            }
            if (endY < currY) {
                currY--
            } else {
                currY++
            }
        }
        touched.push([endX, endY])
        diagPoints.push(...touched)
    }
})



const floorMap = init2dArray(maxX + 1, maxY + 1, 0)


touchedPoints.forEach(([x, y]) => {
    floorMap[x][y] = (floorMap[x][y] ?? 0) + 1
})

const overlaps = floorMap.reduce((points, col) => {
    points.push(...col)
    return points
}, []).filter(p => p >= 2).length

console.log(`There are ${overlaps} overlaps of 2 or more vertical + horizontal lines`)

diagPoints.forEach(([x, y]) => {
    floorMap[x][y] = (floorMap[x][y] ?? 0) + 1
})
const pt2overlaps = floorMap.reduce((points, col) => {
    points.push(...col)
    return points
}, []).filter(p => p >= 2).length
console.log(`There are ${pt2overlaps} overlaps of 2 or more lines including diagonals`)
