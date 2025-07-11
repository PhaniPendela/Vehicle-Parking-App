
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, CreatePlotData } from '@/utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Plus, Loader2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreatePlot = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreatePlotData>();

  const onSubmit = async (data: CreatePlotData) => {
    setIsSubmitting(true);
    try {
      await apiService.createPlot(data, token);
      toast({
        title: "Success!",
        description: "Parking plot created successfully",
      });
      reset();
      navigate('/admin/plots');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create parking plot",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Plot</h1>
          <p className="text-muted-foreground mt-1">
            Add a new parking location to the system
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Plot Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="primeLocationName">Location Name</Label>
                <Input
                  id="primeLocationName"
                  placeholder="e.g., City Center Mall"
                  {...register("primeLocationName", {
                    required: "Location name is required"
                  })}
                />
                {errors.primeLocationName && (
                  <p className="text-sm text-destructive">{errors.primeLocationName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="e.g., 123 Main Street, Downtown"
                  {...register("address", {
                    required: "Address is required"
                  })}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN Code</Label>
                <Input
                  id="pinCode"
                  placeholder="e.g., 500001"
                  {...register("pinCode", {
                    required: "PIN code is required",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "PIN code must be 6 digits"
                    }
                  })}
                />
                {errors.pinCode && (
                  <p className="text-sm text-destructive">{errors.pinCode.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerUnit">Price per Hour (₹)</Label>
                  <Input
                    id="pricePerUnit"
                    type="number"
                    placeholder="e.g., 50"
                    {...register("pricePerUnit", {
                      required: "Price per unit is required",
                      min: {
                        value: 1,
                        message: "Price must be at least ₹1"
                      }
                    })}
                  />
                  {errors.pricePerUnit && (
                    <p className="text-sm text-destructive">{errors.pricePerUnit.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numUnits">Number of Slots</Label>
                  <Input
                    id="numUnits"
                    type="number"
                    placeholder="e.g., 10"
                    {...register("numUnits", {
                      required: "Number of units is required",
                      min: {
                        value: 1,
                        message: "Must have at least 1 slot"
                      }
                    })}
                  />
                  {errors.numUnits && (
                    <p className="text-sm text-destructive">{errors.numUnits.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Plot
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/plots')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePlot;