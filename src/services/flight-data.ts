/**
 * Represents flight data.
 */
export interface FlightData {
  /**
   * The scheduled arrival time.
   */
  scheduledArrivalTime: string;
  /**
   * The actual arrival time.
   */
  actualArrivalTime: string;
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
  // TODO: Implement this by calling an API and parsing the XLSX file.
  // Simulating fetching and parsing data:
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  return [
    {
      scheduledArrivalTime: "10:00",
      actualArrivalTime: "10:15",
      flightNumber: "AA123",
      destination: "LAX",
      gate: "A1",
    },
    {
      scheduledArrivalTime: "11:00",
      actualArrivalTime: "11:05",
      flightNumber: "UA456",
      destination: "JFK",
      gate: "B2",
    },
    {
      scheduledArrivalTime: "12:00",
      actualArrivalTime: "12:20",
      flightNumber: "DL789",
      destination: "ORD",
      gate: "C3",
    },
    {
      scheduledArrivalTime: "13:00",
      actualArrivalTime: "13:10",
      flightNumber: "SW101",
      destination: "DAL",
      gate: "A2",
    },
    {
      scheduledArrivalTime: "14:00",
      actualArrivalTime: "14:00",
      flightNumber: "AS222",
      destination: "SEA",
      gate: "B3",
    },
    {
      scheduledArrivalTime: "15:00",
      actualArrivalTime: "15:30",
      flightNumber: "B6333",
      destination: "BOS",
      gate: "C4",
    },
    {
      scheduledArrivalTime: "16:00",
      actualArrivalTime: "16:05",
      flightNumber: "AA444",
      destination: "MIA",
      gate: "A3",
    },
    {
      scheduledArrivalTime: "17:00",
      actualArrivalTime: "17:15",
      flightNumber: "UA555",
      destination: "SFO",
      gate: "B4",
    },
    {
      scheduledArrivalTime: "18:00",
      actualArrivalTime: "18:20",
      flightNumber: "DL666",
      destination: "ATL",
      gate: "C5",
    },
    {
      scheduledArrivalTime: "19:00",
      actualArrivalTime: "19:10",
      flightNumber: "SW777",
      destination: "HOU",
      gate: "A4",
    },
    {
      scheduledArrivalTime: "20:00",
      actualArrivalTime: "20:00",
      flightNumber: "AS888",
      destination: "PDX",
      gate: "B5",
    },
    {
      scheduledArrivalTime: "21:00",
      actualArrivalTime: "21:30",
      flightNumber: "B6999",
      destination: "JAX",
      gate: "C6",
    },
  ];
}
