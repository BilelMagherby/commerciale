import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Printer, Building, Eye } from 'lucide-react';
import { useTable, useFilter, useModal, useForm } from '../hooks';
import {
  TableContainer,
  Button,
  Card,
  Tabs,
  FilterBar,
  Modal,
  Badge,
} from '../components/common';
import { setAchats, addAchat } from '../store/slices/achatsSlice';
import { setFournisseurs } from '../store/slices/fournisseursSlice';
import { usePrint } from '../components/print/usePrint';
import {
  AchatsListPrintTemplate,
  AchatDetailPrintTemplate,
  BonCommandePrintTemplate,
} from '../components/print/templates/AchatsPrintTemplate';

// Sub-component: Achat Form
const AchatForm = ({ onSubmit, onCancel, fournisseurs }) => {
  const { values, errors, handleChange, handleSubmit, resetForm } = useForm(
    {
      fournisseur: '',
      montant: '',
      date: new Date().toISOString().split('T')[0],
      statut: 'En attente',
    },
    {},
    onSubmit
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1 text-muted-foreground">Fournisseur</label>
          <select
            name="fournisseur"
            value={values.fournisseur}
            onChange={handleChange}
            className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
          >
            <option value="">Sélectionner...</option>
            {fournisseurs.map((f) => (
              <option key={f.id} value={f.nom}>
                {f.nom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-muted-foreground">Montant (€)</label>
          <input
            type="number"
            name="montant"
            value={values.montant}
            onChange={handleChange}
            className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-muted-foreground">Date</label>
          <input
            type="date"
            name="date"
            value={values.date}
            onChange={handleChange}
            className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-muted-foreground">Statut</label>
          <select
            name="statut"
            value={values.statut}
            onChange={handleChange}
            className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
          >
            <option value="Payé">Payé</option>
            <option value="En attente">En attente</option>
            <option value="Partiel">Partiel</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-3 pt-4 border-t border-border">
        <Button type="submit" className="flex-1">
          Enregistrer
        </Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
      </div>
    </form>
  );
};

// Sub-component: Achat Details Modal
const AchatDetailsModal = ({ achat, fournisseur, onClose, onPrint }) => {
  return (
    <Modal isOpen={!!achat} onClose={onClose} title="Détails de l'Achat" size="md">
      {achat && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground font-semibold">Référence</p>
              <p className="font-bold text-foreground">{achat.reference}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-semibold">Fournisseur</p>
              <p className="font-medium text-foreground">{achat.fournisseur}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-semibold">Date</p>
              <p className="text-foreground">{achat.date}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-semibold">Montant</p>
              <p className="font-bold text-foreground">
                {achat.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </p>
            </div>
            <div>
              <p className="text-muted-foreground font-semibold">Statut</p>
              <Badge status={achat.statut} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button icon={Printer} onClick={onPrint}>
              Imprimer
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// Sub-component: Fournisseur Card
const FournisseurCard = ({ fournisseur, onViewDetails }) => {
  return (
    <Card
      title={fournisseur.nom}
      subtitle="Partenaire"
      icon={Building}
      hoverable
      action={
        <Button variant="ghost" size="sm" icon={Eye} onClick={() => onViewDetails(fournisseur)}>
          Voir détails
        </Button>
      }
    >
      <div className="space-y-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
        <p>Téléphone: {fournisseur.telephone}</p>
        <p>Email: {fournisseur.email}</p>
        <p>Adresse: {fournisseur.adresse}</p>
      </div>
      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            Solde Dû
          </span>
          <p
            className={`font-heading font-extrabold text-sm ${
              fournisseur.solde > 0 ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {fournisseur.solde.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </p>
        </div>
      </div>
    </Card>
  );
};

// Main Achats Component
export default function AchatsRefactored() {
  const dispatch = useDispatch();
  const { printDocument } = usePrint();
  
  // Redux state
  const achats = useSelector((state) => state.achats.achats);
  const fournisseurs = useSelector((state) => state.fournisseurs.fournisseurs);
  const bonsCommande = useSelector((state) => state.achats.bonsCommande);
  const facturesAchat = useSelector((state) => state.achats.facturesAchat);

  // Custom hooks
  const { isOpen: isModalOpen, modalData, openModal, closeModal } = useModal();
  const [selectedAchat, setSelectedAchat] = React.useState(null);
  const [selectedFournisseur, setSelectedFournisseur] = React.useState(null);

  // Filter hook
  const { filteredData: filteredAchats, filters, setFilter, searchQuery, setSearchQuery, clearAllFilters } =
    useFilter(achats, { fournisseur: '' });

  // Table hook
  const {
    data: tableData,
    currentPage,
    pageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    sortBy,
    sortOrder,
    handleSort,
  } = useTable(filteredAchats, { initialPageSize: 10 });

  // Tab state
  const [activeTab, setActiveTab] = React.useState('achats');

  // Initialize data (in real app, this would come from API)
  React.useEffect(() => {
    // This is just for demonstration - in real app, data would come from API
    if (achats.length === 0) {
      // Mock data initialization would happen here
    }
  }, []);

  // Handlers
  const handleCreateAchat = (formData) => {
    const newAchat = {
      id: Date.now(),
      reference: `ACH-${Date.now()}`,
      ...formData,
      montant: parseFloat(formData.montant),
    };
    dispatch(addAchat(newAchat));
    closeModal();
  };

  const handlePrint = () => {
    const printContent = AchatsListPrintTemplate({
      achats: filteredAchats,
      period: 'Tout',
      documentNumber: `ACH-${new Date().toISOString().split('T')[0]}`,
    });
    printDocument(printContent, 'Rapport des Achats');
  };

  const handleViewAchatDetails = (achat) => {
    setSelectedAchat(achat);
    openModal(achat, 'achat');
  };

  const handlePrintAchatDetails = () => {
    if (!selectedAchat) return;
    const fournisseur = fournisseurs.find((f) => f.nom === selectedAchat.fournisseur);
    const printContent = AchatDetailPrintTemplate({ achat: selectedAchat, fournisseur });
    printDocument(printContent, `Achat-${selectedAchat.reference}`);
  };

  // Table columns definition
  const achatColumns = [
    { key: 'reference', label: 'Référence', sortable: true, className: 'font-bold text-indigo-600' },
    { key: 'fournisseur', label: 'Fournisseur', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'montant',
      label: 'Montant',
      sortable: true,
      align: 'right',
      render: (value) => `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`,
    },
    {
      key: 'statut',
      label: 'Statut',
      sortable: true,
      render: (value) => <Badge status={value} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_, row) => (
        <Button variant="ghost" size="sm" icon={Eye} onClick={() => handleViewAchatDetails(row)}>
          Détails
        </Button>
      ),
    },
  ];

  const tabs = [
    { id: 'achats', label: 'Achats' },
    { id: 'fournisseurs', label: 'Fournisseurs' },
    { id: 'bons', label: 'Bons de commande' },
    { id: 'factures', label: 'Factures Achat' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-foreground m-0">
            Achats & Logistique
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez vos commandes fournisseurs, factures de frais et catalogues partenaires.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button icon={Plus} onClick={() => openModal(null, 'create')}>
            Nouvel Achat
          </Button>
          <Button variant="secondary" icon={Printer} onClick={handlePrint}>
            Imprimer
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'achats' && (
          <>
            <FilterBar
              filters={[
                {
                  key: 'fournisseur',
                  label: 'Fournisseur',
                  type: 'select',
                  value: filters.fournisseur,
                  options: [
                    { value: '', label: 'Tous' },
                    ...fournisseurs.map((f) => ({ value: f.nom, label: f.nom })),
                  ],
                },
              ]}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearFilters={clearAllFilters}
              hasActiveFilters={filters.fournisseur !== '' || searchQuery !== ''}
            />
            <TableContainer
              columns={achatColumns}
              data={tableData}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              totalItems={filteredAchats.length}
            />
          </>
        )}

        {activeTab === 'fournisseurs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fournisseurs.map((fournisseur) => (
              <FournisseurCard
                key={fournisseur.id}
                fournisseur={fournisseur}
                onViewDetails={setSelectedFournisseur}
              />
            ))}
          </div>
        )}

        {activeTab === 'bons' && (
          <div className="text-center py-8 text-muted-foreground">
            Fonctionnalité en développement
          </div>
        )}

        {activeTab === 'factures' && (
          <div className="text-center py-8 text-muted-foreground">
            Fonctionnalité en développement
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen && modalData === 'create'}
        onClose={closeModal}
        title="Nouvel Achat"
        size="md"
      >
        <AchatForm onSubmit={handleCreateAchat} onCancel={closeModal} fournisseurs={fournisseurs} />
      </Modal>

      <AchatDetailsModal
        achat={selectedAchat}
        fournisseur={selectedAchat ? fournisseurs.find((f) => f.nom === selectedAchat.fournisseur) : null}
        onClose={() => setSelectedAchat(null)}
        onPrint={handlePrintAchatDetails}
      />
    </div>
  );
}
