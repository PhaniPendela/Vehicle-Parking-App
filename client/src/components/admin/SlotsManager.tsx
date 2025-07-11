
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Slot } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Car, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface SlotsManagerProps {
  plotId: string;
  plotName: string;
}

const SlotsManager = ({ plotId, plotName }: SlotsManagerProps) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const slotsData = await apiService.getSlotsByPlot(plotId, token);
      setSlots(slotsData);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      
      // Fallback to mock data
      const mockSlots: Slot[] = [
        { id: `slot${plotId}-1`, plotId, status: 'occupied', slotNumber: 1 },
        { id: `slot${plotId}-2`, plotId, status: 'vacant', slotNumber: 2 },
        { id: `slot${plotId}-3`, plotId, status: 'vacant', slotNumber: 3 },
      ];
      setSlots(mockSlots);
      
      toast({
        title: "Warning",
        description: "Using mock slot data. Backend may not be available.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSlots();
    }
  }, [isOpen, plotId]);

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this vacant slot?')) return;

    setDeleteLoading(slotId);
    try {
      await apiService.deleteSlot(slotId, token);
      toast({
        title: "Success!",
        description: "Slot deleted successfully",
      });
      await fetchSlots(); // Refresh the slots list
    } catch (error) {
      console.error('Failed to delete slot:', error);
      toast({
        title: "Error",
        description: "Failed to delete slot",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const vacantSlots = slots.filter(slot => slot.status === 'vacant');
  const occupiedSlots = slots.filter(slot => slot.status === 'occupied');

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-3 h-auto">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span className="font-medium">Manage Slots ({slots.length} total)</span>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 mt-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Loading slots...</span>
          </div>
        ) : slots.length > 0 ? (
          <div className="space-y-4">
            {/* Vacant Slots */}
            {vacantSlots.length > 0 && (
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Circle className="h-4 w-4 text-green-600" />
                    Vacant Slots ({vacantSlots.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {vacantSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-md shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <Circle className="h-4 w-4 text-green-600 fill-green-600" />
                          <div>
                            <span className="font-medium">Slot #{slot.slotNumber || slot.id.slice(-2)}</span>
                            <span className="ml-2 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                              Vacant
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSlot(slot.id)}
                          disabled={deleteLoading === slot.id}
                        >
                          {deleteLoading === slot.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Occupied Slots */}
            {occupiedSlots.length > 0 && (
              <Card className="border-red-200 bg-red-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Car className="h-4 w-4 text-red-600" />
                    Occupied Slots ({occupiedSlots.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {occupiedSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 bg-white border border-red-200 rounded-md shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <Car className="h-4 w-4 text-red-600" />
                          <div>
                            <span className="font-medium">Slot #{slot.slotNumber || slot.id.slice(-2)}</span>
                            <span className="ml-2 text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full">
                              Occupied
                            </span>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground italic">Cannot delete</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Car className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No slots found for this plot</p>
              <p className="text-xs text-muted-foreground mt-1">
                Slots may need to be created through the backend system
              </p>
            </CardContent>
          </Card>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SlotsManager;