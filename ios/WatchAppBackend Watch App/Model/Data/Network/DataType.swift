//
//  DataType.swift
//  WatchApp Watch App
//
//  Created by Mikhail Plekunov on 11/26/23.
//

import Foundation

enum DataType : Int, Encodable, Decodable {
    case WatchSessionStart = 0
    case WatchSessionEnd = 1
    case WatchSession = 2
    case DataDeliveryInformation = 3
    case WatchConnectivityError = 4
}
