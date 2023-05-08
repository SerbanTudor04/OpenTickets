import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layouts/layout";
import ProtectedRoute from "./layouts/ProtectedRoute";
import Authenticate from "./pages/Authenticate";
import ADashboard from "./pages/ADashboard";
import AInbox from "./pages/AInbox";
import ADepartmentsTickets from "./pages/ADepartmentsTickets";
import ACreateTicket from "./pages/ACreateTicket";
import AViewTicket from "./pages/AViewTicket";
import AMyTickets from "./pages/AMyTickets";
import APendingTickets from "./pages/APendingTickets";
import AFreeTickets from "./pages/AFreeTickets";
import AHelp from "./pages/AHelp";
import ADocumentation from "./pages/ADocumentation";

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
              path="/help"
              element={
                <ProtectedRoute>
                  <AHelp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documentation"
              element={
                <ProtectedRoute>
                  <ADocumentation />
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
              path="/tickets/mydepartments"
              element={
                <ProtectedRoute>
                  <ADepartmentsTickets />
                </ProtectedRoute>
              }
            />            
            <Route
            path="/tickets/create"
            element={
              <ProtectedRoute>
                <ACreateTicket />
              </ProtectedRoute>
            }
          />
           <Route
            path="/tickets/view/:id"
            element={
              <ProtectedRoute>
                <AViewTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/mytickets"
            element={
              <ProtectedRoute>
                <AMyTickets />
              </ProtectedRoute>
            }
          />
            <Route
            path="/tickets/pending-tickets"
            element={
              <ProtectedRoute>
                <APendingTickets />
              </ProtectedRoute>
            }
          />
           <Route
            path="/tickets/free-tickets"
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
