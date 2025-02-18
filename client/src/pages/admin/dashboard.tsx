import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { User, Property, Client, Sale } from "@shared/schema";
import { useState } from "react";

export default function AdminDashboard() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: userProperties } = useQuery<Property[]>({
    queryKey: ["/api/admin/properties", selectedUserId],
    enabled: !!selectedUserId,
  });

  const { data: userClients } = useQuery<Client[]>({
    queryKey: ["/api/admin/clients", selectedUserId],
    enabled: !!selectedUserId,
  });

  const { data: userSales } = useQuery<Sale[]>({
    queryKey: ["/api/admin/sales", selectedUserId],
    enabled: !!selectedUserId,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Users Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Selected User Details */}
      {selectedUserId && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">User Details</h2>

          {/* Properties */}
          <Card>
            <CardHeader>
              <CardTitle>Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userProperties?.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>{property.title}</TableCell>
                      <TableCell>${property.price}</TableCell>
                      <TableCell>{property.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Clients */}
          <Card>
            <CardHeader>
              <CardTitle>Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userClients?.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userSales?.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.propertyId}</TableCell>
                      <TableCell>${sale.amount}</TableCell>
                      <TableCell>{sale.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
