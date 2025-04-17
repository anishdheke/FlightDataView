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
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Assuming the first sheet is the one with flight data
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData: any[] = XLSX.utils.sheet_to_json(sheet);

    // Transform the raw data into the FlightData format
    const flightData: FlightData[] = rawData.map(item => ({
      scheduledArrivalTime: item['Sch Arrival Time'] || '',
      status: item['Act. Arrival'] || '',
      flightNumber: item['Flight'] || '',
      destination: item['Destination'] || '',
      gate: item['Gate'] || '',
    }));

    return flightData;
  } catch (error) {
    console.error("Error fetching or parsing flight data:", error);
    return []; // Return an empty array in case of error
  }
}
