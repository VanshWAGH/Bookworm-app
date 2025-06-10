import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { API_URI } from '../../constants/api';
import { useRouter } from "expo-router";
import { useAuthStore } from '../../store/authStore';
import styles from '../../assets/styles/profile.styles';
import ProfileHeader from '../../components/ProfileHeader';
import LogoutButton from '../../components/LogoutButton';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { sleep } from ".";
import Loader from '../../components/Loader';

export default function Profile() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const { token } = useAuthStore();
  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching user books with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch(`${API_URI}/books/user`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) throw new Error(data.message || "Failed to fetch user books");

      // Ensure data is an array
      const booksArray = Array.isArray(data) ? data : [];
      setBooks(booksArray);
      console.log('Books set:', booksArray.length, 'items');
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load profile data. Pull down to refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteBook = async (bookId) => {
    try {
      setDeleteBookId(bookId)
      const response = await fetch(`${API_URI}/books/${bookId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete book");

      setBooks(books.filter((book) => book._id !== bookId));
      Alert.alert("Success", "Recommendation deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete recommendation");
    } finally {
      setDeleteBookId(null);
    }
  };

  const confirmDelete = (bookId) => {
    Alert.alert(
      "Delete Recommendation",
      "Are you sure you want to delete this recommendation?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => handleDeleteBook(bookId) },
      ]
    );
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#FFD700" : COLORS.textSecondary}
          style={{ marginRight: 1 }}
        />
      );
    }
    return (
      <View style={styles.ratingContainer}>
        {stars}
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
          marginLeft: 6,
          fontWeight: '500'
        }}>
          ({rating}/5)
        </Text>
      </View>
    );
  };

  const renderBookItem = ({ item }) => {
    console.log('Rendering book item:', item); // Debug log
    
    return (
      <View style={[styles.bookItem, {
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
      }]}>
        <Image 
          source={{ uri: item.image }} 
          style={[styles.bookImage, {
            backgroundColor: COLORS.border,
          }]} 
          resizeMode="cover"
          onError={(error) => console.log('Image load error:', error)}
        />
        
        <View style={styles.bookInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Text style={[styles.bookTitle, { flex: 1, marginRight: 8 }]} numberOfLines={2}>
              {item.title || 'Untitled Book'}
            </Text>
            <TouchableOpacity 
              style={[styles.deleteButton, {
                backgroundColor: deleteBookId === item._id ? COLORS.border : 'transparent',
                borderRadius: 8,
                marginTop: -4,
              }]} 
              onPress={() => confirmDelete(item._id)}
              disabled={deleteBookId === item._id}
            >
              {deleteBookId === item._id ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Ionicons name="trash-outline" size={18} color="#ff4757" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating || 0)}
          </View>
          
          <Text style={[styles.bookCaption, { lineHeight: 18 }]} numberOfLines={2}>
            {item.caption || 'No description available'}
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
          }}>
            <Text style={styles.bookDate}>
              Added {new Date(item.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
            
            {/* Rating badge */}
            <View style={{
              backgroundColor: COLORS.primary,
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 2,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Ionicons name="star" size={12} color={COLORS.white} />
              <Text style={{
                color: COLORS.white,
                fontSize: 11,
                fontWeight: '700',
                marginLeft: 2,
              }}>
                {item.rating || 0}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(500);
    await fetchData();
    setRefreshing(false);
  };

  const BooksHeader = () => (
    <View style={[styles.booksHeader, {
      backgroundColor: COLORS.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
    }]}>
      <View>
        <Text style={styles.booksTitle}>Your Library</Text>
        <Text style={[styles.booksCount, { marginTop: 2 }]}>
          {books.length} {books.length === 1 ? 'recommendation' : 'recommendations'}
        </Text>
      </View>
      
      {books.length > 0 && (
        <TouchableOpacity
          onPress={() => router.push("/create")}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="add" size={16} color={COLORS.white} />
          <Text style={{
            color: COLORS.white,
            fontSize: 12,
            fontWeight: '600',
            marginLeft: 4,
          }}>
            Add New
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={{
        backgroundColor: COLORS.cardBackground,
        borderRadius: 50,
        padding: 20,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
      }}>
        <Ionicons name="library-outline" size={50} color={COLORS.textSecondary} />
      </View>
      <Text style={styles.emptyText}>Start Your Reading Journey</Text>
      <Text style={{
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
      }}>
        Share your favorite books and help others{'\n'}discover amazing reads
      </Text>
      <TouchableOpacity
        style={[styles.addButton, {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 24,
        }]}
        onPress={() => router.push("/create")}
      >
        <Ionicons name="add-circle-outline" size={18} color={COLORS.white} />
        <Text style={[styles.addButtonText, { marginLeft: 8, fontSize: 15 }]}>
          Add Your First Book
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !refreshing) return <Loader />;

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />
      
      <BooksHeader />

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.booksList,
          books.length === 0 && { flex: 1 }
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
            progressBackgroundColor={COLORS.cardBackground}
          />
        }
        ListEmptyComponent={<EmptyState />}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
      />
    </View>
  );
}