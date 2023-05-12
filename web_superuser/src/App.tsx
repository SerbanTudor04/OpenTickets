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
import React from "react";
import ClientsPage, { CreateClient, CreateNote, EditClient } from "./pages/Clients";

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
           <Route
            path="/management/clients"
            element={
              <ProtectedRoute>
                <ClientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/management/clients/create"
            element={
              <ProtectedRoute>
                <CreateClient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/management/clients/:uid"
            element={
              <ProtectedRoute>
                <EditClient />
              </ProtectedRoute>
            }
          />
           <Route
            path="/management/clients/:uid/notes/create"
            element={
              <ProtectedRoute>
                <CreateNote />
              </ProtectedRoute>
            }
          />
        </Routes>

      </Layout>
    </>
  );
}

export default App;
