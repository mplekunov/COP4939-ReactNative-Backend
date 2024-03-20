export enum ServerCode {
    OK = 200,
    CREATED = 201,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404
}

export interface ServerResponse<DataType, ErrorType> {
    status: ServerCode
    data?: DataType
    error?: ErrorType
}