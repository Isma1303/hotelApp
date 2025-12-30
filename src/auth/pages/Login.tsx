import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../shared/store/store";
import { LoginForm } from "../components/LoginForm";

export const Login = () => {
    const navigate = useNavigate();
    const { isAuthenticated, checkAuth } = useStore();

    useEffect(() => {
        if (isAuthenticated && checkAuth()) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, checkAuth, navigate]);

    return <LoginForm />;
}