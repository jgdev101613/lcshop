// React
import { Navigate, Route, Routes } from "react-router";

// Hooks
import useUserSync from "./hooks/useUserSync";
import useAuthRequest from "./hooks/useAuthRequest";

// Clerk
import { useUser } from "@clerk/react";

// Pages/Components
import ProfileCompletion from "./components/ProfileCompletion";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";

const App = () => {
  const { isClerkLoaded, isSignedIn } = useAuthRequest();
  const { user } = useUser();

  useUserSync();

  if (!isClerkLoaded) return null;

  const hasName = user?.fullName || user?.firstName;

  if (isSignedIn && !hasName) {
    return <ProfileCompletion />;
  }

  console.log(user.externalAccounts);
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route
            path="/profile"
            element={isSignedIn ? <ProfilePage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/create"
            element={isSignedIn ? <CreatePage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/edit/:id"
            element={isSignedIn ? <EditPage /> : <Navigate to={"/"} />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
