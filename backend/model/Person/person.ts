import { Sex } from "../User/user"

export interface Person {
    firstName: string
    lastName: string
    dateOfBirth: Date
    sex: Sex
}