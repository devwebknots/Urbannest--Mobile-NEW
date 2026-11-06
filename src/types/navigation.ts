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
  CheckIn: { residenceId: string };
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  Login: undefined;
};
