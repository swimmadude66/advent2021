import { readFileSync } from 'fs'

export function readInput(filePath: string): string[] {
    const inputContents = readFileSync(filePath).toString()
    return inputContents.split(/\s*\n\s*/g).filter(d => d && d.length)
}

export function init2dArray<T>(width: number, height: number, initValue: T): T[][] {
    return JSON.parse(JSON.stringify(new Array(width).fill(new Array(height).fill(initValue))))
}