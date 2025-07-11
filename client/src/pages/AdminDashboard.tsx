
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Map, List, Shield, TrendingUp, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Create Plot',
      description: 'Add new parking locations',
      icon: Plus,
      to: '/admin/create-plot',
      color: 'bg-blue-500'
    },
    {
      title: 'View All Plots',
      description: 'Manage existing parking plots',
      icon: Map,
      to: '/admin/plots',
      color: 'bg-green-500'
    },
    {
      title: 'All Reservations',
      description: 'Monitor all user bookings',
      icon: List,
      to: '/admin/reservations',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.fullName}! Manage your parking system
          </p>
        </div>
        <div className="p-3 rounded-full bg-destructive/10">
          <Shield className="h-8 w-8 text-destructive" />
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plots</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reservations</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Currently occupied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,340</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
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
                  Access
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 rounded-full bg-green-100">
                <Plus className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">New reservation created</p>
                <p className="text-sm text-muted-foreground">City Center Mall - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 rounded-full bg-blue-100">
                <Map className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">New plot added</p>
                <p className="text-sm text-muted-foreground">Tech Park Gateway - 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 rounded-full bg-red-100">
                <List className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Reservation cancelled</p>
                <p className="text-sm text-muted-foreground">Airport Plaza - 1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;