import { useRideStore } from "@/stores/useRideStore"
import { useEffect } from "react"

export const Incomes = () => {
    const rides = useRideStore((state) => state.rides)
    const getAllRides = useRideStore((state) => state.fetchRides)
    const loading = useRideStore((state) => state.loading)

    useEffect(() => {
        getAllRides()
    }, [getAllRides])
    return (
        <div>
            <h1>Incomes Page</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {rides.map((ride) => (
                        <li key={ride.id}>
                            {ride.platform} - ${ride.amount} - {new Date(ride.date).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}