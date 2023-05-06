import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layouts/layout";
import ProtectedRoute from "./layouts/ProtectedRoute";

import Authenticate from "./pages/Authenticate";
import ADashboard from "./pages/ADashboard";
import AInbox from "./pages/AInbox";
import AMgmUsers from "./pages/AMgmUsers";
import ADepartment from "./pages/AMgmDepartment";
import AMgmConfig from "./pages/AMgmConfig";
import AMgmTemplates from "./pages/AMgmTemplates";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/authenticate" element={<Authenticate />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ADashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ADashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <AInbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/management/users"
              element={
                <ProtectedRoute>
                  <AMgmUsers />
                </ProtectedRoute>
              }
            /> 
            <Route
            path="/management/departments"
            element={
              <ProtectedRoute>
                <ADepartment />
              </ProtectedRoute>
            }
          />
            <Route
            path="/management/config"
            element={
              <ProtectedRoute>
                <AMgmConfig />
              </ProtectedRoute>
            }
            />
          <Route
            path="/management/templates"
            element={
              <ProtectedRoute>
                <AMgmTemplates />
              </ProtectedRoute>
            }
          />
           
                   
        </Routes>

      </Layout>
    </>
  );
}

export default App;
