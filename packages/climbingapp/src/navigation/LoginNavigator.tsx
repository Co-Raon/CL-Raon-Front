import React, { useLayoutEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import AgreeInfoScreen from './screens/auth/AgreeInfoScreen';
import SignUpStepOneScreen from './screens/auth/SignUpStepOneScreen';
import OptionalInfoScreen from './screens/auth/OptionalInfoScreen';
import ConnectWithInstagramScreen from './screens/auth/ConnectWithInstagramScreen';
import WelcomeScreen from './screens/auth/WelcomeScreen';
import InstagramAuthWebView from '../component/webview/InstagramAuthWebview';
import Config from 'react-native-config';
import SignUpStepTwoScreen from './screens/auth/SignUpStepTwoScreen';
import HomeScreen from './screens/main/HomeScreen';
import { getData } from '../utils/storage';
import { useAuth } from '../hooks/useAuth';
const Stack = createNativeStackNavigator();

const LoginNavigator = () => {
  const instagramInitalValue = {
    appId: Config.INSTAGRAM_APP_ID,
    appSecret: Config.INSTAGRAM_APP_SECRET_CODE,
    scpoe: 'user_profile,user_media',
    redirectUrl: Config.REDIRECT_URI,
  };
  const { authorize, user } = useAuth();
  useLayoutEffect(() => {
    (async function () {
      const accessToken = await getData('access-token');
      const refreshToken = await getData('refresh-token');
      const isCompletedSignUp = await getData('isCompletedSignUp');
      if (accessToken && refreshToken && isCompletedSignUp) {
        authorize({ accessToken, refreshToken, isCompletedSignUp });
      }
    })();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={user?.isCompletedSignUp ? 'home' : 'login'}
    >
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="agreeInfo" component={AgreeInfoScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="signUpStepOne" component={SignUpStepOneScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="signUpStepTwo" component={SignUpStepTwoScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="optionalInfo" component={OptionalInfoScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="home" component={HomeScreen} options={{ animation: 'simple_push' }} />
      <Stack.Screen
        name="connectInsta"
        component={ConnectWithInstagramScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen name="welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="instagram"
        initialParams={instagramInitalValue}
        component={InstagramAuthWebView}
      />
    </Stack.Navigator>
  );
};

export default LoginNavigator;
