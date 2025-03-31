export interface Team {
    id: string
    name: string
    score: number
}

export interface Match {
    id: string
    code: string
    name: string
    createdBy: string
    timestamp: Date
    teams: Team[]
    active: boolean
}