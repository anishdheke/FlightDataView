import * as XLSX from 'xlsx';
import axios from 'axios';


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
 * @returns A promise that resolves to an array of FlightData objects in json format
 *
 */
export async function getFlightData(url: string): Promise<FlightData[]> {
  try {
    console.log('Attempting to download file from:', url);

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    if (response.status !== 200) {
      console.error("File download failed with status:", response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("File downloaded successfully");
    const arrayBuffer = response.data as ArrayBuffer;
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];    
    
    console.log(XLSX.utils.sheet_to_txt(worksheet));
      const data = XLSX.utils.sheet_to_json(worksheet);
    
    const jsonFlightData = JSON.stringify(data);

    return  JSON.parse(jsonFlightData) as FlightData[];
  } catch (error: any) {
    let message = "Failed to fetch";
    if (axios.isAxiosError(error)) {
      message = error.message;
      console.error("Error during axios fetch:", error.message, "URL:", url);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);
      }
    } else if (error instanceof Error) {
      message = error.message;
    }
    console.error("Error fetching or parsing flight data:", message);
    throw new Error(message); // Re-throw the error to be caught by the component
  }
}

