
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Reservation } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, Clock, Loader2, X } from 'lucide-react';

const ActiveReservations = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  const fetchReservations = async () => {
    if (!user) return;

    try {
      const data = await apiService.getUserReservations(user.id, token);
      setReservations(data.filter(r => r.status === 'active'));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    setCancelLoading(reservationId);
    try {
      await apiService.cancelReservation(reservationId, token);
      toast({
        title: "Success!",
        description: "Reservation cancelled successfully",
      });
      await fetchReservations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel reservation",
        variant: "destructive"
      });
    } finally {
      setCancelLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
        <h1 className="text-3xl font-bold text-foreground">Active Reservations</h1>
        <p className="text-muted-foreground mt-2">
          Manage your current parking bookings
        </p>
      </div>

      {reservations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="border-l-4 border-l-green-500">
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
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelReservation(reservation.id)}
                    disabled={cancelLoading === reservation.id}
                  >
                    {cancelLoading === reservation.id ? (
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