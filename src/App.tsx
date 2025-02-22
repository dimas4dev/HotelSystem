import { Route, Switch, Redirect } from "wouter";
import { useAuthStore } from "./store/useAuthStore";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import Reservations from "./pages/Reservations";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageHotels from "./pages/Admin/ManageHotels";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ component: Component, adminOnly }: { component: any; adminOnly?: boolean }) => {
  const { user } = useAuthStore();

  if (!user) return <Redirect to="/login" />;
  if (adminOnly && user.role !== "admin") return <Redirect to="/" />;

  return <Component />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/hotels" component={Hotels} />
          <Route path="/reservations" component={Reservations} />
          <Route path="/login" component={Login} />
          {/* Panel de administración - Solo Admins */}
          <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboard} adminOnly />} />
          <Route path="/admin/hotels" component={() => <ProtectedRoute component={ManageHotels} adminOnly />} />
          <Route>404 - Not Found</Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
