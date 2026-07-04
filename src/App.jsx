import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { AppProvider } from "./context/AppContext";
import store from "./store/store";
import Layout from "./components/Layout";

// Import modules
import Dashboard from "./modules/Dashboard";
import Achats from "./modules/Achats";
import Ventes from "./modules/Ventes";
import Paiements from "./modules/Paiements";
import RH from "./modules/RH";
import Depenses from "./modules/Depenses";
import Historique from "./modules/Historique";
import Rapports from "./modules/Rapports";

export default function App() {
  return (
    <Provider store={store}>
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/achats" element={<Achats />} />
              <Route path="/ventes" element={<Ventes />} />
              <Route path="/paiements" element={<Paiements />} />
              <Route path="/rh" element={<RH />} />
              <Route path="/depenses" element={<Depenses />} />
              <Route path="/historique" element={<Historique />} />
              <Route path="/rapports" element={<Rapports />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </Provider>
  );
}
