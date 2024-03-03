
import Realm, { ObjectSchema } from "realm"
import { Person } from "../Person/person"

export class Login {
    readonly username: string
    readonly password: string

    constructor(username: string, password: string) {
        this.username = username
        this.password = password
    }
}

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

function defineRealmSchema(): ObjectSchema {
    return {
        name: "User",
        primaryKey: 'username',
        properties: {
            username: { type: 'string', indexed: 'full-text' },
            password: { type: 'string' },
            firstName: { type: 'string', indexed: 'full-text' },
            lastName: { type: 'string', indexed: 'full-text' },
            dateOfBirth: { type: 'date' },
            sex: { type: 'int' }
        }
    }
}

export class UserSchema extends Realm.Object<User> {
    username: string
    password: string
    firstName: string
    lastName: string
    dateOfBirth: Date
    sex: number

    constructor(realm: Realm, user: User) {
        super(realm, user)

        this.username = user.username
        this.password = user.password
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.dateOfBirth = user.dateOfBirth
        this.sex = user.sex
    }

    static schema = defineRealmSchema()
}
