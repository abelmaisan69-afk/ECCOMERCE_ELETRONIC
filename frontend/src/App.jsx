import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";

import {
    Routes,
    Route,
} from "react-router";



function App() {
    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/products/:id"
                    element={<ProductDetail />}
                />

    <Route
    path="/cart"
    element={<Cart />}
/>

<Route
    path="/login"
    element={<Login />}
/>

<Route
    path="/register"
    element={<Register />}
/>

<Route
    path="/checkout"
    element={
        <ProtectedRoute>
            <Checkout />
        </ProtectedRoute>
    }
/>

            </Routes>

        </div>
    );
}

export default App;