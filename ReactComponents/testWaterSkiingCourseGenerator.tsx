import { Video } from "../backend/model/camera/video";
import { WaterSkiingCourse } from "../backend/model/data/waterSkiing/Course/waterSkiingCourse";

export function waterSkiingCourseGenerator(video: Video<string>): WaterSkiingCourse<number> {
    let buoyPositions: number[] = []    
    let wakeCrossPositions: number[] = []
    let entryGatePosition: number = 1
    let exitGatePosition: number = 16 

    let step = (exitGatePosition + entryGatePosition) / 14

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