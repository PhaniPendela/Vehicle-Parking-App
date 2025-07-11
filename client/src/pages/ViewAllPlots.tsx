
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Plot } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, DollarSign, Car, Trash2, Plus, Loader2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditPlotModal from '@/components/admin/EditPlotModal';
import SlotsManager from '@/components/admin/SlotsManager';

const ViewAllPlots = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      const data = await apiService.getPlots(token);
      setPlots(data);
    } catch (error) {
      console.error('Failed to fetch plots:', error);
      toast({
        title: "Error",
        description: "Failed to fetch plots. Using mock data as fallback.",
        variant: "destructive"
      });
      
      // Fallback to mock data if API fails
      const mockPlots: Plot[] = [
        {
          id: '1',
          primeLocationName: 'City Center Mall',
          address: '123 Main Street, Downtown',
          pinCode: '500001',
          pricePerUnit: 50,
          numUnits: 10
        },
        {
          id: '2',
          primeLocationName: 'Airport Plaza',
          address: '456 Airport Road, Terminal Area',
          pinCode: '500009',
          pricePerUnit: 75,
          numUnits: 15
        }
      ];
      setPlots(mockPlots);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlot = async (plotId: string) => {
    if (!confirm('Are you sure you want to delete this plot?')) return;

    setDeleteLoading(plotId);
    try {
      await apiService.deletePlot(plotId, token);
      toast({
        title: "Success!",
        description: "Plot deleted successfully",
      });
      await fetchPlots();
    } catch (error) {
      console.error('Failed to delete plot:', error);
      toast({
        title: "Error",
        description: "Failed to delete plot",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditClick = (plot: Plot) => {
    setSelectedPlot(plot);
    setEditModalOpen(true);
  };

  const handlePlotUpdated = (updatedPlot: Plot) => {
    setPlots(prev => prev.map(plot => 
      plot.id === updatedPlot.id ? updatedPlot : plot
    ));
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Plots</h1>
          <p className="text-muted-foreground mt-2">
            Manage parking locations and availability
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/create-plot">
            <Plus className="h-4 w-4 mr-2" />
            Add New Plot
          </Link>
        </Button>
      </div>

      {plots.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {plots.map((plot) => (
            <Card key={plot.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  {plot.primeLocationName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plot Information */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Address:</span> {plot.address}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">PIN Code:</span> {plot.pinCode}
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-2 border-y border-border">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">₹{plot.pricePerUnit}/hour</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{plot.numUnits} slots</span>
                    </div>
                  </div>
                </div>

                {/* Slots Manager */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <SlotsManager 
                    plotId={plot.id} 
                    plotName={plot.primeLocationName} 
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditClick(plot)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Plot
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeletePlot(plot.id)}
                    disabled={deleteLoading === plot.id}
                  >
                    {deleteLoading === plot.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Plot
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
          <CardContent className="text-center py-16">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-medium mb-3">No plots available</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start by creating your first parking plot to manage parking locations and slots.
            </p>
            <Button asChild size="lg">
              <Link to="/admin/create-plot">
                <Plus className="h-4 w-4 mr-2" />
                Create First Plot
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Plot Modal */}
      {selectedPlot && (
        <EditPlotModal
          plot={selectedPlot}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedPlot(null);
          }}
          onPlotUpdated={handlePlotUpdated}
        />
      )}
    </div>
  );
};

export default ViewAllPlots;