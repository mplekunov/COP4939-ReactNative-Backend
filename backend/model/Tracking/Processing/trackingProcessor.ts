import { File } from "../../File/file";
import { TrackingRecord } from "../trackingRecord";

export class TrackingProcessor {
    public async createProcessingJob(file: File): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                let uploadResponse = await this.uploadFile(file)
                return resolve(uploadResponse.id)
            } catch (error) {
                return reject(`Error during file upload or polling: ${error}`)
            }
        })
    }

    private async uploadFile(file: File): Promise<{ id: string }> {
        return { id: "dummy" }
    }

    public async getProcessedRecords(jobId: string, onReceived: (trackingRecords: Array<TrackingRecord>) => void) {
        let pollingInterval = 60 * 1000
    
        let poll = async () => { 
            let statusResponse = await fetch(`/status/${jobId}`)
            let { isFinished } = await statusResponse.json()
    
            if (isFinished) {
                let records = await this.fetchProcessedRecords(jobId)

                onReceived(records)
            } else {
                setTimeout(poll, pollingInterval)
            }
        }
    
        poll()
    }
    
    private async fetchProcessedRecords(jobId: string): Promise<Array<TrackingRecord>> {
        // Get Processed Files
        return []
      }

}