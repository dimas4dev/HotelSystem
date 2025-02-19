import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import Reservations from "./pages/Reservations";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/hotels" component={Hotels} />
          <Route path="/reservations" component={Reservations} />
          <Route>404 - Not Found</Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
