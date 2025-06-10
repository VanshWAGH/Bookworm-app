import { View, Text } from 'react-native';
import React from 'react';
import { useAuthStore } from '../store/authStore';
import styles from '../assets/styles/profile.styles';
import { Image } from 'expo-image';
import { formatMemberSince } from '../lib/utils';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileHeader() {
  const { user } = useAuthStore();
  
  if (!user) {
    return (
      <View style={styles.ProfileHeader}>
        <Text>Loading user data...</Text>
      </View>
    );
  }
  console.log("Profile image URL:", user?.profileImage);

  return (
    <View style={styles.profileHeaderrofileHeader}>
      {user.profileImage ? (
        <Image 
          source={{ uri: user.profileImage }} 
          style={styles.profileImage}
          placeholder="blurhash" // Optional: Add a blurhash placeholder
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={[styles.profileImage, { backgroundColor: '#e1e1e1', justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="person-outline" size={40} color="#666" />
        </View>
      )}
      
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username || 'Anonymous'}</Text>
        <Text style={styles.email}>{user.email || 'No email provided'}</Text>
        {user.createdAt && (
          <Text style={styles.memberSince}>
            Joined {formatMemberSince(user.createdAt)}
          </Text>
        )}
      </View>
    </View>
  );
}