export class WaterSkiingCourse<T> {
    readonly name: string
    readonly buoyPositions: T[]
    readonly wakeCrossPositions: T[]
    readonly entryGatePosition: T
    readonly exitGatePosition: T

    constructor(
        name: string,
        buoyPositions: T[],
        wakeCrossPositions: T[],
        entryGatePosition: T,
        exitGatePosition: T
    ) {
        this.name = name
        this.buoyPositions = buoyPositions
        this.wakeCrossPositions = wakeCrossPositions
        this.entryGatePosition = entryGatePosition
        this.exitGatePosition = exitGatePosition
    }
}