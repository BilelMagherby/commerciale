import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, TableContainer, THead, TBody, Tr, Th, Td, Modal } from "../components/ui/SharedUI";
import { Building2, ShieldAlert, Save, Download, Upload, Shield, RefreshCw } from "lucide-react";

export default function Parametres() {
  const {
    societe,
    updateSocieteRecord,
    utilisateurs,
    updateUserPermissions,
    triggerManualBackup,
    importBackupData,
    addToast
  } = useApp();

  // Company details form state
  const [nom, setNom] = useState(societe.nom);
  const [adresse, setAdresse] = useState(societe.adresse);
  const [telephone, setTelephone] = useState(societe.telephone);
  const [email, setEmail] = useState(societe.email);
  const [logo, setLogo] = useState(societe.logo);

  // User Permissions Modal State
  const [editingUser, setEditingUser] = useState(null); // User object or null
  const [permissions, setPermissions] = useState({});

  // Auto-backup state
  const [autoBackup, setAutoBackup] = useState(() => {
    return localStorage.getItem("erp-auto-backup") === "true";
  });

  const handleSaveSociete = (e) => {
    e.preventDefault();
    updateSocieteRecord({ nom, adresse, telephone, email, logo });
  };

  const handleOpenPermissions = (user) => {
    setEditingUser(user);
    setPermissions({ ...user.permissions });
  };

  const handleTogglePermission = (moduleName) => {
    setPermissions(prev => ({
      ...prev,
      [moduleName]: !prev[moduleName]
    }));
  };

  const handleSavePermissions = () => {
    updateUserPermissions(editingUser.id, permissions);
    setEditingUser(null);
  };

  const handleToggleAutoBackup = () => {
    const nextVal = !autoBackup;
    setAutoBackup(nextVal);
    localStorage.setItem("erp-auto-backup", String(nextVal));
    addToast("info", "Sauvegarde Auto", `Sauvegarde automatique locale ${nextVal ? "activée" : "désactivée"}.`);
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backupObj = JSON.parse(event.target.result);
        const ok = importBackupData(backupObj);
        if (ok) {
          // Refresh page or details
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (err) {
        addToast("destructive", "Restauration échouée", "Le fichier importé n'est pas un JSON valide.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-3xl tracking-tight text-foreground m-0">
          Paramètres du Système
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configurez votre entreprise, gérez les habilitations des utilisateurs et lancez les processus de sauvegarde.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Company info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-foreground border-b border-border/60 pb-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Identité Société</span>
            </div>

            <form onSubmit={handleSaveSociete} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-muted-foreground">Raison Sociale</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-muted-foreground">Adresse Siège</label>
                <textarea
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  rows="2"
                  className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-muted-foreground">Téléphone</label>
                <input
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-muted-foreground">Email Contact</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-muted-foreground">URL Logo d'entreprise</label>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg shadow-sm transition-all active:scale-95 text-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder les détails</span>
              </button>
            </form>
          </Card>
        </div>

        {/* Right Columns: Users permissions & Backups */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Users */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-foreground">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>Collaborateurs & Habilitations</span>
              </div>
            </div>

            <TableContainer>
              <THead>
                <Tr>
                  <Th>Nom / Email</Th>
                  <Th>Rôle ERP</Th>
                  <Th>Statut</Th>
                  <Th className="text-center">Action</Th>
                </Tr>
              </THead>
              <TBody>
                {utilisateurs.map((u) => (
                  <Tr key={u.id}>
                    <Td>
                      <div className="font-semibold">{u.nom}</div>
                      <div className="text-[10px] text-muted-foreground">{u.email}</div>
                    </Td>
                    <Td>
                      <span className="text-[10px] font-bold bg-slate-500/10 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                        {u.role}
                      </span>
                    </Td>
                    <Td>
                      <span className="inline-flex items-center h-2 w-2 rounded-full bg-emerald-500 mr-1.5" />
                      <span className="text-[10px] text-muted-foreground font-semibold">Actif</span>
                    </Td>
                    <Td className="text-center">
                      <button
                        onClick={() => handleOpenPermissions(u)}
                        className="px-2.5 py-1 text-[10px] font-bold bg-secondary hover:bg-indigo-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                      >
                        Permissions
                      </button>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </TableContainer>
          </Card>

          {/* Section: Backups */}
          <Card className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-foreground border-b border-border/60 pb-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Sauvegardes de Sécurité</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-muted-foreground">
              {/* Export/Import panel */}
              <div className="space-y-4">
                <p className="leading-relaxed">
                  Exportez l'intégralité de la base de données ERP simulée au format JSON. Vous pourrez réimporter ce fichier ultérieurement pour restaurer l'état de l'application.
                </p>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={triggerManualBackup}
                    className="inline-flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-2 rounded-lg transition-all active:scale-95 cursor-pointer text-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Sauvegarde Manuelle</span>
                  </button>

                  <label className="inline-flex items-center justify-center space-x-1.5 bg-secondary hover:bg-secondary/80 border border-border text-foreground font-semibold px-3 py-2 rounded-lg transition-all active:scale-95 cursor-pointer text-xs">
                    <Upload className="w-4 h-4" />
                    <span>Restaurer JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Autosaver config */}
              <div className="p-4 bg-secondary/50 rounded-xl space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-foreground text-xs">Sauvegarde Automatique</h4>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                    Sauvegarde automatique locale instantanée en mémoire cache (`localStorage`) après chaque nouvelle saisie (Ventes, Achats, etc.).
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Sauvegarde automatique locale :</span>
                  <button
                    onClick={handleToggleAutoBackup}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer
                      ${autoBackup ? "bg-indigo-600" : "bg-border"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${autoBackup ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>
              </div>

            </div>
          </Card>
        </div>

      </div>

      {/* Permissions Modal Editor */}
      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title={`Droits d'accès : ${editingUser?.nom}`}>
        {editingUser && (
          <div className="space-y-4 text-xs">
            <p className="text-muted-foreground mb-4">
              Cochez les modules ERP auxquels cet utilisateur est habilité à accéder et modifier.
            </p>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {Object.keys(permissions).map((moduleKey) => (
                <div key={moduleKey} className="flex items-center justify-between p-2 hover:bg-secondary rounded-lg transition-colors">
                  <span className="font-semibold text-foreground">{moduleKey}</span>
                  <input
                    type="checkbox"
                    checked={permissions[moduleKey]}
                    onChange={() => handleTogglePermission(moduleKey)}
                    className="h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="flex space-x-3 pt-4 border-t border-border mt-6">
              <button
                onClick={handleSavePermissions}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm hover:shadow active:scale-95 transition-all text-xs cursor-pointer"
              >
                Appliquer les Permissions
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors text-xs cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
