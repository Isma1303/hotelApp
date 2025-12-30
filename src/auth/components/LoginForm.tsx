import type { FormEvent } from "react";
import  { useState} from "react";
import { useNavigate } from "react-router-dom";
import { useLoginForm } from "../hooks/useLoginForm";

export const LoginForm = () => {
    const { loading, handleSubmit } = useLoginForm();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const success = await handleSubmit(email, password);
        if (success) {
            navigate("/dashboard");
        }
    };

    const fullYear = new Date().getFullYear()

    return (
        <div className="position-relative auth-screen overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 h-100 auth-gradient" aria-hidden />
            <div className="position-absolute top-50 start-50 translate-middle login-glow" aria-hidden />

            <div className="container position-relative">
                <div className="row justify-content-center py-5">
                    <div className="col-12 col-md-10 col-lg-6">
                        <div className="card bg-dark border border-opacity-25 border-secondary rounded-4 shadow-lg auth-card">
                            <div className="card-body p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-3 p-3 mb-3">
                                        <i className="bi bi-buildings-fill fs-2" aria-hidden />
                                    </div>
                                    <h2 className="fw-bold text-white mb-2">Dashboard Administrativo</h2>
                                    <p className="text-secondary mb-0 small">
                                        Bienvenido de nuevo. Ingrese sus credenciales para acceder al panel de control.
                                    </p>
                                </div>

                                <form onSubmit={onSubmit} className="needs-validation" noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label text-secondary small fw-semibold">
                                            Correo Electrónico
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text text-secondary bg-body-secondary border-0">
                                                <i className="bi bi-envelope-fill" aria-hidden />
                                            </span>
                                            <input
                                                id="email"
                                                type="email"
                                                className="form-control bg-body-secondary border-0 text-light"
                                                placeholder="ejemplo@hotel.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                autoComplete="email"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label text-secondary small fw-semibold">
                                            Contraseña
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text text-secondary bg-body-secondary border-0">
                                                <i className="bi bi-lock-fill" aria-hidden />
                                            </span>
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                className="form-control bg-body-secondary border-0 text-light"
                                                placeholder="********"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary border-0 bg-body-secondary text-secondary"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            >
                                                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"} aria-hidden />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 fw-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? "Ingresando..." : "Iniciar Sesión"}
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <button type="button" className="btn btn-link text-secondary text-decoration-none p-0">
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>

                                <div className="text-center text-secondary small mt-4 pt-3 border-top border-secondary border-opacity-25">
                                    <div className="text-white fw-semibold">Hotel Management System</div>
                                    <div> &copy; Todos los derechos reservados CodeLiq {fullYear}.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};