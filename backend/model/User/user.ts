
import { Person } from "../Person/person"

export class Login {
    username: string
    password: string

    constructor(username: string, password: string) {
        this.username = username
        this.password = password
    }
}

export class User extends Person {
    username: string
    password: string

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