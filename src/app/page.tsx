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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const FLIGHT_DATA_URL = "https://apps.dfwairport.com/flightexcel";

export default function Home() {
  const [flightData, setFlightData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    gate: "",
  });
  const [sortBy, setSortBy] = useState("flightNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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
    let results = flightData.filter((item) => {
      return (
        item.gate.toLowerCase().includes(filterCriteria.gate.toLowerCase())
      );
    });

    // Sorting logic
    results = [...results].sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      if (a[sortBy] < b[sortBy]) return -1 * order;
      if (a[sortBy] > b[sortBy]) return 1 * order;
      return 0;
    });

    setFilteredData(results);
    setCurrentPage(1); // Reset to first page after filtering
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

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSortIcon = (field) => {
    if (sortBy === field) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle className="text-primary">Flight Data Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Input
              type="text"
              name="gate"
              placeholder="Filter by Gate"
              value={filterCriteria.gate}
              onChange={handleFilterChange}
            />
             <Select onValueChange={(value) => setItemsPerPage(parseInt(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Items per page" defaultValue={String(itemsPerPage)} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((items) => (
                  <SelectItem key={items} value={String(items)}>{items}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-x-auto mt-4">
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
                Scheduled Arrival {getSortIcon("scheduledArrivalTime")}
              </TableHead>
               <TableHead onClick={() => handleSortChange("actualArrivalTime")} className="cursor-pointer text-primary">
                Actual Arrival {getSortIcon("actualArrivalTime")}
              </TableHead>
               <TableHead onClick={() => handleSortChange("gate")} className="cursor-pointer text-primary">
                Gate {getSortIcon("gate")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.flightNumber}</TableCell>
                <TableCell>{item.destination}</TableCell>
                <TableCell>{item.scheduledArrivalTime}</TableCell>
                 <TableCell>{item.actualArrivalTime}</TableCell>
                <TableCell>{item.gate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          className="mr-2 bg-accent text-primary-foreground"
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
          className="bg-accent text-primary-foreground"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
