import { Landing } from "@/pages/Landing"
import { Route, Routes } from "react-router"

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
        </Routes>
    )
}