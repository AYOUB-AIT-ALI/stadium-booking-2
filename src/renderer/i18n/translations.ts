export type Lang = 'en' | 'fr';

type TranslationMap = Record<string, { en: string; fr: string }>;

export const translations: TranslationMap = {
  // App
  'app.title': { en: 'Stadium Booking', fr: 'Réservation de Stade' },
  'app.subtitle': { en: 'Premium Edition', fr: 'Édition Premium' },

  // Sidebar
  'nav.today': { en: 'Today', fr: "Aujourd'hui" },
  'nav.addBooking': { en: 'Add Booking', fr: 'Ajouter' },
  'nav.history': { en: 'History', fr: 'Historique' },
  'nav.reports': { en: 'Reports', fr: 'Rapports' },
  'nav.settings': { en: 'Settings', fr: 'Paramètres' },

  // Today page
  'today.title': { en: "Today's Overview", fr: "Aperçu d'Aujourd'hui" },
  'today.bookingsToday': { en: 'Bookings Today', fr: "Réservations Aujourd'hui" },
  'today.revenueToday': { en: 'Revenue Today', fr: "Revenus Aujourd'hui" },
  'today.occupancy': { en: 'Occupancy', fr: "Taux d'Occupation" },
  'today.loading': { en: 'Loading schedule...', fr: 'Chargement du planning...' },
  'today.noSlots': { en: 'No time slots configured for today.', fr: 'Aucun créneau configuré pour aujourd\'hui.' },
  'today.available': { en: 'Available', fr: 'Disponible' },
  'today.booked': { en: 'Booked', fr: 'Réservé' },
  'today.expired': { en: 'Expired', fr: 'Expiré' },
  'today.bookNow': { en: 'Book Now ➜', fr: 'Réserver ➜' },
  'today.slotPassed': { en: 'This time slot has passed.', fr: 'Ce créneau est passé.' },

  // Add Booking page
  'addBooking.title': { en: 'New Booking', fr: 'Nouvelle Réservation' },
  'addBooking.subtitle': { en: 'Create a new stadium booking', fr: 'Créer une nouvelle réservation' },
  'addBooking.clientName': { en: 'Client Name', fr: 'Nom du Client' },
  'addBooking.phone': { en: 'Phone Number', fr: 'Numéro de Téléphone' },
  'addBooking.date': { en: 'Date', fr: 'Date' },
  'addBooking.startTime': { en: 'Start Time', fr: 'Heure de Début' },
  'addBooking.endTime': { en: 'End Time', fr: 'Heure de Fin' },
  'addBooking.price': { en: 'Price', fr: 'Prix' },
  'addBooking.notes': { en: 'Notes', fr: 'Notes' },
  'addBooking.markAsPaid': { en: 'Mark as paid', fr: 'Marquer comme payé' },
  'addBooking.cancel': { en: 'Cancel', fr: 'Annuler' },
  'addBooking.create': { en: 'Create Booking', fr: 'Créer la Réservation' },
  'addBooking.creating': { en: 'Creating...', fr: 'Création...' },
  'addBooking.selectStart': { en: 'Select start time', fr: 'Sélectionnez l\'heure' },
  'addBooking.bookedBy': { en: 'Booked by', fr: 'Réservé par' },
  'addBooking.requiredFields': { en: 'Please fill in all required fields.', fr: 'Veuillez remplir tous les champs obligatoires.' },
  'addBooking.placeholderClient': { en: 'Enter client name', fr: 'Entrez le nom du client' },
  'addBooking.placeholderPhone': { en: '0612345678', fr: '0612345678' },
  'addBooking.placeholderNotes': { en: 'Additional notes...', fr: 'Notes supplémentaires...' },
  'addBooking.placeholderPrice': { en: '0.00', fr: '0.00' },

  // Booking History
  'history.title': { en: 'Booking History', fr: 'Historique des Réservations' },
  'history.subtitle': { en: 'Manage and review all bookings', fr: 'Gérer et consulter toutes les réservations' },
  'history.searchPlaceholder': { en: 'Search by name, phone or booking #...', fr: 'Recherche par nom, téléphone ou n° réservation...' },
  'history.search': { en: 'Search', fr: 'Rechercher' },
  'history.loading': { en: 'Loading...', fr: 'Chargement...' },
  'history.noBookings': { en: 'No bookings found.', fr: 'Aucune réservation trouvée.' },
  'history.deleteConfirm': { en: 'Delete booking #{0}? This action cannot be undone.', fr: 'Supprimer la réservation #{0} ? Cette action est irréversible.' },
  'history.deleteTitle': { en: 'Delete booking', fr: 'Supprimer la réservation' },
  'history.downloadTitle': { en: 'Download receipt', fr: 'Télécharger le reçu' },
  // Table headers
  'history.colBooking': { en: 'BOOKING #', fr: 'N° RÉSERVATION' },
  'history.colClient': { en: 'CLIENT', fr: 'CLIENT' },
  'history.colPhone': { en: 'PHONE', fr: 'TÉLÉPHONE' },
  'history.colDate': { en: 'DATE', fr: 'DATE' },
  'history.colTime': { en: 'TIME SLOT', fr: 'CRÉNEAU' },
  'history.colPrice': { en: 'PRICE', fr: 'PRIX' },
  'history.colStatus': { en: 'STATUS', fr: 'STATUT' },
  'history.colActions': { en: 'ACTIONS', fr: 'ACTIONS' },

  // Reports
  'reports.title': { en: 'Monthly Reports', fr: 'Rapports Mensuels' },
  'reports.totalRevenue': { en: 'Total Revenue', fr: 'Revenu Total' },
  'reports.totalBookings': { en: 'Total Bookings', fr: 'Nombre de Réservations' },
  'reports.uniqueClients': { en: 'Unique Clients', fr: 'Clients Uniques' },
  'reports.dailyRevenue': { en: 'Daily Revenue', fr: 'Revenus Quotidiens' },
  'reports.topClients': { en: 'Top Clients', fr: 'Meilleurs Clients' },
  'reports.popularSlots': { en: 'Popular Time Slots', fr: 'Créneaux Populaires' },
  'reports.allBookings': { en: 'All Bookings', fr: 'Toutes les Réservations' },
  'reports.noData': { en: 'No data available', fr: 'Aucune donnée disponible' },
  'reports.revenue': { en: 'Revenue', fr: 'Revenu' },

  // Settings
  'settings.title': { en: 'Settings', fr: 'Paramètres' },
  'settings.subtitle': { en: 'Configure your stadium and application', fr: 'Configurer votre stade et l\'application' },
  'settings.stadiumInfo': { en: 'Stadium Information', fr: 'Informations du Stade' },
  'settings.stadiumName': { en: 'Stadium Name', fr: 'Nom du Stade' },
  'settings.phone': { en: 'Phone', fr: 'Téléphone' },
  'settings.address': { en: 'Address', fr: 'Adresse' },
  'settings.operatingHours': { en: 'Operating Hours', fr: 'Horaires d\'Ouverture' },
  'settings.openTime': { en: 'Open Time', fr: 'Ouverture' },
  'settings.closeTime': { en: 'Close Time', fr: 'Fermeture' },
  'settings.slotUnit': { en: 'Slot (min)', fr: 'Durée (min)' },
  'settings.save': { en: 'Save Settings', fr: 'Enregistrer' },
  'settings.saving': { en: 'Saving...', fr: 'Enregistrement...' },
  'settings.saved': { en: 'Settings saved successfully!', fr: 'Paramètres enregistrés avec succès !' },
  'settings.failed': { en: 'Failed to save settings.', fr: 'Échec de l\'enregistrement des paramètres.' },
  'settings.language': { en: 'Language', fr: 'Langue' },
  'settings.languageLabel': { en: 'Application Language', fr: 'Langue de l\'Application' },
};

export function t(key: string, lang: Lang, ...args: string[]): string {
  const entry = translations[key];
  if (!entry) return key;
  let text = entry[lang];
  args.forEach((arg, i) => {
    text = text.replace(`{${i}}`, arg);
  });
  return text;
}
