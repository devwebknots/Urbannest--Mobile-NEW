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
  /** Confirmation + next steps after the application is sent (replaces RentalApplication) */
  ApplicationSubmitted: { propertyId: string; applicationId: string; submittedAt: number };
  /** All the user's applications with their status ("Track Application Status") */
  ApplicationStatus:
    | { propertyId?: string; applicationId?: string; submittedAt?: number }
    | undefined;
  /** One application's details + journey, opened from an Application Status card */
  ApplicationDetails: { record: import('@/features/application/types').ApplicationRecord };
  /** The submitted lease application document, opened by "View" on Application Submitted */
  SubmittedApplication: { record: import('@/features/application/types').ApplicationRecord };
  /** The owner's lease offer (accept / reject), opened from the Offer Acceptance step */
  OfferAcceptance: {
    record: import('@/features/application/types').ApplicationRecord;
    /** Step already done: show "Offer Accepted", no buttons */
    accepted?: boolean;
  };
  /** The generated lease (confirm / dispute), opened from the Lease Review step */
  LeaseReview: {
    record: import('@/features/application/types').ApplicationRecord;
    /** Step already done: show "Lease Confirmed", no buttons */
    confirmed?: boolean;
  };
  /** "Payment Summary" (proceed to pay), opened from the Payment step */
  LeasePayment: {
    record: import('@/features/application/types').ApplicationRecord;
    /** Step already done: show "Payment Complete", no button */
    paid?: boolean;
  };
  PersonaSelect: undefined;
  /** Role picker (Landlord, PM, Tenant, PMS Company, Agent, UN Admin), opened by the "Add Persona" card */
  AddPersona: undefined;
  RenterHome: undefined;
  /** Landlord dashboard, opened by "Continue as Landlord" on PersonaSelect */
  LandlordHome: undefined;
  /** 3-step "Independent Landlord" registration, opened by Landlord → Continue on AddPersona */
  LandlordOnboarding: undefined;
  /** Landlord's Properties page: dashboard burger menu, or after onboarding is activated */
  LandlordProperties: undefined;
  /** "Add New Property" form, opened by Add Property on the Portfolio Overview */
  LandlordAddProperty: undefined;
  /** Landlord Property Details, opened by "View Property" on a Managed Assets card */
  LandlordPropertyDetails: { propertyId: string };
  /** Landlord Unit Details, opened by "View Unit" on Property Details */
  LandlordUnitDetails: { propertyId: string; unitId: string };
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
