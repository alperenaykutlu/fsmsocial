import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native'
import { Image } from 'expo-image'
import { API_URL } from '../../constants/api'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../store/authStore'
import ProfileHeader from '../../components/ProfileHeader'
import LogoutBotton from '../../components/logoutBotton'
import { Ionicons } from '@expo/vector-icons'
import Loader from '../../components/loader'
import COLORS from '../../constants/colors'

export default function Profile() {
  const [books, setBooks]           = useState([])
  const [isLoading, setIsLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deleteBook, setDeleteBook] = useState(null)
  const { token, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/api/books/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) {
        if (['Invalid token', 'Token is not valid'].includes(data.message)) {
          logout(); return
        }
        throw new Error(data.message || 'Kitaplar yüklenemedi')
      }
      setBooks(data)
    } catch {
      Alert.alert('Hata', 'Veriler yüklenemedi. Aşağı çekerek yenileyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const confirmDelete = (id) =>
    Alert.alert(
      'Değerlendirmeyi Sil',
      'Bu değerlendirmeyi silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => handleDeleteBook(id) },
      ]
    )

  const handleDeleteBook = async (bookID) => {
    setDeleteBook(bookID)
    try {
      const response = await fetch(`${API_URL}/api/books/${bookID}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Kitap silinemedi')
      setBooks((prev) => prev.filter((b) => b._id !== bookID))
    } catch (err) {
      Alert.alert('Hata', err.message || 'Silme sırasında hata oluştu')
    } finally {
      setDeleteBook(null)
    }
  }

  // Yıldız — sadece COLORS.primary ve COLORS.textSecondary kullanıyor
  const RatingStars = ({ rating }) => (
    <View style={S.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={13}
          color={i <= rating ? '#F4B400' : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      ))}
      <Text style={S.ratingNum}>{rating}/5</Text>
    </View>
  )

  const renderBookItem = ({ item, index }) => (
    <View style={S.card}>
      <View style={S.coverBox}>
        {item.bookImg ? (
          <Image source={{ uri: item.bookImg }} style={S.coverImg} contentFit="cover" />
        ) : (
          <View style={S.coverFallback}>
            <Ionicons name="book" size={26} color={COLORS.primary} />
          </View>
        )}
        <View style={S.indexBadge}>
          <Text style={S.indexBadgeText}>{String(index + 1).padStart(2, '0')}</Text>
        </View>
      </View>

      <View style={S.cardContent}>
        <View style={S.cardTopRow}>
          <Text style={S.cardTitle} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
          <RatingStars rating={item.rating} />
        </View>
        <Text style={S.cardCaption} numberOfLines={3}>{item.caption}</Text>
      </View>

      <TouchableOpacity
        style={S.deleteBtn}
        onPress={() => confirmDelete(item._id)}
        disabled={deleteBook === item._id}
        activeOpacity={0.7}
      >
        {deleteBook === item._id ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Ionicons name="trash-outline" size={18} color={COLORS.textSecondary} />
        )}
      </TouchableOpacity>
    </View>
  )

  const EmptyState = () => (
    <View style={S.emptyWrap}>
      <View style={S.emptyCircle}>
        <Ionicons name="book-outline" size={44} color={COLORS.primary} />
      </View>
      <Text style={S.emptyTitle}>Henüz değerlendirme yok</Text>
      <Text style={S.emptySub}>
        Okuduğun kitapları paylaş,{'\n'}topluluğa ilham ver.
      </Text>
      <TouchableOpacity style={S.addBtn} onPress={() => router.push('/create')} activeOpacity={0.8}>
        <Ionicons name="add" size={18} color={COLORS.white} style={{ marginRight: 6 }} />
        <Text style={S.addBtnText}>İlk Değerlendirmeni Ekle</Text>
      </TouchableOpacity>
    </View>
  )

  const ListHeader = () => (
    <>
      <View style={S.profileSection}>
        <ProfileHeader />
        <LogoutBotton />
        <View style={S.profileDivider} />
        <View style={S.sectionBar}>
          <View style={S.sectionLeft}>
            <View style={S.sectionAccent} />
            <Text style={S.sectionTitle}>DEĞERLENDİRMELERİM</Text>
          </View>
          {books.length > 0 && (
            <View style={S.countPill}>
              <Text style={S.countText}>{books.length} kitap</Text>
            </View>
          )}
        </View>
      </View>
    </>
  )

  if (isLoading && !refreshing) return <Loader />

  return (
    <View style={S.root}>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={S.listContent}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<EmptyState />}
        ItemSeparatorComponent={() => <View style={S.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
            progressBackgroundColor={COLORS.cardBackground}
          />
        }
      />
    </View>
  )
}

const S = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 48,
  },

  // Profil
  profileSection: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 12,
    marginBottom: 0,
  },

  // Bölüm başlığı
  sectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 1.8,
  },
  countPill: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Kart
  card: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 116,
    backgroundColor: COLORS.cardBackground,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },

  coverBox: {
    width: 82,
    position: 'relative',
  },
  coverImg: {
    width: '100%',
    height: '100%',
  },
  coverFallback: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  indexBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  cardContent: {
    flex: 1,
    padding: 14,
    gap: 6,
    justifyContent: 'center',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  cardCaption: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNum: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 5,
    fontWeight: '700',
  },

  deleteBtn: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
  },

  separator: { height: 10 },

  // Boş durum
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 40,
  },
  emptyCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 32,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
})
