import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Corrected path assumption
import { apiService, Reservation } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Clock, Loader2, X, CheckCircle } from "lucide-react"; // Import CheckCircle

const ActiveReservations = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);
  const [completeLoading, setCompleteLoading] = useState<string | null>(null); // NEW: State for complete button

  const fetchReservations = useCallback(async () => {
    if (!user) return;

    try {
      const data = await apiService.getUserReservations(user.id, token);
      setReservations(data.filter((r) => r.status === "active")); // Only active reservations here
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
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

  // Existing handleCancelReservation (moved from BookingHistory, if it was there, but you already had it here)
  const handleCancelReservation = async (reservationId: string) => {
    if (!reservationId) {
      // Added ID check
      toast({
        title: "Error",
        description: "Unable to cancel reservation: Invalid ID",
        variant: "destructive",
      });
      return;
    }
    setCancelLoading(reservationId);
    try {
      await apiService.cancelReservation(reservationId, token);
      toast({
        title: "Success!",
        description: "Reservation cancelled successfully",
      });
      await fetchReservations(); // Refresh the list
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      toast({
        title: "Error",
        description: "Failed to cancel reservation",
        variant: "destructive",
      });
    } finally {
      setCancelLoading(null);
    }
  };

  // NEW: handleCompleteReservation (copied from BookingHistory)
  const handleCompleteReservation = async (reservationId: string) => {
    if (!reservationId) {
      // Added ID check
      toast({
        title: "Error",
        description: "Invalid reservation ID",
        variant: "destructive",
      });
      return;
    }
    setCompleteLoading(reservationId);
    try {
      await apiService.completeReservation(reservationId, token);
      toast({
        title: "Success!",
        description: "Reservation completed successfully",
      });
      fetchReservations(); // Refresh the list
    } catch (error) {
      console.error("Complete reservation error:", error);
      toast({
        title: "Error",
        description: "Failed to complete reservation",
        variant: "destructive",
      });
    } finally {
      setCompleteLoading(null);
    }
  };
  // END NEW FUNCTIONS

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <h1 className="text-3xl font-bold text-foreground">
          Active Reservations
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your current parking bookings
        </p>
      </div>

      {reservations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.map((reservation) => (
            <Card
              key={reservation._id}
              className="border-l-4 border-l-green-500"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {reservation.plot?.primeLocationName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Address:</strong> {reservation.plot?.address}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Booked: {formatDate(reservation.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-lg font-semibold">
                    ₹{reservation.plot?.pricePerUnit}/hour
                  </div>
                  <div className="flex gap-2">
                    {" "}
                    {/* Container for buttons */}
                    {/* Complete Button */}
                    <Button
                      onClick={() => handleCompleteReservation(reservation._id)}
                      disabled={
                        completeLoading === reservation._id ||
                        cancelLoading === reservation._id
                      } // Disable if other action is pending
                    >
                      {completeLoading === reservation._id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Completing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />{" "}
                          {/* Changed from Check to CheckCircle for consistency */}
                          Complete
                        </>
                      )}
                    </Button>
                    {/* Cancel Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelReservation(reservation._id)}
                      disabled={
                        cancelLoading === reservation._id ||
                        completeLoading === reservation._id
                      } // Disable if other action is pending
                    >
                      {cancelLoading === reservation._id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No active reservations</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any active parking reservations at the moment.
            </p>
            <Button asChild>
              <a href="/book-parking">Book Parking Now</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActiveReservations;
