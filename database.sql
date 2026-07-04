-- Database Schema for Commercial Software
-- MySQL / MariaDB

-- Create database
CREATE DATABASE IF NOT EXISTS `commerciale_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `commerciale_db`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Drop existing tables if they exist (in reverse order of dependencies)
--

DROP TABLE IF EXISTS `paiements`;
DROP TABLE IF EXISTS `vente_items`;
DROP TABLE IF EXISTS `ventes`;
DROP TABLE IF EXISTS `devis_items`;
DROP TABLE IF EXISTS `devis`;
DROP TABLE IF EXISTS `produits`;
DROP TABLE IF EXISTS `utilisateurs`;
DROP TABLE IF EXISTS `parametres`;
DROP TABLE IF EXISTS `clients`;

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_client` enum('Particulier','Entreprise') DEFAULT 'Particulier',
  `nom` varchar(255) NOT NULL,
  `nom_commercial` varchar(255) DEFAULT NULL,
  `responsable` varchar(255) DEFAULT NULL,
  `cin` varchar(50) DEFAULT NULL,
  `matricule_fiscal` varchar(50) DEFAULT NULL,
  `registre_commerce` varchar(50) DEFAULT NULL,
  `tva` varchar(50) DEFAULT NULL,
  `statut` enum('Actif','Inactif','Suspendu') DEFAULT 'Actif',
  `telephone_principal` varchar(50) DEFAULT NULL,
  `telephone_secondaire` varchar(50) DEFAULT NULL,
  `whatsapp` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `site_web` varchar(255) DEFAULT NULL,
  `gouvernorat` varchar(100) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `delegation` varchar(100) DEFAULT NULL,
  `code_postal` varchar(20) DEFAULT NULL,
  `adresse_complete` text DEFAULT NULL,
  `adresse_chantier` text DEFAULT NULL,
  `commercial_responsable` varchar(255) DEFAULT NULL,
  `source_client` enum('Facebook','Instagram','TikTok','Google','Recommandation','Passage magasin','Architecte','Autre') DEFAULT NULL,
  `priorite` enum('Haute','Normale','Faible') DEFAULT 'Normale',
  `categorie` enum('VIP','Standard','Revendeur') DEFAULT 'Standard',
  `plafond_credit` decimal(15,2) DEFAULT NULL,
  `solde_initial` decimal(15,2) DEFAULT NULL,
  `devise` enum('EUR','USD','TND') DEFAULT 'EUR',
  `conditions_paiement` enum('Comptant','30 jours','60 jours','90 jours') DEFAULT 'Comptant',
  `remise_defaut` decimal(5,2) DEFAULT NULL,
  `projet_nom` varchar(255) DEFAULT NULL,
  `projet_type` enum('Cuisine','Salle de Bain','Escalier','Sol','Mur','Façade','Plan de Travail','Hôtel','Villa','Appartement','Bureau','Autre') DEFAULT NULL,
  `adresse_chantier_projet` text DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_livraison` date DEFAULT NULL,
  `surface_estimee` decimal(10,2) DEFAULT NULL,
  `budget_estime` decimal(15,2) DEFAULT NULL,
  `architecte` varchar(255) DEFAULT NULL,
  `entreprise_responsable` varchar(255) DEFAULT NULL,
  `type_pierre` enum('Marbre','Granit','Quartz','Travertin','Calcaire','Ardoise') DEFAULT 'Marbre',
  `couleur_preferee` varchar(100) DEFAULT NULL,
  `finition` enum('Poli','Brossé','Sablé','Flammé','Antique') DEFAULT 'Poli',
  `epaisseur` enum('1 cm','2 cm','3 cm','4 cm') DEFAULT '2 cm',
  `observations` text DEFAULT NULL,
  `instructions_particulieres` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_nom` (`nom`),
  KEY `idx_statut` (`statut`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ventes`
--

CREATE TABLE `ventes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `facture` varchar(100) NOT NULL,
  `client_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `total` decimal(15,2) NOT NULL DEFAULT 0.00,
  `statut` enum('Payé','En attente','Annulé','Partiel') DEFAULT 'En attente',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_facture` (`facture`),
  KEY `idx_client_id` (`client_id`),
  KEY `idx_date` (`date`),
  KEY `idx_statut` (`statut`),
  CONSTRAINT `fk_vente_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vente_items`
--

CREATE TABLE `vente_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vente_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `quantite` decimal(10,2) NOT NULL DEFAULT 1.00,
  `prix_unitaire` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_vente_id` (`vente_id`),
  CONSTRAINT `fk_vente_item_vente` FOREIGN KEY (`vente_id`) REFERENCES `ventes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `devis`
--

CREATE TABLE `devis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numero_devis` varchar(100) NOT NULL,
  `client_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `date_validite` date DEFAULT NULL,
  `total` decimal(15,2) NOT NULL DEFAULT 0.00,
  `statut` enum('En attente','Accepté','Refusé','Expiré','Converti en vente') DEFAULT 'En attente',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_numero_devis` (`numero_devis`),
  KEY `idx_client_id` (`client_id`),
  KEY `idx_date` (`date`),
  KEY `idx_statut` (`statut`),
  CONSTRAINT `fk_devis_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `devis_items`
--

CREATE TABLE `devis_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `devis_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `quantite` decimal(10,2) NOT NULL DEFAULT 1.00,
  `prix_unitaire` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_devis_id` (`devis_id`),
  CONSTRAINT `fk_devis_item_devis` FOREIGN KEY (`devis_id`) REFERENCES `devis` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produits` (Products catalog)
--

CREATE TABLE `produits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(100) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type_pierre` enum('Marbre','Granit','Quartz','Travertin','Calcaire','Ardoise','Dekton','Céramique') DEFAULT NULL,
  `couleur` varchar(100) DEFAULT NULL,
  `origine` varchar(100) DEFAULT NULL,
  `finition` enum('Poli','Brossé','Sablé','Flammé','Antique','Adouci','Mat','Bush Hammered') DEFAULT NULL,
  `epaisseur` enum('1 cm','2 cm','3 cm','4 cm','Autre') DEFAULT '2 cm',
  `prix_unitaire` decimal(15,2) NOT NULL DEFAULT 0.00,
  `unite` enum('m²','pièce','mètre','kg') DEFAULT 'm²',
  `stock` decimal(10,2) DEFAULT NULL,
  `statut` enum('Disponible','Rupture','Sur commande') DEFAULT 'Disponible',
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_reference` (`reference`),
  KEY `idx_nom` (`nom`),
  KEY `idx_type_pierre` (`type_pierre`),
  KEY `idx_statut` (`statut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paiements` (Payments tracking)
--

CREATE TABLE `paiements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vente_id` int(11) DEFAULT NULL,
  `devis_id` int(11) DEFAULT NULL,
  `montant` decimal(15,2) NOT NULL,
  `date_paiement` date NOT NULL,
  `mode_paiement` enum('Espèces','Carte bancaire','Virement','Chèque','PayPal','Autre') NOT NULL,
  `reference_paiement` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_vente_id` (`vente_id`),
  KEY `idx_devis_id` (`devis_id`),
  KEY `idx_date_paiement` (`date_paiement`),
  CONSTRAINT `fk_paiement_vente` FOREIGN KEY (`vente_id`) REFERENCES `ventes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_paiement_devis` FOREIGN KEY (`devis_id`) REFERENCES `devis` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `utilisateurs` (Users for admin panel)
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` enum('Admin','Manager','Vendeur','Comptable') DEFAULT 'Vendeur',
  `statut` enum('Actif','Inactif') DEFAULT 'Actif',
  `derniere_connexion` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_statut` (`statut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parametres` (System settings)
--

CREATE TABLE `parametres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cle` varchar(100) NOT NULL,
  `valeur` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_cle` (`cle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Default data for table `parametres`
--

INSERT INTO `parametres` (`cle`, `valeur`, `description`) VALUES
('nom_entreprise', 'Marbre & Pierre', 'Nom de l''entreprise'),
('adresse_entreprise', '123 Rue du Commerce, Tunis', 'Adresse de l''entreprise'),
('telephone_entreprise', '+216 71 123 456', 'Téléphone de l''entreprise'),
('email_entreprise', 'contact@marbre-pierre.tn', 'Email de l''entreprise'),
('iban', 'TN61 1234 5678 9000 1234 5678', 'IBAN bancaire'),
('bic', 'BKBKTNTT', 'Code BIC/SWIFT'),
('tva_defaut', '19', 'Taux de TVA par défaut (%)'),
('devise_defaut', 'TND', 'Devise par défaut');

COMMIT;
