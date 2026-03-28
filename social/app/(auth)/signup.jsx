import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import styles from '../../assets/styles/login.styles'
import COLORS from '../../constants/colors'
import { Ionicons } from "@expo/vector-icons"
import { useAuthStore } from '../../store/authStore'

export default function Signup() {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [passWordAgain, setPasswordAgain] = useState("")
    const [passWord, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordAgain,setShowPasswordAgain]=useState(false)

    const router = useRouter()
    const { isLoading, register } = useAuthStore()

    const handleRegister = async () => {
        if (passWord !== passWordAgain) {
            Alert.alert("Error", "Şifreler Eşleşmedi")
            return
        }
        const result = await register(email, name, lastName, passWord, passWordAgain)
        if (!result.success) Alert.alert("Error", result.error)
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "android" ? "padding" : "height"}
        >
            <View style={styles.container}>
                <View style={styles.card}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>FSMEIO</Text>
                        <Text style={styles.subtitle}>Resmi Uygulamadır</Text>
                    </View>

                    <View style={styles.formContainer}>

                        {/* İsim */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>İsim</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="İsminizi Girin"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Soyisim */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Soyisim</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Soyisminizi Girin"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mail Adresinizi Girin"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Şifre */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Şifre</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Şifrenizi Girin"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={passWord}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Şifre Tekrar */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Şifre Tekrar</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Şifrenizi Tekrar Girin"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={passWordAgain}
                                    onChangeText={setPasswordAgain}
                                    secureTextEntry={!showPasswordAgain}
                                />
                                <TouchableOpacity onPress={() => setShowPasswordAgain(!showPasswordAgain)} style={styles.eyeIcon}>
                                    <Ionicons name={showPasswordAgain ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Kayıt Ol Butonu */}
                        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
                            {isLoading
                                ? <ActivityIndicator color="#0f3e80" />
                                : <Text style={styles.buttonText}>Kayıt Ol</Text>
                            }
                        </TouchableOpacity>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Hali Hazırda Hesabın Var Mı?</Text>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text style={styles.link}>Giriş Yap</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}