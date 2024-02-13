//
//  StatisticsView.swift
//  WatchApp Watch App
//
//  Created by Mikhail Plekunov on 11/26/23.
//

import SwiftUI
import Combine

struct StatisticsView: View {
    @State private var startTime: Date?
    @State private var elapsedTime: TimeInterval = 0
    
    private var formattedElapsedTime: String {
        guard let _ = startTime else { return "00:00:00" }
        
        let elapsedTimeInSeconds = Int(elapsedTime)
        let seconds = elapsedTimeInSeconds % 60
        let minutes = (elapsedTimeInSeconds / 60) % 60
        let hours = elapsedTimeInSeconds / (60 * 60)
        return String(format: "%02d:%02d:%02d", hours, minutes, seconds)
    }
    
    @EnvironmentObject var dataCollectorViewModel: DataCollectorViewModel
    
    var body: some View {
        List {
            Section() {
                VStack {
                    Text("\(formattedElapsedTime)")
                        .font(.title)
                }
            }
            
            Section("Amount of collected data") {
                VStack(alignment: .leading, spacing: 10) {
                    Text("Count: \(dataCollectorViewModel.trackingRecords.count)")
                }
            }
            
            Section("Speed") {
                VStack(alignment: .leading, spacing: 10) {
                    Text("Speed: \(dataCollectorViewModel.motionRecord?.speed.formatted() ?? "N/A")")
                }
            }
            
            Section("Attitude") {
                VStack(alignment: .leading, spacing: 10) {
                    Text("Pitch: \(dataCollectorViewModel.motionRecord?.attitude.pitch.formatted() ?? "N/A")")
                    Text("Yaw: \(dataCollectorViewModel.motionRecord?.attitude.yaw.formatted() ?? "N/A")")
                    Text("Roll: \(dataCollectorViewModel.motionRecord?.attitude.roll.formatted() ?? "N/A")")
                }
            }
            
            Section("G Force") {
                VStack(alignment: .leading, spacing: 10) {
                    Text("X: \(dataCollectorViewModel.motionRecord?.gForce.x.formatted() ?? "N/A")")
                    Text("Y: \(dataCollectorViewModel.motionRecord?.gForce.y.formatted() ?? "N/A")")
                    Text("Z: \(dataCollectorViewModel.motionRecord?.gForce.z.formatted() ?? "N/A")")
                }
            }
            
            Section("Acceleration") {
                VStack(alignment: .leading, spacing: 10) {
                    Text("X: \(dataCollectorViewModel.motionRecord?.acceleration.x.formatted() ?? "N/A")")
                    Text("Y: \(dataCollectorViewModel.motionRecord?.acceleration.y.formatted() ?? "N/A")")
                    Text("Z: \(dataCollectorViewModel.motionRecord?.acceleration.z.formatted() ?? "N/A")")
                }
            }
        }
        .padding()
        .background(.black)
        .foregroundColor(.orange)
        .scrollContentBackground(.hidden)
        .onReceive(dataCollectorViewModel.$isRecording) { isTriggered in
            if isTriggered {
                startTime = Date()
            } else {
                startTime = nil
            }
        }
        .onAppear {
            Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
                if let startTime = startTime {
                    elapsedTime = Date().timeIntervalSince(startTime)
                }
            }
        }
    }
}
