export interface Ride {
    id: string
    amount: number
    date: Date
    platform: "yummy" | "ridery" | "particular"
    userId: string
}

export interface NewRide {
    amount: number
    platform: "yummy" | "ridery" | "particular"
}

export interface RideFilters {
    platform?: string
    from?: string
    to?: string
}