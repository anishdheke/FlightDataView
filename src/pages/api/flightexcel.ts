import type { NextApiRequest, NextApiResponse } from 'next';
import * as XLSX from 'xlsx';

const FLIGHT_DATA_SOURCE_URL = "https://apps.dfwairport.com/flightexcel";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch(FLIGHT_DATA_SOURCE_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        res.status(200).json(data);
    } catch (error: any) {
        console.error("Error proxying request:", error);
        res.status(500).json({ error: 'Failed to fetch and process data' });
    }
}
