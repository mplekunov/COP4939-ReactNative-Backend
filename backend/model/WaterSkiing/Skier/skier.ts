import { Person } from "../../Person/person"
import { Sex, User } from "../../User/user"
import { WaterSkiingEquipment } from "../Equipment/waterSkiingEquipment"
import { WaterSkiingAgeGroup } from "./waterSkiingAgeGroup"

export class Skier extends User {
    equipment: WaterSkiingEquipment
    ageGroup: WaterSkiingAgeGroup

    constructor(user: User, equipment: WaterSkiingEquipment, ageGroup: WaterSkiingAgeGroup) {
        super(new Person(user.firstName, user.lastName, user.dateOfBirth, user.sex), user.username, user.password)

        this.equipment = equipment
        this.ageGroup = ageGroup
    }
}