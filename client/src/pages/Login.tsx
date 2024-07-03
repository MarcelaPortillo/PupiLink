import React, { useState } from 'react';
import logo from '../assets/PupiLinks_menu.png';
import { Link, useNavigate } from 'react-router-dom';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyIcon from '@mui/icons-material/Key';
import pb from '../server/Connection.ts';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await pb.collection('users').authWithPassword(email, password);
            alert('Inicio de sesión exitoso');
            navigate('/'); // Redirigir a la página principal u otra página después del inicio de sesión
        } catch (error) {
            alert('Error al iniciar sesión');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-barlow">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="Logo" className="h-32" />
                </div>
                <h2 className="text-xl font-regular text-center text-gray-500 mb-6">
                    Inicia sesión y empieza tu nueva experiencia
                </h2>

                <button className="flex items-center w-full mb-4 bg-blue-600 rounded-sm shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                    <div className="flex items-center justify-center bg-white h-full px-3 py-2 rounded-l-sm">
                        <img src="/google.svg" alt="Google" className="h-6 w-6" />
                    </div>
                    <span className="flex-1 text-white text-base font-medium text-center py-2">Iniciar sesión con Google</span>
                </button>

                <div className="flex items-center my-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-2 text-gray-500">o</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-4 relative">
                        <label htmlFor="email" className="block text-gray-700 sr-only">Dirección de correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-custom-purple rounded-lg focus:outline-none focus:border-purple-600 pl-10"
                            placeholder="Dirección de correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <AlternateEmailIcon className="text-gray-400" />
                        </div>
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="password" className="block text-gray-700 sr-only">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-custom-purple rounded-lg focus:outline-none focus:border-purple-600 pl-10"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <KeyIcon className="text-gray-400" />
                        </div>
                    </div>
                    <div className="text-center mb-4">
                        <Link to="/forgot-password" className="text-sm text-custom-purple hover:underline">¿Has olvidado tu contraseña?</Link>
                    </div>
                    <button type="submit" className="w-full py-2 text-white text-xl font-bold bg-custom-purple rounded-full shadow-lg hover:bg-purple-700">
                        Iniciar sesión
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <span className="text-gray-700">¿No tienes una cuenta? </span>
                    <Link to="/register" className="text-custom-purple hover:underline">Regístrate aquí</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;