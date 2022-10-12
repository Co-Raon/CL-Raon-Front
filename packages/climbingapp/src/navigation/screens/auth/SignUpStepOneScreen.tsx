import { useNavigation } from '@react-navigation/native';
import { AppBar } from 'climbingapp/src/component/appBar/AppBar';
import { NextButton } from 'climbingapp/src/component/button/Button';
import {
  Title,
  TitleContainer,
} from 'climbingapp/src/component/text/AuthTitle';
import { ScreenView } from 'climbingapp/src/component/view/ScreenView';
import { colorStyles } from 'climbingapp/src/styles';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { LoginScreenProp } from './type';
import { Text } from 'react-native';
import { MyTextInput } from 'climbingapp/src/component/text-input/TextInput';
import { ProfileImage } from 'climbingapp/src/component/profile-image/ProfileImage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'climbingapp/src/store/slices';
import { setNickName } from 'climbingapp/src/store/slices/authInfo';
import { debounce } from 'lodash';
import { api } from 'climbingapp/src/utils/constants';

import axios from 'axios';
const ButtonContainer = styled.View`
  flex: 0.5;
  margin-bottom: 24;
`;

const ProfileContainer = styled.View`
  flex: 1;
`;

const NickNameContainer = styled.View`
  flex: 1;
`;

const SubText = styled.Text`
  color: ${colorStyles.Black};
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`;
const ErrorText = styled.Text`
  margin: 5px;
  color: ${colorStyles.Red500};
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`;

function SignUpStepOneScreen() {
  const navigation = useNavigation<LoginScreenProp>();
  const userInfo = useSelector((state: RootState) => state.authInfo.userInfo);
  const [isDuplicated, setIsDuplicated] = useState<boolean>(false);
  const [isErrorNickName, setIsErrorNickName] = useState<string>('');
  const dispatch = useDispatch();

  const handleCheckDuplicated = debounce((nick: string) => {
    axios
      .get(api + `/auth/nickname/${nick}/duplicate-check`)
      .then((res) => setIsDuplicated(res.data.result));
  }, 800);

  const handleNickNameErrorMessage = debounce(
    ({ nick, duplicated }: { nick: string; duplicated: boolean }) => {
      let errorMessage = '';
      if (!/^[0-9a-zA-Z가-힣]{2,10}$/gi.test(nick))
        errorMessage = '닉네임 규칙을 지켜주세요';
      else if (duplicated) {
        errorMessage = '닉네임이 중복되었습니다!';
      }
      setIsErrorNickName(errorMessage);
    },
    800
  );

  const isCorrectName = !'' && isErrorNickName === '' && isDuplicated === false;

  const handleChangeNickName = (nick: string) => {
    dispatch(setNickName(nick));
    handleCheckDuplicated(nick);
    handleNickNameErrorMessage({ nick, duplicated: isDuplicated });
  };

  return (
    <ScreenView color={colorStyles.White}>
      <AppBar />
      <TitleContainer>
        <Title>다음 항목을</Title>
        <Title>입력해 주세요</Title>
      </TitleContainer>
      <ProfileContainer>
        <SubText>프로필 사진</SubText>
        <ProfileImage icon="camera" />
      </ProfileContainer>
      <NickNameContainer>
        <SubText>
          닉네임 <Text style={{ color: '#FF0000' }}>*</Text>{' '}
        </SubText>
        <MyTextInput
          value={userInfo.nickname}
          onChangeText={handleChangeNickName}
          placeholder="한글, 영문, 숫자 포함 2-20자"
        />
        <ErrorText>{isErrorNickName}</ErrorText>
      </NickNameContainer>
      <ButtonContainer>
        <NextButton
          disabled={() => !isCorrectName}
          onPress={() => navigation.navigate('signUpStepTwo')}
        />
      </ButtonContainer>
    </ScreenView>
  );
}

export default SignUpStepOneScreen;