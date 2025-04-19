import * as XLSX from 'xlsx';

/**
 * Represents flight data.
 */
export interface FlightData {
  scheduledArrivalTime: string;
  status: string;
  flightNumber: string;
  destination: string;
  gate: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // milliseconds

/**
 * Fetches and parses flight data from an XLSX file.
 * @param url The URL of the XLSX file.
 * @returns A promise that resolves to an array of FlightData objects.
 */
export async function getFlightData(url: string): Promise<FlightData[]> {
  try {
        const response = await fetch(url);

        if (!response.ok) {
            console.log("File download failed");
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("File downloaded successfully");
        const data = await response.json();
    
        const flightData: FlightData[] = data.map((row: any) => ({
            scheduledArrivalTime: row[2] || '',
            status: row[3] || '',
            flightNumber: row[0] || '',
            destination: row[1] || '',
            gate: row[4] || '',
        }));
    
        return flightData;
    } catch (error:any) {
      let message = "Failed to fetch";
          if (error instanceof Error) {
              message = error.message;
          }
        console.error("Error fetching or parsing flight data:", message);
      throw new Error(message); // Re-throw the error to be caught by the component
    }
}
