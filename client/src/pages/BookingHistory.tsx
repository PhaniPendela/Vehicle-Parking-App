
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Reservation } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { History, MapPin, Calendar, Loader2 } from 'lucide-react';

const BookingHistory = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  const fetchReservations = async () => {
    if (!user) return;

    try {
      const data = await apiService.getUserReservations(user.id, token);
      setReservations(data.filter(r => r.status !== 'active'));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch booking history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold text-foreground">Booking History</h1>
        <p className="text-muted-foreground mt-2">
          View your past parking reservations
        </p>
      </div>

      {reservations.length > 0 ? (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {reservation.plot?.primeLocationName}
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="font-medium">{reservation.plot?.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Booking Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatDate(reservation.createdAt)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rate</p>
                    <p className="font-medium text-green-600">₹{reservation.plot?.pricePerUnit}/hour</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No booking history</h3>
            <p className="text-muted-foreground">
              Your completed and cancelled reservations will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingHistory;