export enum Extension {
    MP4 = "mp4",
    MOV = "mov",
    OTHER = "octet-stream"
}

export enum ContentType {
    VIDEO = "video",
    IMAGE = "image",
    TEXT = "text",
    OTHER = "application"
}

export interface File {
    type: ContentType
    extension: Extension
    name: string
    location: string
}