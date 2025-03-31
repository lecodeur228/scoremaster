import { defineStore } from 'pinia'
import { matchesService } from '../services/matches.service'
import type { Match } from '../types/match'
import { useAuthStore } from "./auth.store.ts";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase.ts";

interface MatchesState {
    matches: Match[]
    currentMatch: Match | null
    loading: boolean
    unsubscribeFn: null | (() => void)
}

export const useMatchesStore = defineStore('matches', {
    state: (): MatchesState => ({
        matches: [],
        currentMatch: null,
        loading: false,
        unsubscribeFn: null
    }),
    actions: {
        async fetchUserMatches(userId: string) {
            this.loading = true
            try {
                this.matches = await matchesService.getMatchesByUser(userId)
            } finally {
                this.loading = false
            }
        },
        async createMatch(matchData: Omit<Match, 'id'>) {
            this.loading = true
            try {
                const matchId = await matchesService.createMatch(matchData)
                await this.fetchUserMatches(this.userId)
                return matchId
            } finally {
                this.loading = false
            }
        },
        async fetchMatchByCode(code: string) {
            this.loading = true
            try {
                this.currentMatch = await matchesService.getMatchByCode(code)
                return this.currentMatch
            } finally {
                this.loading = false
            }
        },
        async updateTeamScore(teamId: string, points: number) {
            if (!this.currentMatch) return

            const teams = this.currentMatch.teams.map(team =>
                team.id === teamId
                    ? { ...team, score: Math.max(0, team.score + points) }
                    : team
            )

            await matchesService.updateMatchScores(this.currentMatch.id, teams)
            // Pas besoin de mettre à jour manuellement this.currentMatch.teams
            // car le listener onSnapshot le fera automatiquement
        },
        async resetScores() {
            if (!this.currentMatch) return

            const teams = this.currentMatch.teams.map(team => ({
                ...team,
                score: 0
            }))

            await matchesService.updateMatchScores(this.currentMatch.id, teams)
            // Pas besoin de mettre à jour manuellement this.currentMatch.teams
            // car le listener onSnapshot le fera automatiquement
        },
        setCurrentMatch(match: Match | null) {
            this.currentMatch = match
        },

        // Méthode unifiée pour s'abonner aux mises à jour
        subscribeToMatchUpdates(matchId: string) {
            // D'abord, on se désabonne de tout listener existant
            this.unsubscribeMatchUpdates();

            // On crée un nouveau listener
            const matchRef = doc(db, 'matches', matchId);

            // On stocke la fonction de désabonnement
            this.unsubscribeFn = onSnapshot(matchRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const updatedMatch = {
                        id: docSnapshot.id,
                        ...docSnapshot.data()
                    } as Match;

                    // Mise à jour du match courant
                    this.currentMatch = updatedMatch;

                    // Mise à jour également dans la liste des matchs si nécessaire
                    const index = this.matches.findIndex(m => m.id === updatedMatch.id);
                    if (index !== -1) {
                        this.matches[index] = updatedMatch;
                    }
                }
            });

            return this.unsubscribeFn;
        },

        // Cette méthode est devenue redondante, on peut la garder pour compatibilité
        // mais elle appelle simplement subscribeToMatchUpdates
        subscribeToLiveUpdates(matchId: string) {
            return this.subscribeToMatchUpdates(matchId);
        },

        // Méthode unifiée pour se désabonner
        unsubscribeMatchUpdates() {
            if (this.unsubscribeFn) {
                this.unsubscribeFn();
                this.unsubscribeFn = null;
            }
        },

        // Alias pour compatibilité
        unsubscribeLiveUpdates() {
            this.unsubscribeMatchUpdates();
        },

        async fetchMatchById(id: string): Promise<void> {
            this.loading = true;
            try {
                const match = await matchesService.getMatchById(id);
                this.currentMatch = match;

                // Important: s'abonne aux mises à jour après avoir récupéré le match
                this.subscribeToMatchUpdates(id);
            } finally {
                this.loading = false;
            }
        },

        async endMatch(): Promise<void> {
            if (!this.currentMatch) return;

            this.loading = true;
            try {
                await matchesService.updateMatch(this.currentMatch.id, {
                    active: false
                });
                // Pas besoin de mettre à jour manuellement
                // car le listener onSnapshot le fera automatiquement
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        userId: () => {
            const authStore = useAuthStore();
            return authStore.user?.uid ?? '';
        },
        safeCurrentMatch(state): Match | null {
            return state.currentMatch;
        }
    }
});