import { Person } from "../Person/person"

export class User extends Person {
    readonly username: string
    readonly password: string
    
    constructor(person: Person, username: string, password: string) {
        super(person.firstName, person.lastName, person.dateOfBirth, person.sex)

        this.username = username
        this.password = password
    }
}

export enum Sex {
    MALE,
    FEMALE
}