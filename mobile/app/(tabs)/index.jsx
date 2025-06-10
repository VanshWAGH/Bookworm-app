import { View, Text, TouchableOpacity, FlatList, Image, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import styles from "../../assets/styles/home.styles";
import { API_URI } from '../../constants/api';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import Loading from '../../components/Loader';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const { logout, token } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (!token) throw new Error("No authentication token found. Please log in.");

      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(`${API_URI}/books?page=${pageNum}&limit=5`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch books");
      }

      const data = await response.json();

      if (refresh || pageNum === 1) {
        setBooks(data.books);
      } else {
        const combined = [...books, ...data.books];
        const uniqueBooks = Array.from(
          new Map(combined.map(book => [book._id, book]))
        ).map(([_, book]) => book);
        setBooks(uniqueBooks);
      }

      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching books:", error);
      Alert.alert("Error", error.message || "Failed to load books. Please try again.");
      if (error.message.includes("Token") || error.message.includes("Unauthorized")) {
        logout();
      }
    } finally {
      if (refresh) {
        await sleep(800);
        setRefreshing(false);
      }
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing && !loadingMore) {
      await fetchBooks(page + 1);
    }
  };

  const handleRefresh = () => {
    fetchBooks(1, true);
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
      <View style={[styles.ratingContainer, { alignItems: 'center' }]}>
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

  const formatPublishDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays/7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity 
      style={[styles.bookCard, {
        transform: [{ scale: 1 }],
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
      }]}
      activeOpacity={0.95}
      onPress={() => {
        // Optional: Navigate to book details
        console.log('Book pressed:', item.title);
      }}
    >
      {/* Header with user info and timestamp */}
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <View style={{ position: 'relative' }}>
            <Image
              source={{ 
                uri: item.user?.profileImage || 'https://via.placeholder.com/36x36?text=U'
              }}
              style={[styles.avatar, {
                backgroundColor: COLORS.border,
              }]}
            />
            {/* Online indicator */}
            <View style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#4CAF50',
              borderWidth: 2,
              borderColor: COLORS.cardBackground,
            }} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.username}>{item.user?.username || 'Anonymous'}</Text>
            <Text style={{
              fontSize: 11,
              color: COLORS.textSecondary,
              marginTop: 1,
            }}>
              {formatPublishDate(item.createdAt)}
            </Text>
          </View>
        </View>
        
        {/* Bookmark button */}
        <TouchableOpacity
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: 'transparent',
          }}
          onPress={() => {
            // Handle bookmark
            console.log('Bookmark pressed');
          }}
        >
          <Ionicons name="bookmark-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Book image with overlay rating */}
      <View style={[styles.bookImageContainer, { position: 'relative' }]}>
        <Image
          source={{ 
            uri: item.image || 'https://via.placeholder.com/200x200?text=Book'
          }}
          style={styles.bookImage}
          resizeMode="cover"
        />
        
        {/* Rating overlay */}
        <View style={{
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderRadius: 16,
          paddingHorizontal: 8,
          paddingVertical: 4,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={{
            color: 'white',
            fontSize: 12,
            fontWeight: '600',
            marginLeft: 2,
          }}>
            {item.rating}
          </Text>
        </View>

        {/* Gradient overlay at bottom */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }} />
      </View>

      {/* Book details */}
      <View style={styles.bookDetails}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 8,
        }}>
          <Text style={[styles.bookTitle, { flex: 1, marginRight: 8 }]} numberOfLines={2}>
            {item.title}
          </Text>
          
          {/* Genre tag */}
          <View style={{
            backgroundColor: COLORS.border,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 12,
          }}>
            <Text style={{
              fontSize: 10,
              color: COLORS.textSecondary,
              fontWeight: '500',
            }}>
              Fiction
            </Text>
          </View>
        </View>

        {renderRatingStars(item.rating)}
        
        <Text style={[styles.caption, { 
          lineHeight: 18,
          marginBottom: 12,
        }]} numberOfLines={3}>
          {item.caption}
        </Text>

        {/* Action buttons */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 16,
              }}
              onPress={() => console.log('Like pressed')}
            >
              <Ionicons name="heart-outline" size={18} color={COLORS.textSecondary} />
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                marginLeft: 4,
                fontWeight: '500',
              }}>
                {Math.floor(Math.random() * 50) + 5}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => console.log('Comment pressed')}
            >
              <Ionicons name="chatbubble-outline" size={16} color={COLORS.textSecondary} />
              <Text style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                marginLeft: 4,
                fontWeight: '500',
              }}>
                {Math.floor(Math.random() * 20) + 1}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => console.log('Share pressed')}
          >
            <Ionicons name="share-outline" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListHeaderComponent = () => (
    <View style={styles.header}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
      }}>
        <Ionicons name="library" size={28} color={COLORS.primary} />
        <Text style={[styles.headerTitle, { marginLeft: 8, marginBottom: 0 }]}>
          Bookworm
        </Text>
      </View>
      <Text style={styles.headerSubtitle}>
        Discover great reads from the community
      </Text>
      
      {/* Stats bar */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}>
        <View style={{ alignItems: 'center', marginHorizontal: 12 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '700',
            color: COLORS.primary,
          }}>
            {books.length}
          </Text>
          <Text style={{
            fontSize: 11,
            color: COLORS.textSecondary,
            marginTop: 1,
          }}>
            Books
          </Text>
        </View>
        <View style={{
          width: 1,
          height: 20,
          backgroundColor: COLORS.border,
        }} />
        <View style={{ alignItems: 'center', marginHorizontal: 12 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '700',
            color: COLORS.primary,
          }}>
            {Math.floor(Math.random() * 50) + 20}
          </Text>
          <Text style={{
            fontSize: 11,
            color: COLORS.textSecondary,
            marginTop: 1,
          }}>
            Readers
          </Text>
        </View>
      </View>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={{
        backgroundColor: COLORS.cardBackground,
        borderRadius: 50,
        padding: 24,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
      }}>
        <Ionicons name='library-outline' size={60} color={COLORS.textSecondary} />
      </View>
      <Text style={styles.emptyText}>No Recommendations Yet</Text>
      <Text style={[styles.emptySubtext, { lineHeight: 18 }]}>
        Be the first to share a book recommendation{'\n'}and help others discover great reads!
      </Text>
    </View>
  );

  const ListFooterComponent = () => {
    if (!loadingMore || !hasMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={{
          textAlign: 'center',
          color: COLORS.textSecondary,
          fontSize: 12,
          marginTop: 8,
        }}>
          Loading more books...
        </Text>
      </View>
    );
  };

  if (loading && books.length === 0) {
    return <Loading size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[
          styles.listContainer,
          books.length === 0 && { flex: 1 }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
            progressBackgroundColor={COLORS.cardBackground}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}