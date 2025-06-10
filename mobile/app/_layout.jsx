import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useFonts } from "expo-font";



SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore();
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  })

  useEffect(()=> {
    if(fontsLoaded)SplashScreen.hideAsync
  }, [fontsLoaded])
  const [hasMounted, setHasMounted] = useState(false); // ✅ ensures safe hook usage

  useEffect(() => {

    checkAuth();
  }, []);

  useEffect(() => {
    setHasMounted(true); // ✅ ensures useRouter is safe to use
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [hasMounted, user, token, segments]);



  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
