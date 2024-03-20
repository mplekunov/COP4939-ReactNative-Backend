import { Converter } from "../../Database/database"
import { Sex, User } from "../../User/user"
import { WaterSkiingEquipment, WaterSkiingEquipmentConverter } from "../Equipment/waterSkiingEquipment"
import { WaterSkiingAgeGroup } from "./waterSkiingAgeGroup"

export interface Skier extends User {
    equipment: WaterSkiingEquipment
    ageGroup: WaterSkiingAgeGroup
}

export class SkierConverter implements Converter<Skier> {
    convertToSchema(object: Skier) {
        return {
            equipment: WaterSkiingEquipmentConverter.convertToSchema(object.equipment),
            ageGroup: object.ageGroup,
        }
    }
    
    convertFromSchema(schema: any): Skier {
        try {
            return {
                firstName: String(schema.firstName),
                lastName: String(schema.lastName),
                dateOfBirth: new Date(schema.dateOfBirth),
                sex: schema.sex as Sex,
                username: String(schema.username),
                password: String(schema.password),
                equipment: WaterSkiingEquipmentConverter.convertFromSchema(schema.equipment),
                ageGroup: schema.ageGroup as WaterSkiingAgeGroup
            }
        } catch(error : any) {
            throw new Error(`Skier ~ ${error.message}`)
        }
    }
}