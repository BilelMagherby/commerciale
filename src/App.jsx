import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/Layout";

// Import modules
import Dashboard from "./modules/Dashboard";
import Achats from "./modules/Achats";
import Ventes from "./modules/Ventes";
import Paiements from "./modules/Paiements";
import Commandes from "./modules/Commandes";
import Depenses from "./modules/Depenses";
import Historique from "./modules/Historique";
import Rapports from "./modules/Rapports";
import Parametres from "./modules/Parametres";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/achats" element={<Achats />} />
            <Route path="/ventes" element={<Ventes />} />
            <Route path="/paiements" element={<Paiements />} />
            <Route path="/commandes" element={<Commandes />} />
            <Route path="/depenses" element={<Depenses />} />
            <Route path="/historique" element={<Historique />} />
            <Route path="/rapports" element={<Rapports />} />
            <Route path="/parametres" element={<Parametres />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}
