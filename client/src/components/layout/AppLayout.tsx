
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Car, 
  Calendar, 
  History, 
  Plus, 
  Map, 
  List, 
  LogOut,
  User,
  Shield
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();

  const userNavItems = [
    { to: '/dashboard', icon: Car, label: 'Dashboard' },
    { to: '/book-parking', icon: Calendar, label: 'Book Parking' },
    { to: '/active-reservations', icon: List, label: 'Active Reservations' },
    { to: '/booking-history', icon: History, label: 'History' }
  ];

  const adminNavItems = [
    { to: '/admin/dashboard', icon: Shield, label: 'Admin Dashboard' },
    { to: '/admin/create-plot', icon: Plus, label: 'Create Plot' },
    { to: '/admin/plots', icon: Map, label: 'View All Plots' },
    { to: '/admin/reservations', icon: List, label: 'All Reservations' }
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Top Header/Navbar */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ParkVista</h1>
              <p className="text-sm text-muted-foreground">Parking Management</p>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    {user?.role === 'admin' ? (
                      <Shield className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border shadow-sm min-h-[calc(100vh-73px)]">
          <div className="p-6">
            {/* Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;