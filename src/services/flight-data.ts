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
      console.log('File download failed');
      throw new Error(`Failed to fetch. Status code: ${response.status}`);
    }
    console.log('File downloaded successfully');

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Use XLSX.utils.sheet_to_json to convert the sheet to JSON
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

 	// Assuming the first row is the header
 	const headers = jsonData[0] as string[];

 	// Function to standardize keys
 	const standardizeKey = (key: string) => {
 		const lowerKey = key.toLowerCase();
 		if (lowerKey.includes('flight number')) return 'flightNumber';
 		if (lowerKey.includes('destination')) return 'destination';
 		if (lowerKey.includes('scheduled arrival time')) return 'scheduledArrivalTime';
 		if (lowerKey.includes('actual arrival')) return 'status'; // or 'actualArrivalTime' if you have that
 		if (lowerKey.includes('gate')) return 'gate';
 		return lowerKey; // fallback to the key as is
 	};
 
 	const standardizedHeaders = headers.map(header => standardizeKey(header));
 
 	// Convert the remaining rows to FlightData objects
 	const flightData: FlightData[] = [];
 	for (let i = 1; i < jsonData.length; i++) {
 		const row = jsonData[i] as string[];
 		if (!row) continue;
 
 		const flight: FlightData = {
 			flightNumber: row[standardizedHeaders.indexOf('flightNumber')] || '',
 			destination: row[standardizedHeaders.indexOf('destination')] || '',
 			scheduledArrivalTime: row[standardizedHeaders.indexOf('scheduledArrivalTime')] || '',
 			status: row[standardizedHeaders.indexOf('status')] || '',
 			gate: row[standardizedHeaders.indexOf('gate')] || '',
 		};
 		flightData.push(flight);
 	}

    clearTimeout(timeoutId);
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

