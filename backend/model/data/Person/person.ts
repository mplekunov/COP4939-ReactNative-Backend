import { Sex } from "../User/user"

export class Person {
    readonly firstName: string
    readonly lastName: string
    readonly dateOfBirth: Date
    readonly sex: Sex

    constructor(firstName: string, lastName: string, dateOfBirth: Date, sex: Sex) {
        this.firstName = firstName
        this.lastName = lastName
        this.dateOfBirth = dateOfBirth
        this.sex = sex
    }
}