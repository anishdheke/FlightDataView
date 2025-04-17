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
  // TODO: Implement this by calling an API and parsing the XLSX file.
  // Simulating fetching and parsing data:
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  return [
    {
      scheduledArrivalTime: "10:00",
      status: "On Time",
      flightNumber: "AA123",
      destination: "LAX",
      gate: "A1",
    },
    {
      scheduledArrivalTime: "11:00",
      status: "Delayed",
      flightNumber: "UA456",
      destination: "JFK",
      gate: "B2",
    },
    {
      scheduledArrivalTime: "12:00",
      status: "Cancelled",
      flightNumber: "DL789",
      destination: "ORD",
      gate: "C3",
    },
    {
      scheduledArrivalTime: "13:00",
      status: "On Time",
      flightNumber: "SW101",
      destination: "DAL",
      gate: "A2",
    },
    {
      scheduledArrivalTime: "14:00",
      status: "On Time",
      flightNumber: "AS222",
      destination: "SEA",
      gate: "B3",
    },
    {
      scheduledArrivalTime: "15:00",
      status: "Delayed",
      flightNumber: "B6333",
      destination: "BOS",
      gate: "C4",
    },
    {
      scheduledArrivalTime: "16:00",
      status: "On Time",
      flightNumber: "AA444",
      destination: "MIA",
      gate: "A3",
    },
    {
      scheduledArrivalTime: "17:00",
      status: "On Time",
      flightNumber: "UA555",
      destination: "SFO",
      gate: "B4",
    },
    {
      scheduledArrivalTime: "18:00",
      status: "Delayed",
      flightNumber: "DL666",
      destination: "ATL",
      gate: "C5",
    },
    {
      scheduledArrivalTime: "19:00",
      status: "On Time",
      flightNumber: "SW777",
      destination: "HOU",
      gate: "A4",
    },
    {
      scheduledArrivalTime: "20:00",
      status: "On Time",
      flightNumber: "AS888",
      destination: "PDX",
      gate: "B5",
    },
    {
      scheduledArrivalTime: "21:00",
      status: "Delayed",
      flightNumber: "B6999",
      destination: "JAX",
      gate: "C6",
    },
  ];
}
