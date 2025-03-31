

import { auth } from '../services/firebase.ts'  // Ajustez le chemin selon votre structure de projet
import {
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth'
import type { UserCredential, User } from 'firebase/auth'

export default  class AuthService {
    private user: User | null = null
    private authStateListeners: ((user: User | null) => void)[] = []

    constructor() {
        // Configurer la persistance
        setPersistence(auth, browserLocalPersistence)
            .catch(error => {
                console.error("Erreur lors de la configuration de la persistance:", error)
            })

        // Écouter les changements d'état
        onAuthStateChanged(auth, (user) => {
            this.user = user
            this.authStateListeners.forEach(listener => listener(user))
        })
    }

    async login(email: string, password: string): Promise<UserCredential> {
        return signInWithEmailAndPassword(auth, email, password)
    }

    async logout(): Promise<void> {
        return signOut(auth)
    }

    async createAccount(email: string, password: string): Promise<UserCredential> {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    getCurrentUser(): User | null {
        return this.user || auth.currentUser
    }

    isAuthenticated(): boolean {
        return !!this.getCurrentUser()
    }
}

// Exportez une instance du service
export const authService = new AuthService()