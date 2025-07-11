
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Car, History, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Book Parking',
      description: 'Find and reserve a parking spot',
      icon: Plus,
      to: '/book-parking',
      color: 'bg-blue-500'
    },
    {
      title: 'Active Reservations',
      description: 'View your current bookings',
      icon: Calendar,
      to: '/active-reservations',
      color: 'bg-green-500'
    },
    {
      title: 'Booking History',
      description: 'See your past reservations',
      icon: History,
      to: '/booking-history',
      color: 'bg-purple-500'
    }
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
          <Card key={action.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${action.color}/10`}>
                  <action.icon className={`h-5 w-5 ${action.color.replace('bg-', 'text-')}`} />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{action.description}</p>
              <Button asChild className="w-full">
                <Link to={action.to}>
                  Get Started
                </Link>
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
            <div className="text-2xl font-bold">1</div>
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Money Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,340</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Favorite Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">City Center</div>
            <p className="text-xs text-muted-foreground">Most visited</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;