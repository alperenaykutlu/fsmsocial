import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from '../components/SafeScreen'
import { StatusBar } from "expo-status-bar";
import {useAuthStore} from "../store/authStore"
import { useEffect } from "react";
SplashScreen.preventAutoHideAsync()
export default function RootLayout(){
  const router=useRouter()
  const segment=useSegments()
  const {checkAuth,user,token, isInitialized}=useAuthStore()


  useEffect(()=>{
    checkAuth()
  },[])

  useEffect(()=>{
    if (!isInitialized) return;

    SplashScreen.hideAsync();
    
    const inAuthScreen=segment[0]==="(auth)"
    const inSignedIn=user&&token

    if(!inSignedIn &&!inAuthScreen) router.replace("/(auth)")
    else if(inSignedIn && inAuthScreen) router.replace("/(tabs)")
  },[user,token,segment,isInitialized])

  if (!isInitialized) return null;


  return (
  <SafeAreaProvider>
<SafeScreen>
  <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
  </Stack>
  <StatusBar style="auto"/>
</SafeScreen></SafeAreaProvider>);
}