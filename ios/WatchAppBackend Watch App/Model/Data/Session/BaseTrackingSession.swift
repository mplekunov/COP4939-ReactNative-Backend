//
//  Session.swift
//  COP4939-Project Watch App
//
//  Created by Mikhail Plekunov on 11/28/23.
//

import Foundation

struct BaseTrackingSession : Codable {
    let id: UUID
    let trackingRecords: Array<TrackingRecord>
    
    init(uuid: UUID, data: Array<TrackingRecord>) {
        self.id = uuid
        self.trackingRecords = data
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(UUID.self, forKey: .id)
        self.trackingRecords = try container.decode(Array<TrackingRecord>.self, forKey: .trackingRecords)
    }
    
    init() {
        id = UUID()
        trackingRecords = Array()
    }
    
    enum CodingKeys: CodingKey {
        case id
        case trackingRecords
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(self.id, forKey: .id)
        try container.encode(self.trackingRecords, forKey: .trackingRecords)
    }
}
