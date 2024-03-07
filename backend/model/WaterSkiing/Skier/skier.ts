import { Person } from "../../Person/person"
import { Sex, User } from "../../User/user"
import { WaterSkiingEquipment } from "../Equipment/waterSkiingEquipment"
import { WaterSkiingSession } from "../waterSkiingSession"
import { WaterSkiingAgeGroup } from "./waterSkiingAgeGroup"

export class Skier extends User {
    equipment: WaterSkiingEquipment
    ageGroup: WaterSkiingAgeGroup

    constructor(
        user: User, 
        equipment: WaterSkiingEquipment, 
        ageGroup: WaterSkiingAgeGroup
    ) {
        super(new Person(user.firstName, user.lastName, user.dateOfBirth, user.sex), user.username, user.password)

        this.equipment = equipment
        this.ageGroup = ageGroup
    }

    convertToSchema(): any {
        return {
            equipment: this.equipment.convertToSchema(),
            ageGroup: this.ageGroup,
        }
    }

    static convertFromSchema(schema: any): Skier {
        try {
            return new Skier(
                new User(
                    new Person(
                        String(schema.firstName),
                        String(schema.lastName),
                        new Date(schema.dateOfBirth),
                        schema.sex as Sex
                    ),
                    String(schema.username),
                    String(schema.password),
                ),
                WaterSkiingEquipment.convertFromSchema(schema.equipment),
                schema.ageGroup as WaterSkiingAgeGroup
            )
        } catch(error : any) {
            throw new Error(`Skier ~ ${error.message}`)
        }
    }
}