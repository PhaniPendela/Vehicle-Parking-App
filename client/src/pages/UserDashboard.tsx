import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Car, History, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    activeBookings: 0,
    totalBookings: 0,
    totalSpent: 0,
    favoriteLocation: "Loading...",
  });
  const [loading, setLoading] = useState(true);

  const fetchUserStats = useCallback(async () => {
    if (!user || !token) return;

    // Fallback to calculated stats from reservations
    try {
      const reservations = await apiService.getUserReservations(user.id, token);
      const activeReservations = reservations.filter(
        (r) => r.status === "active"
      );
      const totalSpent = +(
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
      const locationCounts = reservations.reduce((acc, r) => {
        const location = r.plot?.primeLocationName || "Unknown";
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const favoriteLocation = Object.keys(locationCounts).reduce(
        (a, b) => (locationCounts[a] > locationCounts[b] ? a : b),
        "No bookings yet"
      );

      setStats({
        activeBookings: activeReservations.length,
        totalBookings: reservations.length,
        totalSpent,
        favoriteLocation,
      });
    } catch (fallbackError) {
      console.error("Failed to fetch stats:", fallbackError);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  const quickActions = [
    {
      title: "Book Parking",
      description: "Find and reserve a parking spot",
      icon: Plus,
      to: "/book-parking",
      color: "bg-blue-500",
    },
    {
      title: "Active Reservations",
      description: "View your current bookings",
      icon: Calendar,
      to: "/active-reservations",
      color: "bg-green-500",
    },
    {
      title: "All Reservations",
      description: "View and manage all reservations",
      icon: History,
      to: "/booking-history",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your parking reservations easily
          </p>
        </div>
        <div className="p-3 rounded-full bg-primary/10">
          <Car className="h-8 w-8 text-primary" />
        </div>
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
                <Link to={action.to}>Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.activeBookings
              )}
            </div>
            <p className="text-xs text-muted-foreground">Currently reserved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                stats.totalBookings
              )}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `₹${stats.totalSpent}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Favorite Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                stats.favoriteLocation
              )}
            </div>
            <p className="text-xs text-muted-foreground">Most visited</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
