import { useRouter } from "expo-router"; // ✅ Import the router
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useAuthStore } from '../store/authStore';
import styles from '../assets/styles/profile.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export default function LogoutButton() {
    const { logout } = useAuthStore();
    const router = useRouter(); // ✅ useRouter hook

    const confirmLogout = () => {
  Alert.alert("Logout", "Are you sure you want to logout?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Logout",
      onPress: async () => {
        console.log("Logout confirmed");  // ✅ Debug
        await logout();
        console.log("Logout complete");   // ✅ Debug
        router.replace("/login");
      },
      style: "destructive",
    },
  ]);
};


    return (
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
            <Ionicons name='log-out-outline' size={20} color={COLORS.white} />
            <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
    );
}
