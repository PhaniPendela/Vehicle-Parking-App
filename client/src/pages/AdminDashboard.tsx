import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, Reservation } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Map,
  List,
  Shield,
  TrendingUp,
  Users,
  MapPin,
  Loader2,
  Calendar,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalPlots: 0,
    activeReservations: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentReservations, setRecentReservations] = useState<Reservation[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchAdminStats = useCallback(async () => {
    if (!token) return;

    try {
      // Fetch real stats from API
      const [plots, reservations, users] = await Promise.all([
        apiService.getPlots(token),
        apiService.getAllReservations(token),
        apiService.getAllUsers(token),
      ]);

      const activeReservations = reservations.filter(
        (r) => r.status === "active"
      );
      const totalRevenue = +(
        reservations
          .filter((r) => r.status === "completed")
          .reduce(
            (sum, r) =>
              sum +
              ((r.plot?.pricePerUnit *
                (new Date(r.endTime).getTime() -
                  new Date(r.startTime).getTime())) /
                (1000 * 60 * 60) || 0),
            0
          ) +
        reservations
          .filter((r) => r.status === "cancelled")
          .reduce(
            (sum, r) =>
              sum +
              ((new Date(r.endTime).getTime() -
                new Date(r.startTime).getTime()) /
                (1000 * 60) >
              5
                ? r.plot?.pricePerUnit || 0
                : 0),
            0
          )
      ).toFixed(2);

      setStats({
        totalPlots: plots.length,
        activeReservations: activeReservations.length,
        totalUsers: users.length,
        totalRevenue,
      });

      // Set recent reservations (last 5)
      const sortedReservations = reservations.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentReservations(sortedReservations.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      // Set default values on error
      setStats({
        totalPlots: 0,
        activeReservations: 0,
        totalUsers: 0,
        totalRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  const quickActions = [
    {
      title: "Create Plot",
      description: "Add new parking locations",
      icon: Plus,
      to: "/admin/create-plot",
      color: "bg-blue-500",
    },
    {
      title: "View All Plots",
      description: "Manage existing parking plots",
      icon: Map,
      to: "/admin/plots",
      color: "bg-green-500",
    },
    {
      title: "All Reservations",
      description: "Monitor all user bookings",
      icon: List,
      to: "/admin/reservations",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.fullName}! Manage your parking system
          </p>
        </div>
        <div className="p-3 rounded-full bg-destructive/10">
          <Shield className="h-8 w-8 text-destructive" />
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plots</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.totalPlots
              )}
            </div>
            <p className="text-xs text-muted-foreground">Parking locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Reservations
            </CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.activeReservations
              )}
            </div>
            <p className="text-xs text-muted-foreground">Currently occupied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.totalUsers || "N/A"
              )}
            </div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `₹${stats.totalRevenue}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Card
            key={action.title}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${action.color}/10`}>
                  <action.icon
                    className={`h-5 w-5 ${action.color.replace(
                      "bg-",
                      "text-"
                    )}`}
                  />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{action.description}</p>
              <Button asChild className="w-full">
                <Link to={action.to}>Access</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reservations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Reservations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : recentReservations.length > 0 ? (
              recentReservations.map((reservation) => (
                <div
                  key={reservation._id}
                  className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                >
                  <div
                    className={`p-2 rounded-full ${
                      reservation.status === "active"
                        ? "bg-blue-100"
                        : reservation.status === "completed"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <MapPin
                      className={`h-4 w-4 ${
                        reservation.status === "active"
                          ? "text-blue-600"
                          : reservation.status === "completed"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {reservation.plot?.primeLocationName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status: {reservation.status} •{" "}
                      {new Date(reservation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ₹{reservation.plot?.pricePerUnit}/hour
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <List className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No recent reservations</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
