
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Plot } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, DollarSign, Car, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookParking = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      const data = await apiService.getPlots(token);
      setPlots(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch parking plots",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (plotId: string) => {
    if (!user) return;

    setBookingLoading(plotId);
    try {
      await apiService.createReservation(plotId, user.id, token);
      toast({
        title: "Success!",
        description: "Parking slot booked successfully",
      });
      navigate('/active-reservations');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book parking slot",
        variant: "destructive"
      });
    } finally {
      setBookingLoading(null);
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
        <h1 className="text-3xl font-bold text-foreground">Book Parking</h1>
        <p className="text-muted-foreground mt-2">
          Choose from available parking locations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plots.map((plot) => (
          <Card key={plot.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {plot.primeLocationName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Address:</strong> {plot.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>PIN Code:</strong> {plot.pinCode}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">₹{plot.pricePerUnit}/hour</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{plot.numUnits} slots</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={() => handleBookSlot(plot.id)}
                disabled={bookingLoading === plot.id}
              >
                {bookingLoading === plot.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Book Slot'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {plots.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No parking plots available</h3>
            <p className="text-muted-foreground">
              Check back later for available parking spaces.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookParking;