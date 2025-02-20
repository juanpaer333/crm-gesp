import { useState, useEffect, useMemo } from "react";
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
import { Search, ArrowUpDown, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Property {
  Producto: string;
  "Ubicación (referencia)": string;
  Referencia: string;
  "PRECIO TOTAL": number;
  Metros2: number;
  "N° de recámaras": number;
  "N° de Baños": number;
  ESTATUS: string;
  "Dirección Completa": string;
  "Renta/Venta": string;
  "Ficha Tecnica"?: string;  // URL to the technical sheet
}

export function PropertyGrid() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);
  const [productoFilter, setProductoFilter] = useState<string>("all");
  const [tipoFilter, setTipoFilter] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [updating, setUpdating] = useState(false);

  const sampleProperties: Property[] = [
    {
      "Producto": "Casa Moderna",
      "Ubicación (referencia)": "Zona Norte",
      "Referencia": "Casa Moderna en Zona Norte",
      "PRECIO TOTAL": 2500000,
      "Metros2": 180,
      "N° de recámaras": 3,
      "N° de Baños": 2.5,
      "ESTATUS": "Disponible",
      "Dirección Completa": "Calle Principal #123, Colonia Centro",
      "Renta/Venta": "Venta"
    },
    {
      "Producto": "Departamento Lujo",
      "Ubicación (referencia)": "Centro",
      "Referencia": "Departamento Lujo en Centro",
      "PRECIO TOTAL": 1800000,
      "Metros2": 120,
      "N° de recámaras": 2,
      "N° de Baños": 2,
      "ESTATUS": "Reservado",
      "Dirección Completa": "Ave. Reforma #456, Torre Elite, Piso 8",
      "Renta/Venta": "Renta"
    },
    {
      "Producto": "Casa Familiar",
      "Ubicación (referencia)": "Sur",
      "Referencia": "Casa Familiar en Sur",
      "PRECIO TOTAL": 3200000,
      "Metros2": 220,
      "N° de recámaras": 4,
      "N° de Baños": 3,
      "ESTATUS": "Disponible",
      "Dirección Completa": "Privada Los Pinos #789, Residencial del Valle",
      "Renta/Venta": "Venta"
    }
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyolSuVMheKFkdIN_0yFo2HZp9TwQ7DMtdma7YJUblNYQlu23mvQm9DJTYPywnOzIBVQw/exec",
        {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      if (Array.isArray(data)) {
        setProperties(data);
      } else {
        console.error('Received non-array data:', data);
        setProperties(sampleProperties);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setProperties(sampleProperties);
    } finally {
      setLoading(false);
    }
  };

  const updatePropertyStatus = async (propertyId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbw6ddInhypxKpoUXJZs_BQEDRoy8lIDCuT36-5JtlQ-yjnY--VxiFHUJClA9ay-JzsyOA/exec",
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'update',
            referencia: propertyId,
            column: "ESTATUS",
            newValue: newStatus
          })
        }
      );
  
      const result = await response.json();
  
      if (!result.success) {
        throw new Error(result.error || "Error desconocido en la actualización.");
      }
  
      // Refrescar la lista de propiedades
      await fetchProperties();
  
      // Actualizar localmente para mejor UX
      setProperties(prevProperties => 
        prevProperties.map(prop => 
          prop.Referencia === propertyId 
            ? { ...prop, ESTATUS: newStatus }
            : prop
        )
      );
  
    } catch (err) {
      console.error('Error al actualizar el estado:', err);
      alert('No se pudo actualizar el estado de la propiedad.');
    } finally {
      setUpdating(false);
    }
  };
  

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch = 
        property.Producto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property["Ubicación (referencia)"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property["Dirección Completa"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.Referencia?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProducto = 
        productoFilter === "all" || 
        productoFilter === "todos" || 
        property.Producto?.toLowerCase() === productoFilter.toLowerCase();

      const matchesTipo = 
        tipoFilter === "all" || 
        tipoFilter === "todos" || 
        (property["Renta/Venta"] && property["Renta/Venta"].toLowerCase() === tipoFilter.toLowerCase());

      return matchesSearch && matchesProducto && matchesTipo;
    });
  }, [properties, searchTerm, productoFilter, tipoFilter]);

  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      if (priceSort === "asc") {
        return a["PRECIO TOTAL"] - b["PRECIO TOTAL"];
      } else {
        return b["PRECIO TOTAL"] - a["PRECIO TOTAL"];
      }
    });
  }, [filteredProperties, priceSort]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <span className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
            {sortedProperties.length} total
          </span>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por Referencia, Ubicación o Dirección..."
              className="pl-10 py-2.5 bg-white border-gray-200 text-gray-900 w-full md:w-[400px] text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={productoFilter} onValueChange={setProductoFilter}>
            <SelectTrigger className="w-full md:w-40 bg-white border-gray-200 text-gray-900">
              <SelectValue placeholder="Producto" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="all">Productos</SelectItem>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="departamento">Departamento</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="bodega">Bodega</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-full md:w-40 bg-white border-gray-200 text-gray-900">
              <SelectValue placeholder="Renta/Venta" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="all">Renta/Venta</SelectItem>
              <SelectItem value="VENTA">Venta</SelectItem>
              <SelectItem value="RENTA">Renta</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
            onClick={() => setPriceSort(priceSort === "asc" ? "desc" : "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedProperties.map((property, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="relative">
                    <CardTitle className="text-gray-900">
                      {property.Producto} - {property["Ubicación (referencia)"]}
                    </CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-4 top-4 text-gray-900 hover:bg-gray-100 opacity-100"
                          onClick={() => setSelectedProperty(property)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white text-gray-900 border-gray-200 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-2xl w-[90vw] max-h-[85vh] overflow-y-auto">
                        <DialogHeader className="text-center relative">
                          <DialogTitle className="text-xl">{property.Producto}</DialogTitle>
                          {property["Ficha Tecnica"] && (
                            <a
                              href={property["Ficha Tecnica"]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute right-0 top-0 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                            >
                              FICHA TÉCNICA
                            </a>
                          )}
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="text-3xl font-bold text-gray-900">
                            {formatPrice(property["PRECIO TOTAL"])}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(property).map(([key, value]) => {
                              // Skip empty values or null
                              if (!value && value !== 0) return null;
                              
                              // Skip the fields we already show elsewhere
                              if (key === "Producto") return null;
                              if (key === "PRECIO TOTAL") return null;

                              // Skip Ficha Tecnica as it's shown in the header
                              if (key === "Ficha Tecnica") {
                                return null;
                              }

                              // Format the display value based on the type
                              let displayValue = value;
                              if (typeof value === 'number') {
                                if (key.toLowerCase().includes('precio')) {
                                  displayValue = formatPrice(value);
                                } else if (key.toLowerCase().includes('metros')) {
                                  displayValue = `${value}m²`;
                                }
                              }

                              // Format the label
                              const label = key
                                .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                                .replace(/^./, str => str.toUpperCase()); // Capitalize first letter

                              return (
                                <div key={key} className="space-y-1">
                                  <span className="text-gray-500">{label}:</span>
                                  <div className={`
                                    ${key === "ESTATUS"
                                      ? value.toLowerCase() === "disponible"
                                        ? "text-green-600"
                                        : value.toLowerCase() === "vendido"
                                          ? "text-red-600"
                                          : "text-yellow-600"
                                      : "text-gray-900"
                                    }`}>
                                    {displayValue}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="mt-4 space-x-10 flex">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-900 hover:bg-gray-100 opacity-100"
                            onClick={() => updatePropertyStatus(property.Referencia, 'Disponible')}
                          >
                            Disponible
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-900 hover:bg-gray-100 opacity-100"
                            onClick={() => updatePropertyStatus(property.Referencia, 'Reservado')}
                          >
                            Reservado
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-900 hover:bg-gray-100 opacity-100"
                            onClick={() => updatePropertyStatus(property.Referencia, 'Vendido')}
                          >
                            Vendido
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPrice(property["PRECIO TOTAL"])}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-gray-500">Area:</span>{" "}
                          {property.Metros2}m²
                        </div>
                        <div>
                          <span className="text-gray-500">Bedrooms:</span>{" "}
                          {property["N° de recámaras"]}
                        </div>
                        <div>
                          <span className="text-gray-500">Bathrooms:</span>{" "}
                          {property["N° de Baños"]}
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>{" "}
                          <span className={`
                            ${property.ESTATUS.toLowerCase() === "disponible"
                              ? "text-green-600"
                              : property.ESTATUS.toLowerCase() === "vendido"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}>
                            {property.ESTATUS}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2 truncate">
                        {property["Dirección Completa"]}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
