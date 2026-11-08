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
  /** inspectionSubmitted is set by the Inspection screen when it hands back */
  CheckIn: { residenceId: string; inspectionSubmitted?: boolean };
  /** completedAreaId is set by an InspectionArea page when it hands back */
  Inspection: { residenceId: string; completedAreaId?: string };
  InspectionArea: { residenceId: string; areaId: string };
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  Login: undefined;
};
