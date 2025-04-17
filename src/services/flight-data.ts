import * as XLSX from 'xlsx';
 
 /**
  * Represents flight data.
  */
 export interface FlightData {
-  /**
-   * The scheduled arrival time.
-   */
   scheduledArrivalTime: string;
-  /**
-   * The status of flight.
-   */
   status: string;
-  /**
-   * The flight number.
-   */
   flightNumber: string;
-  /**
-   * The destination.
-   */
   destination: string;
-   /**
-   * The gate.
-   */
   gate: string;
 }
 
@@ -37,9 +37,9 @@
 export async function getFlightData(url: string): Promise<FlightData[]> {
   try {
     const controller = new AbortController();
-    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds
+    const timeoutId = setTimeout(() => controller.abort(), 5000);
 
-    const response = await fetch(url, {
+    const response: Response = await fetch(url, {
       mode: 'cors', // Add this to handle potential CORS issues
 	  signal: controller.signal,
     });

    