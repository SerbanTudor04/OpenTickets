import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layouts/layout";
import ProtectedRoute from "./layouts/ProtectedRoute";

import Authenticate from "./pages/Authenticate";
import ADashboard from "./pages/ADashboard";
import AInbox from "./pages/AInbox";
import AMgmUsers, { CreateUser, EditUser } from "./pages/AMgmUsers";
import ADepartment, { CreateDepartment, EditDepartment } from "./pages/AMgmDepartment";
import AMgmConfig from "./pages/AMgmConfig";
import AMgmTemplates, { BlocksCreate, EditBlocks, EditTemplate, TemplatesCreate } from "./pages/AMgmTemplates";
import React from "react";
import ClientsPage, { CreateClient, CreateMailboxDomains as CreateMailboxDomains, CreateMailboxEmails, CreateNote, EditClient } from "./pages/Clients";

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
              path="/management/users"
              element={
                <ProtectedRoute>
                  <AMgmUsers />
                </ProtectedRoute>
              }
            /> 
            <Route
              path="/management/users/create"
              element={
                <ProtectedRoute>
                  <CreateUser />
                </ProtectedRoute>
              }
            /> 
            <Route
            path="/management/users/:id"
              element={
                <ProtectedRoute>
                  <EditUser />
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
            path="/management/departments/create"
            element={
              <ProtectedRoute>
                <CreateDepartment />
              </ProtectedRoute>
            }
          />
                      <Route
            path="/management/departments/:id"
            element={
              <ProtectedRoute>
                <EditDepartment />
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
            path="/management/templates/create"
            element={
              <ProtectedRoute>
                <TemplatesCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/management/templates/:id"
            element={
              <ProtectedRoute>
                <EditTemplate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/management/templates/blocks/create"
            element={
              <ProtectedRoute>
                <BlocksCreate />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/management/templates/blocks/:id"
            element={
              <ProtectedRoute>
                <EditBlocks />
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
        <Route
            path="/management/clients/:uid/mailboxes/domains/create"
            element={
              <ProtectedRoute>
                <CreateMailboxDomains />
              </ProtectedRoute>
            }
          />
        <Route
            path="/management/clients/:uid/mailboxes/emails/create"
            element={
              <ProtectedRoute>
                <CreateMailboxEmails />
              </ProtectedRoute>
            }
          />

        </Routes>
        

      </Layout>
    </>
  );
}

export default App;
