import { View, Text ,TextInput,TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert} from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router'
import styles from '../../assets/styles/login.styles'
import { Image } from 'expo-image'
import COLORS from '../../constants/colors'
import {Ionicons} from "@expo/vector-icons"
import { useAuthStore } from '../../store/authStore'
export default function Login() {

    const [email, setEmail] = useState("")
    const [passWord, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const {isCheckingAuth,login,isLoading}=useAuthStore()

    const handleLogin = async () => {
const result=await login(email,passWord)
if(!result.success) Alert.alert("Error",result.error)
        }

        if(isCheckingAuth) return null


    return (
        <KeyboardAvoidingView style={styles.container}
        behavior={Platform.OS==="android"?"padding":"height"}>
        <View>
            <Image
                source={require("../../assets/images/Camp.png")}
                style={[styles.illustrationImage,{left:80,bottom:50}]}
                resizeMode='contain'
            />

            <View style={styles.card}>
                <View style={styles.formContainer}> 
                    {/*email*/}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                            name="mail-outline"
                            size={20}
                            color={COLORS.primary}
                            style={styles.inputIcon}
                            />
                            <TextInput
                            style={styles.input}
                            placeholder="Mail Adresinizi Girin"
                            placeholderTextColor={COLORS.placeholderText}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="mail"
                            autoCapitalize="none"
                            />
                        </View>

                    </View>
                    {/*Passowrd*/}
            <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color={COLORS.primary}
                            style={styles.inputIcon}
                            />
                            <TextInput
                            style={styles.input}
                            placeholder="Şifrenizi Girin"
                            placeholderTextColor={COLORS.placeholderText}
                            value={passWord}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                      
                            />
                            <TouchableOpacity
                            onPress={()=>setShowPassword(!showPassword)}
                            style={styles.eyeIcon}
                            >
                                <Ionicons
                                name={showPassword?"eye-outline":"eye-off-outline"}
                                size={20}
                                color={COLORS.primary}

                                />


                            </TouchableOpacity>
                        </View>

                    </View>

                    <TouchableOpacity
                    style={styles.button} onPress={handleLogin}
                    disabled={isLoading}
                    >
                        {isLoading?(
                            <ActivityIndicator color="#fff"/>):
                            (<Text style={styles.buttonText}>Giriş</Text>)

                        }

                    </TouchableOpacity>

                    {/*FOOTER*/}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Hesabın Yok Mu?</Text>
                        <Link href="/signup" asChild>
                        <TouchableOpacity>
                            <Text style={styles.link}>Kayıt Ol</Text>
                            </TouchableOpacity></Link>

                    </View>

                </View>

            </View>
        </View>
        </KeyboardAvoidingView>

    )
}