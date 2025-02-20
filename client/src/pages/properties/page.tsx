import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PropertyGrid } from "@/components/properties/property-grid";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Property {
  Producto: string;
  "Ubicación (referencia)": string;
  "PRECIO TOTAL": number;
  Metros2: number;
  "N° de recámaras": number;
  "N° de Baños": number;
  ESTATUS: string;
  "Dirección Completa": string;
}

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bedroomFilter, setBedroomFilter] = useState<string>("all");

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await fetch("https://script.google.com/macros/s/AKfycbw6ddInhypxKpoUXJZs_BQEDRoy8lIDCuT36-5JtlQ-yjnY--VxiFHUJClA9ay-JzsyOA/exec");
      const data = await response.json();
      return data;
    },
  });

  const filteredProperties = properties?.filter((property) => {
    const matchesSearch = 
      (property.Producto + " " + property["Ubicación (referencia)"])
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      property["Dirección Completa"]
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" || 
      property.ESTATUS.toLowerCase() === statusFilter.toLowerCase();

    const matchesBedrooms = 
      bedroomFilter === "all" || 
      property["N° de recámaras"].toString() === bedroomFilter;

    return matchesSearch && matchesStatus && matchesBedrooms;
  });

  const sortedProperties = filteredProperties?.sort((a, b) => {
    if (priceSort === "asc") {
      return a["PRECIO TOTAL"] - b["PRECIO TOTAL"];
    }
    if (priceSort === "desc") {
      return b["PRECIO TOTAL"] - a["PRECIO TOTAL"];
    }
    return 0;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <PropertyGrid
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      priceSort={priceSort}
      setPriceSort={setPriceSort}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      bedroomFilter={bedroomFilter}
      setBedroomFilter={setBedroomFilter}
      properties={properties}
      isLoading={isLoading}
      filteredProperties={filteredProperties}
      sortedProperties={sortedProperties}
      formatPrice={formatPrice}
    />
  );
}
