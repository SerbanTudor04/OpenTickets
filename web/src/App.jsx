import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layouts/layout";
import ProtectedRoute from "./layouts/ProtectedRoute";

import Authenticate from "./pages/Authenticate";
import ADashboard from "./pages/ADashboard";
import AInbox from "./pages/AInbox";
import AMgmUsers from "./pages/AMgmUsers";
import ADepartment from "./pages/AMgmDepartment";
import ADepartmentsTickets from "./pages/ADepartmentsTickets";
import ACreateTicket from "./pages/ACreateTicket";
import AViewTicket from "./pages/AViewTicket";
import AMyTickets from "./pages/AMyTickets";
import APendingTickets from "./pages/APendingTickets";
import AFreeTickets from "./pages/AFreeTickets";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/admin/authenticate" element={<Authenticate />} />
            <Route
              path="/admin/"
              element={
                <ProtectedRoute>
                  <ADashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <ADashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/inbox"
              element={
                <ProtectedRoute>
                  <AInbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/management/users"
              element={
                <ProtectedRoute>
                  <AMgmUsers />
                </ProtectedRoute>
              }
            /> 
            <Route
            path="/admin/management/departments"
            element={
              <ProtectedRoute>
                <ADepartment />
              </ProtectedRoute>
            }
          />
            <Route
              path="/admin/tickets/mydepartments"
              element={
                <ProtectedRoute>
                  <ADepartmentsTickets />
                </ProtectedRoute>
              }
            />            
            <Route
            path="/admin/tickets/create"
            element={
              <ProtectedRoute>
                <ACreateTicket />
              </ProtectedRoute>
            }
          />
           <Route
            path="/admin/tickets/view/:id"
            element={
              <ProtectedRoute>
                <AViewTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tickets/mytickets"
            element={
              <ProtectedRoute>
                <AMyTickets />
              </ProtectedRoute>
            }
          />
            <Route
            path="/admin/tickets/pending-tickets"
            element={
              <ProtectedRoute>
                <APendingTickets />
              </ProtectedRoute>
            }
          />
           <Route
            path="/admin/tickets/free-tickets"
            element={
              <ProtectedRoute>
                <AFreeTickets />
              </ProtectedRoute>
            }
          />
        </Routes>

      </Layout>
    </>
  );
}

export default App;
