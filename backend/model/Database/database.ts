import Realm, { ObjectSchema } from "realm"

export class Database {
    private async init(schema: ObjectSchema): Promise<Realm> {
        return await Realm.open({
            schema: [schema]
        })
    }

    async create(schema: ObjectSchema) {
        let realm = await this.init(schema)

        realm.write(() => {
            realm.create(schema.name, schema)
        })
    }
}