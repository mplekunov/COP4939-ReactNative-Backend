//
//  CollectedData.swift
//  WatchApp Watch App
//
//  Created by Mikhail Plekunov on 11/19/23.
//

import Foundation

struct TrackingRecord : Codable, Equatable {
    let location: LocationRecord
    let motion: MotionRecord
    let timeOfRecrodingInMilliseconds: Int64
    
    init(location: LocationRecord, motion: MotionRecord, timeOfRecrodingInMilliseconds: Int64) {
        self.location = location
        self.motion = motion
        self.timeOfRecrodingInMilliseconds = timeOfRecrodingInMilliseconds
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.location = try container.decode(LocationRecord.self, forKey: .location)
        self.motion = try container.decode(MotionRecord.self, forKey: .motion)
        self.timeOfRecrodingInMilliseconds = try container.decode(Int64.self, forKey: .timeOfRecrodingInMilliseconds)
    }
    
    enum CodingKeys: CodingKey {
        case location
        case motion
        case timeOfRecrodingInMilliseconds
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(self.location, forKey: .location)
        try container.encode(self.motion, forKey: .motion)
        try container.encode(self.timeOfRecrodingInMilliseconds, forKey: .timeOfRecrodingInMilliseconds)
    }
 
    static func == (lhs: Self, rhs: Self) -> Bool {
        return lhs.location == rhs.location &&
        lhs.motion == rhs.motion
    }
}
