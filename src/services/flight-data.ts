import * as XLSX from 'xlsx';

/**
 * Represents flight data.
 */
export interface FlightData {
  /**
   * The scheduled arrival time.
   */
  scheduledArrivalTime: string;
  /**
   * The status of flight.
   */
  status: string;
  /**
   * The flight number.
   */
  flightNumber: string;
  /**
   * The destination.
   */
  destination: string;
   /**
   * The gate.
   */
  gate: string;
}

/**
 * Asynchronously retrieves flight data from a given URL.
 *
 * @param url The URL to fetch flight data from.
 * @returns A promise that resolves to an array of FlightData objects.
 */
export async function getFlightData(url: string): Promise<FlightData[]> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch. Status code: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer) {
        throw new Error("Failed to read response body");
    }

    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Assuming the first sheet is the one with flight data
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData: any[] = XLSX.utils.sheet_to_json(sheet, {header: 1});

    // Check if rawData has at least one row (header row)
    if (!rawData || rawData.length === 0) {
        throw new Error("No data found in the Excel sheet.");
    }

    // Extract the header row and data rows, handling potential undefined values
    const headerRow = rawData[0] as string[]; // Header row
    const dataRows = rawData.slice(1) as string[][];   // Data rows

      // Find the indices of the required columns
      const schArrivalTimeIndex = headerRow.findIndex(header => header?.trim() === 'Sch Arrival Time');
      const actArrivalIndex = headerRow.findIndex(header => header?.trim() === 'Act. Arrival');
      const flightIndex = headerRow.findIndex(header => header?.trim() === 'Flight');
      const destinationIndex = headerRow.findIndex(header => header?.trim() === 'Destination');
      const gateIndex = headerRow.findIndex(header => header?.trim() === 'Gate');

      // Check if all required columns are found
      if (schArrivalTimeIndex === -1 || actArrivalIndex === -1 || flightIndex === -1 || destinationIndex === -1 || gateIndex === -1) {
          throw new Error("One or more required columns not found in the Excel sheet.");
      }

      // Transform the raw data into the FlightData format
      const flightData: FlightData[] = dataRows.map(row => {
          return {
              scheduledArrivalTime: row[schArrivalTimeIndex] || '',
              status: row[actArrivalIndex] || '',
              flightNumber: row[flightIndex] || '',
              destination: row[destinationIndex] || '',
              gate: row[gateIndex] || '',
          };
      });

    return flightData;
  } catch (error: any) {
      let message = 'Failed to fetch';
      if (error instanceof Error) {
          message = error.message;
      }
    console.error("Error fetching or parsing flight data:", message);
    throw new Error(message); // Re-throw the error to be caught by the component
  }
}
