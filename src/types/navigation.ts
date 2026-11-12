/**
 * Global Navigation Param Lists and Types
 */

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string } | undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  GuestHome: undefined;
  /** A listing's full details, opened from the guest home or Similar Deals */
  PropertyDetails: { propertyId: string };
  /** Rental application (step 1: Applicant & Household), opened by Apply Now */
  RentalApplication: { propertyId: string };
  PersonaSelect: undefined;
  RenterHome: undefined;
  /** Unwired (not in the navigator); kept with ResidenceDashboardScreen */
  ResidenceDashboard: { residenceId: string };
  /** "My Home" page of an active lease, opened by "Manage" on My Residences */
  ManageResidence: { residenceId: string };
  /** Maintenance hub, opened by the Maintenance shortcut on the Manage page */
  Maintenance: { residenceId: string };
  /** New maintenance request form, opened by "+ Request" on Maintenance */
  MaintenanceRequest: { residenceId: string };
  /** Every finished request ("View All" on Recently Resolved) */
  ResolvedTickets: { residenceId: string };
  /** One ticket's status, timeline and messages (active or completed) */
  TicketDetails: { residenceId: string; ticketId: string };
  /** Full notification / chat history of a ticket ("View all" on Ticket Details) */
  TicketMessages: { residenceId: string; ticketId: string; tab?: 'notifications' | 'chats' };
  /**
   * inspectionSubmitted is set by the inspection room page on "Finalize Inspection";
   * utilitiesConfirmed by the Utilities page on "Confirm Utilities"
   */
  CheckIn: { residenceId: string; inspectionSubmitted?: boolean; utilitiesConfirmed?: boolean };
  /** Move-in utilities list (Electricity, Water, Gas, Sewer) */
  Utilities: { residenceId: string };
  /** Providers for one utility (information only) */
  UtilityProviders: { residenceId: string; utilityId: string };
  /** Unwired (not in the navigator); kept with InspectionScreen */
  Inspection: { residenceId: string };
  /** areaId missing: opens the first area that isn't done yet */
  InspectionArea: { residenceId: string; areaId?: string };
  /** Neyora SDK (Home, then Calendar), opened by Scheduling on the Manage page */
  Neyora: undefined;
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  Login: undefined;
};
