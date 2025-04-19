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
 

    let response: Response;
    try {
      console.log('Attempting to download file...');
      response = await fetch(url, {
        mode: 'cors', // Add this to handle potential CORS issues
 	  signal: controller.signal,
      });
      console.log('File downloaded successfully');
    } catch (fetchError:any) {
      console.error("Error during fetch:", fetchError.message, "URL:", url);
      throw new Error(`Failed to fetch: ${fetchError.message}`);
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
 

    // Use XLSX.utils.sheet_to_json to convert the sheet to JSON
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
 

 	// Assuming the first row is the header
 	const headers = jsonData[0] as string[];
 

 	// Function to standardize keys
 	const standardizeKey = (key: string) => {
 		const lowerKey = key.toLowerCase();
 		if (lowerKey.includes('Flight #')) return 'Flight #';
 		if (lowerKey.includes('City')) return 'City';
 		if (lowerKey.includes('Sched Time')) return 'Sched Time';
 		if (lowerKey.includes('Status')) return 'Status'; // or 'actualArrivalTime' if you have that
 		if (lowerKey.includes('Gate')) return 'Gate';
 		return lowerKey; // fallback to the key as is
 	};
  
 	const standardizedHeaders = headers.map(header => standardizeKey(header));
  
 	// Convert the remaining rows to FlightData objects
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
 

