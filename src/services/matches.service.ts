import { db } from './firebase'
import {
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp, getDoc
} from 'firebase/firestore'
import type { Match, Team } from '../types/match'
import { authService } from "./auth.service.ts";

class MatchesService {
    async createMatch(match: Omit<Match, 'id'>): Promise<string> {
        const matchRef = await addDoc(collection(db, 'matches'), {
            ...match,
            createdBy: this.getCurrentUserId(),
            timestamp: serverTimestamp()
        })
        return matchRef.id
    }

    async getMatchesByUser(userId: string): Promise<Match[]> {
        const q = query(
            collection(db, 'matches'),
            where('createdBy', '==', userId)
        )
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Match[]
    }

    async getMatchByCode(code: string): Promise<Match | null> {
        const q = query(
            collection(db, 'matches'),
            where('code', '==', code)
        )
        const querySnapshot = await getDocs(q)
        if (querySnapshot.empty) return null

        const matchData = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data()
        } as Match;

        return matchData;
    }

    async updateMatchScores(matchId: string, teams: Team[]): Promise<void> {
        const matchRef = doc(db, 'matches', matchId)
        await updateDoc(matchRef, { teams })
    }

    // Méthode corrigée pour être plus explicite
    subscribeToMatchChanges(matchId: string, callback: (match: Match) => void) {
        const matchRef = doc(db, 'matches', matchId)
        return onSnapshot(matchRef, (doc) => {
            if (doc.exists()) {
                callback({
                    id: doc.id,
                    ...doc.data()
                } as Match)
            }
        })
    }

    async getMatchById(id: string): Promise<Match> {
        const docRef = doc(db, 'matches', id)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            throw new Error('Match not found')
        }

        return {
            id: docSnap.id,
            ...docSnap.data()
        } as Match
    }

    async updateMatch(id: string, data: Partial<Match>): Promise<void> {
        await updateDoc(doc(db, 'matches', id), data)
    }

    private getCurrentUserId(): string {
        const user = authService.getCurrentUser()
        if (!user) throw new Error('User not authenticated')
        return user.uid
    }
}

export const matchesService = new MatchesService()