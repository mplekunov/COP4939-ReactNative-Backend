import { Sex } from "../User/user"

export class Person {
    firstName: string
    lastName: string
    dateOfBirth: Date
    sex: Sex

    constructor(firstName: string, lastName: string, dateOfBirth: Date, sex: Sex) {
        this.firstName = firstName
        this.lastName = lastName
        this.dateOfBirth = dateOfBirth
        this.sex = sex
    }
}