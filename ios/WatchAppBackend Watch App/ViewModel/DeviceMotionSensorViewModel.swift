//
//  DeviceMotionModel.swift
//  WatchApp Watch App
//
//  Created by Mikhail Plekunov on 11/12/23.
//

import Foundation
import CoreMotion

class DeviceMotionSensorViewModel : ObservableObject {
    private let motionManager: CMMotionManager = CMMotionManager()
    private let operationQueue: OperationQueue = OperationQueue()
    
    private let locationManager = LocationManager.instance
    private let updateFrequency: Double
    private let logger: LoggerService
    
    @Published public private(set) var motion: MotionRecord?
    @Published public private(set) var error: String?
    @Published public private(set) var isRecording: Bool?
    
    init(updateFrequency: Double) {
        logger = LoggerService(logSource: String(describing: type(of: self)))
        
        self.updateFrequency = updateFrequency
        
        motionManager.deviceMotionUpdateInterval = updateFrequency
        
        operationQueue.maxConcurrentOperationCount = 1
        operationQueue.qualityOfService = .userInteractive
        
        checkRequirements()
      
      
        locationManager.$error
          .receive(on: DispatchQueue.main)
          .compactMap { error in
              guard let error = error else { return nil }
              
              return error.description
          }
          .assign(to: &$error)
      
        locationManager.$isRecording
            .receive(on: DispatchQueue.main)
            .assign(to: &$isRecording)
    }
    
    private func set(error: MotionManagerError?) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.error = error?.description
        }
    }
    
    private func checkRequirements() {
        if motionManager.isDeviceMotionAvailable {
            set(error: .DeviceMotionNotAvailable)
        }
    }
    
    func startRecording() {
        locationManager.startLocationRecording()
        
        motionManager.startDeviceMotionUpdates(to: operationQueue) { [weak self] motionData, error in
            guard let self = self else { return }
            
            if let motionData = motionData,
               let location = locationManager.location {
              
                let attitude = motionData.attitude
                let acceleration = motionData.userAcceleration
                let gForce = motionData.gravity
                
                // Update UI on main thread
                DispatchQueue.main.async { [weak self] in
                    guard let self = self else { return }
                    
                     motion = MotionRecord(
                        attitude: Attitude(
                            roll: Measurement(value: attitude.roll, unit: .radians),
                            yaw: Measurement(value: attitude.yaw, unit: .radians),
                            pitch: Measurement(value: attitude.pitch, unit: .radians)
                        ),
                        speed: Measurement(value: location.speed, unit: .metersPerSecond),
                        acceleration: Unit3D(
                            x: Measurement(value: acceleration.x, unit: .gravity),
                            y: Measurement(value: acceleration.y, unit: .gravity),
                            z: Measurement(value: acceleration.z, unit: .gravity)
                        ),
                        gForce: Unit3D(
                            x: Measurement(value: gForce.x, unit: .gravity),
                            y: Measurement(value: gForce.y, unit: .gravity),
                            z: Measurement(value: gForce.z, unit: .gravity)
                        ))
                }
            }
            
            if let error = error {
                logger.error(message: "\(error)")
            }
        }
        
        isRecording = locationManager.isRecording
    }
    
    func stopRecording() {
        locationManager.stopLocationRecording()
        operationQueue.cancelAllOperations()
        motionManager.stopDeviceMotionUpdates()
        
        isRecording = locationManager.isRecording
    }
}
