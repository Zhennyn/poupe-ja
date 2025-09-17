
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setupErrorLogging } from '../utils/errorLogger';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

const STORAGE_KEY = 'expo-router-emulate';

export default function RootLayout() {
  const { emulate } = useGlobalSearchParams();
  const insets = useSafeAreaInsets();
  const [isEmulating, setIsEmulating] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    setupErrorLogging();
  }, []);

  useEffect(() => {
    if (emulate === 'true') {
      setIsEmulating(true);
    }
  }, [emulate]);

  if (loading) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          {!user ? (
            <>
              <Stack.Screen name="auth/login" />
              <Stack.Screen name="auth/signup" />
            </>
          ) : (
            <>
              <Stack.Screen name="index" />
              <Stack.Screen name="transactions" />
            </>
          )}
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
  },
});
