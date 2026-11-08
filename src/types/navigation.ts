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
  ResidenceDashboard: { residenceId: string };
  /** inspectionSubmitted is set by the inspection room page on "Finalize Inspection" */
  CheckIn: { residenceId: string; inspectionSubmitted?: boolean };
  /** Unwired (not in the navigator); kept with InspectionScreen */
  Inspection: { residenceId: string };
  /** areaId missing: opens the first area that isn't done yet */
  InspectionArea: { residenceId: string; areaId?: string };
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  Login: undefined;
};
