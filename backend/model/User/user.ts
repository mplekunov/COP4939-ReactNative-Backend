
import { Converter } from "../Database/database"
import { Person } from "../Person/person"

export interface Login {
    username: string
    password: string
}

export interface User extends Person {
    username: string
    password: string
}

export enum Sex {
    MALE,
    FEMALE
}

export class UserConverter implements Converter<User> {
    convertToSchema(object: Partial<User>) {
        return {
            username: object.username,
            password: object.password,
            firstName: object.firstName,
            lastName: object.lastName,
            dateOfBirth: object.dateOfBirth,
            sex: object.sex
        }
    }
    
    convertFromSchema(schema: any): User {
        try {
            return {
                username: schema.username,
                password: schema.password,
                firstName: schema.firstName,
                lastName: schema.lastName,
                dateOfBirth: new Date(schema.dateOfBirth),
                sex:schema.sex as Sex
            }
        } catch(error : any) {
            throw new Error(`Skier ~ ${error.message}`)
        }
    }
}