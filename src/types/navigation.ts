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
  PersonaSelect: undefined;
  RenterHome: undefined;
  /** Unwired (not in the navigator); kept with ResidenceDashboardScreen */
  ResidenceDashboard: { residenceId: string };
  /** "My Home" page of an active lease, opened by "Manage" on My Residences */
  ManageResidence: { residenceId: string };
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
