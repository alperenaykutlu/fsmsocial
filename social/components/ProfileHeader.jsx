import { StyleSheet, Text, View } from 'react-native'
import { useAuthStore } from '../store/authStore'
import {Image} from "expo-image"
import styles from '../assets/styles/profile.styles'
export default function ProfileHeader() {
    const {user}=useAuthStore()
    if(!user) return null
  return (
    <View style={styles.profileHeader}>
      <Image 
        source={{uri: user.profileImg || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}} 
        style={styles.profileImage}
      />
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
    </View>
  )
}

