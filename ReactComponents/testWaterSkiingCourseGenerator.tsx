import { Video } from "../Backend/Model/Camera/video";
import { Coordinate } from "../Backend/Model/Units/coordinate";
import { WaterSkiingCourse } from "../Backend/Model/WaterSkiing/Course/waterSkiingCourse";

export function waterSkiingCourseGenerator(video: Video): WaterSkiingCourse<Coordinate> {
    let buoyPositions: number[] = []    
    let wakeCrossPositions: number[] = []
    let entryGatePosition: number = 1
    let exitGatePosition: number = 16000

    let step = (exitGatePosition) / 14

    let j = 0

    for (let i = entryGatePosition + step; i < exitGatePosition - step; i += (2 * step)) {
        if (j === 6) {
            break;
        }

        wakeCrossPositions.push(i)
        buoyPositions.push(i + step)
        j++
    }

    return new WaterSkiingCourse(
        "Test Course",
        buoyPositions,
        wakeCrossPositions,
        entryGatePosition,
        exitGatePosition
    )
}