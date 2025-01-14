import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type LoginStackkParamList = {
  login: undefined;
  register: undefined;
  agreeInfo: undefined;
  signUpStepOne: undefined;
  signUpStepTwo: undefined;
  optionalInfo: undefined;
  connectInsta: undefined;
  welcome: undefined;
  instagram: any;
  home: undefined;
};

type LoginScreenProp = NativeStackNavigationProp<LoginStackkParamList>;
