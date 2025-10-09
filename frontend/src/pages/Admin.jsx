import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useState } from "react";
import {
  Users,
  ShoppingBag,
  Calendar,
  DollarSign,
  Package,
  PieChart,
  Settings,
  LogOut,
} from "lucide-react";

import AdminAnimals from "../components/admin/AdminAnimals";
import AdminProducts from "../components/admin/AdminProducts";
import AdminOrders from "../components/admin/AdminOrders";
import AdminEvents from "../components/admin/AdminEvents";
import AdminUsers from "../components/admin/AdminUsers";

export default function AdminPage() {
  const [tab, setTab] = useState("users");
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona animales, productos, eventos y más.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
              {/* Sustituye next/image por img */}
              <img
                src="/images/admin-avatar.jpg"
                alt="Admin"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Dashboard resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Animales</p>
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-muted-foreground mt-1">12 perros, 12 gatos</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Productos</p>
              <p className="text-2xl font-bold">48</p>
              <p className="text-xs text-muted-foreground mt-1">5 categorías</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ventas</p>
              <p className="text-2xl font-bold">$45,600</p>
              <p className="text-xs text-green-500 mt-1">+12% este mes</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Eventos</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-muted-foreground mt-1">3 próximos</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menú lateral y contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Menú lateral */}
        <div className="space-y-4">
          <div className="lg:hidden">
            <Button className="w-full bg-primary hover:bg-primary/90">Menú</Button>
          </div>
          <div className="hidden lg:block space-y-1">
            <Button variant="ghost" className="w-full justify-start" onClick={() => setTab("users")}>
              <Users className="h-5 w-5 mr-2" />
              Usuarios
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setTab("dashboard")}
            >
              <PieChart className="h-5 w-5 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setTab("animals")}>
              <Users className="h-5 w-5 mr-2" />
              Animales
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setTab("products")}>
              <Package className="h-5 w-5 mr-2" />
              Productos
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setTab("orders")}>
              <ShoppingBag className="h-5 w-5 mr-2" />
              Pedidos
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setTab("events")}>
              <Calendar className="h-5 w-5 mr-2" />
              Eventos
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-5 w-5 mr-2" />
              Configuración
            </Button>
          </div>
        </div>

        {/* Contenido principal */}
        <div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="animals">Animales</TabsTrigger>
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <AdminUsers />
            </TabsContent>
            <TabsContent value="animals">
              <AdminAnimals />
            </TabsContent>
            <TabsContent value="products">
              <AdminProducts />
            </TabsContent>
            <TabsContent value="orders">
              <AdminOrders />
            </TabsContent>
            <TabsContent value="events">
              <AdminEvents />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
