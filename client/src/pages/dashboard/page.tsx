import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Users,
  Calendar,
  DollarSign,
  AlertCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from "recharts";
import { useEffect, useState } from "react";
import { collection, query, getDocs, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface SaleData {
  asesor: string;
  cliente: string;
  comision: string;
  estatus: string;
  fecha: string;
  ingreso: number;
  producto: string;
}

interface DashboardData {
  totalProperties: number;
  activeClients: number;
  totalSales: number;
  totalCommission: number;
  performanceData: {
    month: string;
    sales: number;
    commission: number;
  }[];
  pendingSales: SaleData[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the correct current time
  const getCurrentMonth = () => {
    const now = new Date("2025-02-20T12:06:45-06:00");
    return now.getMonth() + 1;
  };

  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth().toString());

  // Update current month every minute
  useEffect(() => {
    const checkCurrentMonth = () => {
      const month = getCurrentMonth();
      if (month !== currentMonth) {
        setCurrentMonth(month);
        // Automatically switch to new month if we were on the previous current month
        if (selectedMonth === currentMonth.toString()) {
          setSelectedMonth(month.toString());
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkCurrentMonth, 60000);

    // Initial check
    checkCurrentMonth();

    return () => clearInterval(interval);
  }, [currentMonth, selectedMonth]);

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProperties: 0,
    activeClients: 0,
    totalSales: 0,
    totalCommission: 0,
    performanceData: [],
    pendingSales: []
  });

  const months = [
    { value: "all", label: "Todos" },
    { value: "1", label: "Ene" },
    { value: "2", label: "Feb" },
    { value: "3", label: "Mar" },
    { value: "4", label: "Abr" },
    { value: "5", label: "May" },
    { value: "6", label: "Jun" },
    { value: "7", label: "Jul" },
    { value: "8", label: "Ago" },
    { value: "9", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dic" }
  ];

  const parseCustomDate = (dateStr: string): Date => {
    // Format: "10/nero/2025"
    const monthMap: { [key: string]: number } = {
      'ene': 0,    // enero
      'feb': 1,   // febrero
      'mar': 2,     // marzo
      'abr': 3,    // abril
      'may': 4,      // mayo
      'jun': 5,     // junio
      'jul': 6,     // julio
      'ago': 7,    // agosto
      'sep': 8, // septiembre
      'oct': 9,   // octubre
      'nov': 10,// noviembre
      'dic': 11 // diciembre
    };

    try {
      const [day, monthStr, year] = dateStr.split('/');
      let monthNumber = 0;
      
      // Find the matching month by checking if monthStr contains any of our keys
      for (const [key, value] of Object.entries(monthMap)) {
        if (monthStr.toLowerCase().includes(key)) {
          monthNumber = value;
          break;
        }
      }

      return new Date(parseInt(year), monthNumber, parseInt(day));
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return new Date();
    }
  };

  useEffect(() => {
    const fetchUserDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        
        const salesQuery = query(
          collection(db, "ventas"),
          where("asesor", "==", user.uid)
        );
        const salesSnapshot = await getDocs(salesQuery);
        
        let totalSales = 0;
        let totalCommission = 0;
        const salesByMonth: Record<string, { sales: number; commission: number }> = {};
        const pendingSales: SaleData[] = [];
        const uniqueClients = new Set<string>();
        const uniquePropertiesForMonth = new Set<string>();
        const uniqueClientsForMonth = new Set<string>();

        salesSnapshot.docs.forEach(doc => {
          const data = doc.data() as SaleData;
          const date = parseCustomDate(data.fecha);
          const monthNumber = (date.getMonth() + 1).toString();
          const monthKey = date.toLocaleString('es-MX', { month: 'short', year: 'numeric' });

          // Add to total unique clients regardless of filter
          uniqueClients.add(data.cliente);

          if (selectedMonth === "all" || monthNumber === selectedMonth) {
            // Add to filtered unique clients and properties
            uniqueClientsForMonth.add(data.cliente);
            if (data.producto === "casa") {
              uniquePropertiesForMonth.add(doc.id); // Using doc.id to ensure uniqueness
            }

            if (data.estatus === "cerrada") {
              totalSales += data.ingreso;
              totalCommission += parseInt(data.comision);
              
              if (!salesByMonth[monthKey]) {
                salesByMonth[monthKey] = { sales: 0, commission: 0 };
              }
              salesByMonth[monthKey].sales += data.ingreso;
              salesByMonth[monthKey].commission += parseInt(data.comision);
            } else {
              pendingSales.push(data);
            }
          }
        });

        const extendPerformanceData = (data: any[]) => {
          if (data.length === 0) return data;
          
          const lastEntry = data[data.length - 1];
          const [monthStr, yearStr] = lastEntry.month.split(' ');
          const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 
                        'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
          const currentMonthIndex = months.indexOf(monthStr.toLowerCase());
          
          const nextTwoMonths = [];
          for (let i = 1; i <= 2; i++) {
            const nextMonthIndex = (currentMonthIndex + i) % 12;
            const yearOffset = (currentMonthIndex + i) >= 12 ? 1 : 0;
            const nextYear = parseInt(yearStr) + yearOffset;
            nextTwoMonths.push({
              month: `${months[nextMonthIndex]} ${nextYear}`,
              sales: null
            });
          }
          
          return [...data, ...nextTwoMonths];
        };

        const performanceData = Object.entries(salesByMonth).map(([month, data]) => ({
          month,
          sales: data.sales / 1000000
        })).sort((a, b) => {
          // Get month number from the Spanish month name
          const getMonthNumber = (monthStr: string) => {
            const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 
                          'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
            const month = monthStr.split(' ')[0].toLowerCase();
            return months.indexOf(month);
          };

          // Get year from the month string (e.g., "ene 2025" -> 2025)
          const getYear = (monthStr: string) => {
            return parseInt(monthStr.split(' ')[1]);
          };

          const yearA = getYear(a.month);
          const yearB = getYear(b.month);

          if (yearA !== yearB) {
            return yearA - yearB;
          }

          return getMonthNumber(a.month) - getMonthNumber(b.month);
        });

        const extendedPerformanceData = extendPerformanceData(performanceData);

        setDashboardData({
          // Use filtered counts when a month is selected, otherwise use total counts
          totalProperties: selectedMonth === "all" 
            ? salesSnapshot.docs.filter(doc => doc.data().producto === "casa").length 
            : uniquePropertiesForMonth.size,
          activeClients: selectedMonth === "all" 
            ? uniqueClients.size 
            : uniqueClientsForMonth.size,
          totalSales,
          totalCommission,
          performanceData: extendedPerformanceData,
          pendingSales
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error instanceof Error ? error.message : "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDashboardData();
  }, [user, selectedMonth]);

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Por favor inicia sesión para ver tu dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Month Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {months.map((month) => (
            <button
              key={month.value}
              onClick={() => setSelectedMonth(month.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${selectedMonth === month.value 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-secondary hover:bg-secondary/80'}`}
            >
              {month.label}
              {month.value === currentMonth.toString() && (
                <span className="ml-1 text-xs">(Actual)</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{dashboardData.totalProperties}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{dashboardData.activeClients}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">${(dashboardData.totalSales / 1000000).toFixed(1)}M</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Commission
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">${(dashboardData.totalCommission / 1000).toFixed(1)}k</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="w-full h-[250px]" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  padding={{ left: 0, right: 30 }}
                />
                <YAxis 
                  label={{ 
                    value: 'Sales (Millions)', 
                    angle: -90, 
                    position: 'insideLeft' 
                  }}
                  domain={[0, (dataMax: number) => Math.ceil(dataMax + 2)]}
                  padding={{ top: 20 }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  name="Sales (M)"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  connectNulls
                />
                {dashboardData.performanceData.map(data => {
                  const monthYear = data.month;
                  const currentMonthYear = new Date("2025-02-20T12:18:13-06:00")
                    .toLocaleString('es-MX', { month: 'short', year: 'numeric' });
                  
                  if (monthYear === currentMonthYear) {
                    return (
                      <ReferenceLine
                        key="currentMonth"
                        x={monthYear}
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        label={{
                          value: 'Current Month',
                          position: 'insideTopLeft',
                          fill: '#10b981',
                          fontSize: 12
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Pending Sales */}
      {dashboardData.pendingSales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Ventas Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.pendingSales.map((sale, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-yellow-50 border border-yellow-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Cliente: {sale.cliente}</h3>
                      <p className="text-sm text-gray-600">Producto: {sale.producto}</p>
                      <p className="text-sm text-gray-600">
                        Fecha: {new Date(sale.fecha).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(sale.ingreso / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-gray-600">
                        Comisión: ${(parseInt(sale.comision) / 1000).toFixed(1)}k
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
