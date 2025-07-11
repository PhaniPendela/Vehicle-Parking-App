
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Plot } from '@/utils/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface EditPlotModalProps {
  plot: Plot;
  isOpen: boolean;
  onClose: () => void;
  onPlotUpdated: (updatedPlot: Plot) => void;
}

const EditPlotModal = ({ plot, isOpen, onClose, onPlotUpdated }: EditPlotModalProps) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    primeLocationName: '',
    address: '',
    pinCode: '',
    pricePerUnit: ''
  });

  useEffect(() => {
    if (plot && isOpen) {
      setFormData({
        primeLocationName: plot.primeLocationName,
        address: plot.address,
        pinCode: plot.pinCode,
        pricePerUnit: plot.pricePerUnit.toString()
      });
    }
  }, [plot, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.primeLocationName || !formData.address || !formData.pinCode || !formData.pricePerUnit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const updatedPlot = await apiService.updatePlot(plot.id, {
        primeLocationName: formData.primeLocationName,
        address: formData.address,
        pinCode: formData.pinCode,
        pricePerUnit: parseInt(formData.pricePerUnit)
      }, token);

      toast({
        title: "Success!",
        description: "Plot updated successfully",
      });
      
      onPlotUpdated(updatedPlot);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plot",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Plot</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primeLocationName">Location Name *</Label>
            <Input
              id="primeLocationName"
              value={formData.primeLocationName}
              onChange={(e) => handleInputChange('primeLocationName', e.target.value)}
              placeholder="Enter prime location name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter full address"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pinCode">PIN Code *</Label>
            <Input
              id="pinCode"
              value={formData.pinCode}
              onChange={(e) => handleInputChange('pinCode', e.target.value)}
              placeholder="Enter PIN code"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerUnit">Price per Hour (₹) *</Label>
            <Input
              id="pricePerUnit"
              type="number"
              value={formData.pricePerUnit}
              onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
              placeholder="Enter price per hour"
              min="0"
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Plot'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlotModal;