//
//  DataPacket.swift
//  WatchApp Watch App
//
//  Created by Mikhail Plekunov on 11/26/23.
//

import Foundation

struct DataPacket : Codable {
    let dataType: DataType
    let id: UUID
    let dataAsBase64: String
    
    init(dataType: DataType, id: UUID, dataAsBase64: String) {
        self.dataType = dataType
        self.id = id
        self.dataAsBase64 = dataAsBase64
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.dataType = try container.decode(DataType.self, forKey: .dataType)
        self.id = try container.decode(UUID.self, forKey: .id)
        self.dataAsBase64 = try container.decode(String.self, forKey: .dataAsBase64)
    }
    
    enum CodingKeys: CodingKey {
        case dataType
        case id
        case dataAsBase64
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(self.dataType, forKey: .dataType)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.dataAsBase64, forKey: .dataAsBase64)
    }
}
