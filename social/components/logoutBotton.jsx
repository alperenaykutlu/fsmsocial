import { StyleSheet, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useAuthStore } from '../store/authStore'
import {Ionicons} from "@expo/vector-icons"
import COLORS from '../constants/colors'

export default function LogoutBotton() {

    const {logout} = useAuthStore()
    const cofirmLogout = () => {
        Alert.alert("Logout","Çıkış Yapmaktan Emin Misiniz",[{
            text:"Cancel", style:"cancel"
        },
        {text:"Logout", onPress:() => logout(), style:"destructive"}])
    }

  return (
    <TouchableOpacity style={styles.logoutBotton} onPress={cofirmLogout}>
        <Ionicons name='log-out-outline' size={20} color={COLORS.white}/>
        <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    logoutBotton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 10,
        alignSelf: 'center',
    },
    logoutText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    }
})
