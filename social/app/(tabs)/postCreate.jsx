import {
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput
} from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import styles from '../../assets/styles/create.styles'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { useAuthStore } from "../../store/authStore"
import { API_URL } from '../../constants/api'
import { Image } from 'expo-image'



export default function Create() {
    const [title, setTitle] = useState("")
    const [caption, setCaption] = useState("")
    const [rating, setRating] = useState(3)
    const [image, setImage] = useState(null)
    const [imageBase64, setImageBase64] = useState(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const { token } = useAuthStore()

    const pickImage = async () => {
        try {
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
                if (status !== "granted") {
                    Alert.alert("Permission Denied", "Kamera İznine İhtiyaç Var")
                    return
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.4,
                base64: true
            })

            if (!result.canceled) {
                setImage(result.assets[0].uri)
                if (result.assets[0].base64) {
                    setImageBase64(result.assets[0].base64)
                } else {
                    const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                        encoding: "base64"
                    })
                    setImageBase64(base64)
                }
            }
        } catch (error) {
            Alert.alert("Error", "Seçilen Fotoğraf Problem Çıkardı. Başka Fotoğraf Seçiniz")
        }
    }

   const uploadToCloudinary = async () => {
        const formData = new FormData();
        formData.append("file", `data:image/jpeg;base64,${imageBase64}`);
        formData.append("upload_preset", "uygulama1");
        formData.append("public_id", `book_${Date.now()}`); // Cloudinary'nin display name ararken slash hatası vermesini engeller

        const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/dogomixba/image/upload`,
            {
                method: "POST",
                body: formData
            }
        )
        const data = await cloudinaryRes.json()
        if (!data.secure_url) throw new Error(data.error?.message || "Cloudinary yükleme başarısız")
        return data.secure_url
    }

    const handleSubmit = async () => {
        if (!title || !caption || !imageBase64 || !rating) {
            Alert.alert("Error", "Tüm Alanları Doldurun")
            return
        }
        try {
            setLoading(true)

            // 1. Cloudinary'e doğrudan yükle (JSON body, unsigned preset)
            const imageUrl = await uploadToCloudinary()

            // 2. Backend'e sadece URL'i gönder
            const response = await fetch(`${API_URL}/api/books`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    caption,
                    rating: rating.toString(),
                    image: imageUrl
                })
            })

            const responseText = await response.text()
            let data
            try {
                data = JSON.parse(responseText)
            } catch {
                console.error("Sunucu yanıtı:", responseText)
                throw new Error(`Sunucu hatası: ${response.status}`)
            }

            if (!response.ok) throw new Error(data.message || "Bazı Şeyler Ters Gitti")

            Alert.alert("Success", "Kitap Yorumun Başarıyla Eklendi")
            setTitle("")
            setCaption("")
            setRating(3)
            setImage(null)
            setImageBase64(null)
            router.push("/")

        } catch (error) {
            console.error("Oluşturma Esnasında Sorun Çıktı:", error)
            Alert.alert("Error", error.message || "Bazı Şeyler Ters Gitti")
        } finally {
            setLoading(false)
        }
    }

    const renderRatingPicker = () => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
                    <Ionicons
                        name={i <= rating ? "star" : "star-outline"}
                        size={32}
                        color={i <= rating ? "#f4b400" : COLORS.textSecondary}
                    />
                </TouchableOpacity>
            )
        }
        return <View style={styles.ratingContainer}>{stars}</View>
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "android" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Kitap İncelemesi Ekle</Text>
                        <Text style={styles.subtitle}>Başkalarıyla Favori Okumalarını Ekle</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Kitap Başlığı</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="book-outline"
                                    size={20}
                                    color={COLORS.textSecondary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Kitap İsmi Girin"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Değerlendirmeniz</Text>
                            {renderRatingPicker()}
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Kitap Resmi</Text>
                            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                                {image ? (
                                    <Image source={{ uri: image }} style={styles.previewImage} />
                                ) : (
                                    <View style={styles.placeholderContainer}>
                                        <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                                        <Text style={styles.placeholderText}>Resim Seçmek İçin Tıklayın</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>İçerik</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Kitap Hakkında Düşündüklerinizi Yazın"
                                placeholderTextColor={COLORS.placeholderText}
                                value={caption}
                                onChangeText={setCaption}
                                multiline
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Ionicons
                                    name="cloud-upload-outline"
                                    size={20}
                                    color={COLORS.white}
                                    style={styles.buttonIcon}
                                />
                            )}
                            <Text style={styles.buttonText}>Gönder</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}