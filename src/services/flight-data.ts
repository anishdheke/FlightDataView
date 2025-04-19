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

    let response: Response;
    try {
      console.log(`Attempting to download file...`);
      response = await fetch(url, {
        mode: 'cors', // Add this to handle potential CORS issues
 		signal: controller.signal,
 		headers: {
           'Access-Control-Allow-Origin': '*'
         }
      });
      console.log('File downloaded successfully');
    } catch (fetchError:any) {
      console.error("Error during fetch:", fetchError.message, "URL:", url);
 	  throw new Error(`Failed to fetch: ${fetchError.message}`);
    } finally {
 	  clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch. Status code: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = jsonData[0] as string[];
    const flightData: FlightData[] = [];

    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i] as string[];
      if (!row) continue;

      const flight: FlightData = {
        scheduledArrivalTime: row[2] || '',
        status: row[3] || '',
        flightNumber: row[0] || '',
        destination: row[1] || '',
        gate: row[4] || '',
      };
      flightData.push(flight);
    }

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
