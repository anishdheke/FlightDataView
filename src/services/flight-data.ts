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
 * Fetches and parses flight data from an XLSX file with retry mechanism.
 * @param url The URL of the XLSX file.
 * @param retries Number of retries.
 * @returns A promise that resolves to an array of FlightData objects.
 */
export async function getFlightData(url: string, retries: number = 0): Promise<FlightData[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let response: Response;
    try {
      console.log(`Attempting to download file... (Attempt ${retries + 1})`);
      response = await fetch(url, {
        mode: 'cors',
        signal: controller.signal,
      });
      console.log('File downloaded successfully');
    } catch (fetchError: any) {
      console.error(`Error during fetch (Attempt ${retries + 1}):`, fetchError.message, "URL:", url);
      if (retries < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, retries);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return getFlightData(url, retries + 1);
      }
      throw new Error(`Failed to fetch after ${MAX_RETRIES} attempts: ${fetchError.message}`);
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      console.log('File download failed');
      throw new Error(`Failed to fetch. Status code: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    console.log('Attempting to parse file...');
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = jsonData[0] as string[];

    const standardizeKey = (key: string) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('Flight #')) return 'Flight #';
      if (lowerKey.includes('City')) return 'City';
      if (lowerKey.includes('Sched Time')) return 'Sched Time';
      if (lowerKey.includes('Status')) return 'Status';
      if (lowerKey.includes('Gate')) return 'Gate';
      return lowerKey;
    };

    const standardizedHeaders = headers.map(header => standardizeKey(header));

    const flightData: FlightData[] = [];
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i] as string[];
      if (!row) continue;

      const flight: FlightData = {
        flightNumber: row[standardizedHeaders.indexOf('Flight #')] || '',
        destination: row[standardizedHeaders.indexOf('City')] || '',
        scheduledArrivalTime: row[standardizedHeaders.indexOf('Sched Time')] || '',
        status: row[standardizedHeaders.indexOf('Status')] || '',
        gate: row[standardizedHeaders.indexOf('Gate')] || '',
      };
      flightData.push(flight);
    }

    return flightData;
  } catch (error: any) {
    let message = 'An unknown error occurred';
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("Error fetching or parsing flight data:", message);
    throw new Error(message); // Re-throw the error to be caught by the component
  }
}
