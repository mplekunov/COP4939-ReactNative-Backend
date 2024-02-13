export class LoggerService {
    private logSource: string;
  
    constructor(logSource: string) {
      this.logSource = logSource;
    }
  
    private getCurrentDate(): string {
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${
        date.getHours().toString().padStart(2, '0')
      }:${date.getMinutes().toString().padStart(2, '0')}:${date
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;
  
      return formattedDate;
    }
  
    public log(message: string): void {
      console.log(`[LOG MESSAGE] [${this.getCurrentDate()}] [${this.logSource}]: ${message}`);
    }
  
    public error(message: string): void {
      console.error(
        `[ERROR MESSAGE] [${this.getCurrentDate()}] [${this.logSource}] ERROR: ${message}]`
      );
    }
  }