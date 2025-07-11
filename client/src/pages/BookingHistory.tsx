import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Corrected path assumption
import { apiService, Reservation } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // No longer needed if no buttons
import { useToast } from "@/hooks/use-toast";
import { History, MapPin, Calendar, Loader2 } from "lucide-react"; // Removed Check, X

const BookingHistory = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed: [completingReservation, setCompletingReservation]
  // Removed: [cancellingReservation, setCancellingReservation]

  const fetchReservations = useCallback(async () => {
    if (!user?.id) {
      console.log("No user or user ID available");
      return;
    }

    console.log("Fetching reservations for user:", user.id);

    try {
      const data = await apiService.getUserReservations(user.id, token);
      console.log("Reservations fetched:", data);
      setReservations(data); // Display all reservations
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch booking history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, token, toast]);

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user, fetchReservations]);

  // Removed: handleCompleteReservation
  // Removed: handleCancelReservation

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">All Reservations</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all your parking reservations
        </p>
      </div>

      {reservations.length > 0 ? (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {reservation.plot?.primeLocationName}
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Location
                    </p>
                    <p className="font-medium">{reservation.plot?.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Booking Date
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatDate(reservation.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rate</p>
                    <p className="font-medium text-green-600">
                      ₹{reservation.plot?.pricePerUnit}/hour
                    </p>
                  </div>
                </div>
                {/* Removed the mt-4 flex gap-2 div containing action buttons */}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No reservations found</h3>
            <p className="text-muted-foreground">
              Your reservations will appear here once you book a parking slot.
            </p>
            {/* Keeping this button for UX to guide users to book */}
            <Button asChild>
              <a href="/book-parking">Book Parking Now</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingHistory;
