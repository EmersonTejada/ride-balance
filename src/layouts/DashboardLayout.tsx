import { useAuthStore } from "@/stores/useAuthStore"

export const DashboardLayout = () => {
    const user = useAuthStore((state) => state.user)
    return (
        <h1>{user?.email}</h1>
    )
}