import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import styles from '../../assets/styles/home.styles'
import { API_URL } from '../../constants/api'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import Loader from '../../components/loader'
import COLORS from '../../constants/colors'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const CAPTION_LIMIT = 100

const ExpandableCaption = ({ text }) => {
  const [expanded, setExpanded] = useState(false)

  if (!text) return null

  const isLong = text.length > CAPTION_LIMIT
  const displayed = isLong && !expanded ? text.slice(0, CAPTION_LIMIT).trimEnd() + '...' : text

  return (
    <Text style={styles.caption}>
      {displayed}
      {isLong && (
        <Text
          onPress={() => setExpanded(!expanded)}
          style={captionStyles.toggle}
        >
          {expanded ? '  Daha Az' : '  Daha Fazla'}
        </Text>
      )}
    </Text>
  )
}

export default function Index() {
  const { token, logout } = useAuthStore()
  const [books, setBooks]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage]         = useState(1)
  const [hasMore, setHasMore]   = useState(true)

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchBooks(1, true)
    setRefreshing(false)
  }

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true)
      else if (pageNum === 1) setLoading(true)

      const response = await fetch(`${API_URL}/api/books?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) logout()
        throw new Error(data.message || 'Bağlantı Hatası')
      }

      const uniqueBooks =
        refresh || pageNum === 1
          ? data.books
          : Array.from(
              new Set([...books, ...data.books].map((b) => b._id))
            ).map((id) => [...books, ...data.books].find((b) => b._id === id))

      setBooks(uniqueBooks)
      setHasMore(pageNum < data.totalPages)
      setPage(pageNum)
    } catch (error) {
      console.log('ERROR FETCHING BOOKS', error)
    } finally {
      if (refresh) setRefreshing(false)
      else setLoading(false)
    }
  }

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing) {
      await sleep(1000)
      await fetchBooks(page + 1)
    }
  }

  const renderRatingStars = (rating) =>
    [1, 2, 3, 4, 5].map((i) => (
      <Ionicons
        key={i}
        name={i <= rating ? 'star' : 'star-outline'}
        size={16}
        color={i <= rating ? '#f4b400' : COLORS.textSecondary}
        style={{ marginRight: 2 }}
      />
    ))

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: item.user.profileImg ||
                'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image
          source={{ uri: item.bookImg }}
          style={styles.bookImage}
          contentFit="cover"
        />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>

        {/* ── Genişletilebilir açıklama ── */}
        <ExpandableCaption text={item.caption} />
      </View>
    </View>
  )

  useEffect(() => { fetchBooks() }, [])

  if (loading && !refreshing) return <Loader size="small" />
S
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
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
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BOOKAPP</Text>
            <Text style={styles.headerSubtitle}>Kim Hangi Kitabı Değerlendirmiş</Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="small"
              color={COLORS.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>Henüz Bir Değerlendirme Yok</Text>
            <Text style={styles.emptySubText}>İlk Değerlendirmeyi Sen Paylaş</Text>
          </View>
        }
      />
    </View>
  )
}

const captionStyles = StyleSheet.create({
  toggle: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
})