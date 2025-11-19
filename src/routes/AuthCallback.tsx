import { useAuthStore } from "@/stores/useAuthStore"
import { useEffect } from "react"
import { useNavigate } from "react-router"

export const AuthCallback = () => {
    const checkSession = useAuthStore((state) => state.checkSession)
    const loading = useAuthStore((state) => state.loading)
    const navigate = useNavigate()
    
    useEffect(() => {
        const handleAuth = async () => {
            await checkSession()
            navigate("/app")
        }
        handleAuth()
    }, [])
    return (
        <div>
            {loading ? "Cargando..." : "Redirigiendo..."}
        </div>
    )
}
