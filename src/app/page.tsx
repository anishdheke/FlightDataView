"use client";

import { useEffect, useState, useCallback } from "react";
import { getFlightData } from "@/services/flight-data";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@/components/ui/scroll-area";

const FLIGHT_DATA_URL = "https://apps.dfwairport.com/flightexcel";

export default function Home() {
  const [flightData, setFlightData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    gate: "",
  });
  const [sortBy, setSortBy] = useState("flightNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const data = await getFlightData(FLIGHT_DATA_URL);
      setFlightData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching flight data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch flight data.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const gates = filterCriteria.gate
      .toLowerCase()
      .split(",")
      .map((gate) => gate.trim());

    let results = flightData.filter((item) => {
      if (gates.length === 0 || (gates.length === 1 && gates[0] === "")) {
        return true; // Show all if no filter is applied
      }
      return gates.some((gate) => item.gate.toLowerCase().includes(gate));
    });

    // Sorting logic
    results = [...results].sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      if (a[sortBy] < b[sortBy]) return -1 * order;
      if (a[sortBy] > b[sortBy]) return 1 * order;
      return 0;
    });

    setFilteredData(results);
  }, [flightData, filterCriteria, sortBy, sortOrder]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy === field) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <Card className="bg-secondary sticky top-0 z-10">
        <CardHeader>
          <CardTitle className="text-primary">Flight Data Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1">
            <Input
              type="text"
              name="gate"
              placeholder="d1,d2,d3,d4"
              value={filterCriteria.gate}
              onChange={handleFilterChange}
            />
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="overflow-x-auto mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSortChange("flightNumber")} className="cursor-pointer text-primary">
                Flight Number {getSortIcon("flightNumber")}
              </TableHead>
              <TableHead onClick={() => handleSortChange("destination")} className="cursor-pointer text-primary">
                Destination {getSortIcon("destination")}
              </TableHead>
              <TableHead onClick={() => handleSortChange("scheduledArrivalTime")} className="cursor-pointer text-primary">
                Flight Time {getSortIcon("scheduledArrivalTime")}
              </TableHead>
               <TableHead onClick={() => handleSortChange("status")} className="cursor-pointer text-primary">
                Status {getSortIcon("status")}
              </TableHead>
               <TableHead onClick={() => handleSortChange("gate")} className="cursor-pointer text-primary">
                Gate {getSortIcon("gate")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.flightNumber}</TableCell>
                <TableCell>{item.destination}</TableCell>
                <TableCell>{item.scheduledArrivalTime}</TableCell>
                 <TableCell>{item.status}</TableCell>
                <TableCell>{item.gate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
