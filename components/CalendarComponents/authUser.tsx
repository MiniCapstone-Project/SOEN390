import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { WEB_CLIENT_ID } from "../../constants/GoogleKey";
import { AND_CLIENT_ID } from '../../constants/GoogleKey';

WebBrowser.maybeCompleteAuthSession();
const SCOPES = encodeURI('https://www.googleapis.com/auth/calendar.readonly');
const RESPONSE_TYPE = 'token';

export default function AuthUser() {
  const [userInfo, setUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const [request, response, promptAsync ] = Google.useAuthRequest({
    androidClientId: AND_CLIENT_ID,
  }); 

   useEffect(()=>{
    handleSignIn();
},[response]);

  async function handleSignIn (){
    const user = await AsyncStorage.getItem("@user");
    if(!user){
        if (response?.type ==="success"){
        await getUserInfo(response.authentication?.accessToken);
    }}
    else {
        setUserInfo(JSON.parse(user))
    }
  };

   const getUserInfo = async (token) => {
 if(!token) return;
 try {
    const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
    {
          headers: {Authorization : `Bearer ${token}`}
    }
);
const user = await response.json();
await AsyncStorage.setItem("@user", JSON.stringify(user));
await AsyncStorage.setItem("@accessToken", token);
setUserInfo(user);
setAccessToken(token);

 }
 catch (error){
    console.log("Error fetching user info: ", error);
}
 
 };

  // console.log(userInfo.access_token);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!userInfo ? (
        <Button title="Connect Google Calendar" 
        onPress= {promptAsync} />
      ) : (
        <Text>Access Token: {userInfo}</Text>
      )}
    </View>
  );
}
