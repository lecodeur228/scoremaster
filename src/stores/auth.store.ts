import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '../services/firebase'
import {
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth'
import type { User } from 'firebase/auth'

// Configurer la persistance
setPersistence(auth, browserLocalPersistence)
    .catch(error => {
        console.error("Erreur lors de la configuration de la persistance:", error)
    })

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const isAuthenticated = ref(false)
    const isLoading = ref(true)

    // Fonction pour mettre à jour l'utilisateur
    function setUser(currentUser: User | null) {
        user.value = currentUser
        isAuthenticated.value = !!currentUser
    }

    // Initialiser l'état d'authentification
    onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser
        isAuthenticated.value = !!currentUser
        isLoading.value = false
    })



    // Fonction de connexion
    async function login(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            user.value = userCredential.user
            isAuthenticated.value = true
            return userCredential
        } catch (error) {
            throw error
        }
    }

    //set user information



    // Fonction de déconnexion
    async function logout() {
        try {
            await signOut(auth)
            user.value = null
            isAuthenticated.value = false
        } catch (error) {
            throw error
        }
    }

    // Fonction de création de compte
    async function createAccount(email: string, password: string) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            return userCredential
        } catch (error) {
            throw error
        }
    }

    return {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        createAccount,
        setUser
    }
})