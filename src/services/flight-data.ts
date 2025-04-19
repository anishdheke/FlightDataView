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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response: Response = await fetch(url, {
      mode: 'cors', // Add this to handle potential CORS issues
 	  signal: controller.signal,
    });
 
     if (!response.ok) {
         console.log("File download failed");
         throw new Error(`HTTP error! status: ${response.status}`);
     }
    
    console.log("File downloaded successfully");
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    clearTimeout(timeoutId);

    const flightData: FlightData[] = data.map((row: any) => ({
      scheduledArrivalTime: row['Sch Arrival Time'] || '',
      status: row['Act. Arrival'] || '',
      flightNumber: row['Flight'],
      destination: row['To'] || '',
      gate: row['Gate'] || '',
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
