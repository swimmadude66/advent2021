import { readFileSync } from 'fs'

export function readInput(filePath: string): string[] {
    const inputContents = readFileSync(filePath).toString()
    return inputContents.split(/\s*\n\s*/g).filter(d => d && d.length)
}