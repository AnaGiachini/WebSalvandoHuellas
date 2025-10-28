import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  Calendar,
  DollarSign,
  Package,
  Settings,
  PawPrint,
  Heart,
} from "lucide-react";

import AdminAnimals from "../components/admin/AdminAnimals";
import AdminProducts from "../components/admin/AdminProducts";
import AdminOrders from "../components/admin/AdminOrders";
import AdminAdoptions from "../components/admin/AdminAdoptions";
import AdminEvents from "../components/admin/AdminEvents";
import AdminUsers from "../components/admin/AdminUsers";
import AdminDonations from "../components/admin/AdminDonations";

// Services para métricas
import animalsService from "../services/animalsService";
import articlesService from "../services/articlesService";
import { getEvents } from "../services/eventsService";
import adoptionApplicationsService from "../services/adoptionApplicationsService";
import purchaseService from "../services/purchaseService";
import donationService from "../services/donationService";

export default function AdminPage() {
  const [tab, setTab] = useState("users");
  const [metrics, setMetrics] = useState({
    animals: 0,
    products: 0,
    eventsUpcoming: 0,
    adoptionsApproved: 0,
    salesAmount: 0,
    salesCount: 0,
    donationsAmount: 0,
    donationsCount: 0,
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingMetrics(true);
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0,0,0,0);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setMilliseconds(-1);

        const [animals, products, events, adoptions, sales, donations] = await Promise.all([
          animalsService.list().catch(() => []),
          articlesService.getAll().catch(() => []),
          getEvents().catch(() => []),
          adoptionApplicationsService.getAll().catch(() => []), // requiere admin
          purchaseService.getMetrics({ from: startOfMonth.toISOString(), to: endOfMonth.toISOString() }).catch(() => ({ totalAmount: 0, count: 0, byStatus: {} })),
          donationService.listAll().catch(() => []),
        ]);

        // Próximos eventos: fecha >= hoy
        const now = new Date();
        const upcoming = Array.isArray(events)
          ? events.filter((e) => (e.fecha ? new Date(e.fecha) : null) && new Date(e.fecha) >= now).length
          : 0;
        const approved = Array.isArray(adoptions)
          ? adoptions.filter((a) => a.estado === "aprobada").length
          : 0;
        
        // Calcular donaciones pagadas del mes
        const donationsPaid = Array.isArray(donations)
          ? donations.filter((d) => d.estadoPago === 'pagado' && new Date(d.fechaDonacion) >= startOfMonth && new Date(d.fechaDonacion) <= endOfMonth)
          : [];
        const donationsTotal = donationsPaid.reduce((sum, d) => sum + Number(d.monto || 0), 0);

        if (!mounted) return;
        setMetrics({
          animals: Array.isArray(animals) ? animals.length : 0,
          products: Array.isArray(products) ? products.length : 0,
          eventsUpcoming: upcoming,
          adoptionsApproved: approved,
          salesAmount: Number(sales?.totalAmount || 0),
          salesCount: Number(sales?.count || 0),
          donationsAmount: donationsTotal,
          donationsCount: donationsPaid.length,
        });
      } finally {
        if (mounted) setLoadingMetrics(false);
      }
    };
    load();
    return () => { mounted = false };
  }, []);
  const formatCurrency = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n || 0);
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona animales, productos, eventos y más.</p>
        </div>
      </div>

      {/* Dashboard resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Animales</p>
              <p className="text-2xl font-bold">{loadingMetrics ? "-" : metrics.animals}</p>
              <p className="text-xs text-muted-foreground mt-1">Total registrados</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <PawPrint className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Productos</p>
              <p className="text-2xl font-bold">{loadingMetrics ? "-" : metrics.products}</p>
              <p className="text-xs text-muted-foreground mt-1">En tienda</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Adopciones</p>
              <p className="text-2xl font-bold">{loadingMetrics ? "-" : metrics.adoptionsApproved}</p>
              <p className="text-xs text-muted-foreground mt-1">Exitosas</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Heart className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Eventos</p>
              <p className="text-2xl font-bold">{loadingMetrics ? "-" : metrics.eventsUpcoming}</p>
              <p className="text-xs text-muted-foreground mt-1">Próximos</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ventas (mes actual)</p>
              <p className="text-2xl font-bold">{loadingMetrics ? "-" : formatCurrency(metrics.salesAmount)}</p>
              <p className="text-xs text-muted-foreground mt-1">{loadingMetrics ? "" : `${metrics.salesCount} órdenes`}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Donaciones (mes actual)</p>
              <p className="text-2xl font-bold">{loadingMetrics ? "-" : formatCurrency(metrics.donationsAmount)}</p>
              <p className="text-xs text-muted-foreground mt-1">{loadingMetrics ? "" : `${metrics.donationsCount} donaciones`}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Heart className="h-6 w-6 text-green-600" />
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
            <Button variant="ghost" className="w-full justify-start" onClick={() => setTab("adoptions")}>
              <Heart className="h-5 w-5 mr-2" />
              Adopciones
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setTab("animals")}>
              <PawPrint className="h-5 w-5 mr-2" />
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
            <Button variant="ghost" className="w-full justify-start" onClick={() => setTab("donations")}>
              <Heart className="h-5 w-5 mr-2" />
              Donaciones
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
            <TabsList className="grid grid-cols-7 mb-8">
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="adoptions">Adopciones</TabsTrigger>
              <TabsTrigger value="animals">Animales</TabsTrigger>
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="donations">Donaciones</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <AdminUsers />
            </TabsContent>
            <TabsContent value="adoptions">
              <AdminAdoptions />
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
            <TabsContent value="donations">
              <AdminDonations />
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
