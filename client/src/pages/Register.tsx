import React, { useState } from "react";
import logo from "../assets/PupiLinks_menu.png";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyIcon from '@mui/icons-material/Key';
import { Link, useNavigate } from "react-router-dom";
import pb from "../server/Connection.ts";  
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PupilinkRoutes from "../enums/PupilinkRoutes.ts";
import AuthService from "../services/AuthService.ts";

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const toastOptions: ToastOptions = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            toast.error('Las contraseñas no coinciden', {
                ...toastOptions,
                style: { backgroundColor: 'red', color: 'white' },
                progressStyle: { backgroundColor: 'white' }
            });
            return;
        }

        try {
            await pb.collection('users').create({
                email,
                password,
                passwordConfirm,
                name,
            });
            toast.success('Usuario registrado con éxito', {
                ...toastOptions,
                style: { backgroundColor: 'white', color: 'green' },
                progressStyle: { backgroundColor: 'green' }
            });

            await AuthService.login(email, password);
            navigate(PupilinkRoutes.ROOT);
        } catch (error) {
            toast.error('Error al registrar usuario', {
                ...toastOptions,
                style: { backgroundColor: 'white', color: 'red' },
                progressStyle: { backgroundColor: 'red' }
            });
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-barlow">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <ToastContainer />
                <div className="flex flex-col items-center mb-4">
                    <div className="flex justify-center mb-4">
                        <span className="text-gray-500 text-lg font-medium">Registrarse</span>
                    </div>
                </div>
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="Logo" className="h-32" />
                </div>
                

                <form onSubmit={handleRegister}>
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
                    <div className="mb-4 relative">
                        <label htmlFor="passwordConfirm" className="block text-gray-700 sr-only">Confirmar Contraseña</label>
                        <input 
                            type="password" 
                            id="passwordConfirm" 
                            className="w-full px-3 py-2 border border-custom-purple rounded-lg focus:outline-none focus:border-purple-600 pl-10" 
                            placeholder="Confirmar Contraseña"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <KeyIcon className="text-gray-400" />
                        </div>
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="name" className="block text-gray-700 sr-only">Nombre</label>
                        <input 
                            type="text" 
                            id="name" 
                            className="w-full px-3 py-2 border border-custom-purple rounded-lg focus:outline-none focus:border-purple-600 pl-10" 
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    
                    <button type="submit" className="w-full py-2 text-white text-xl font-bold bg-custom-purple rounded-full shadow-lg hover:bg-purple-700">
                        Registrarse
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <span className="text-gray-700">¿Ya tienes cuenta? </span>
                    <Link to="/login" className="text-custom-purple hover:underline">Inicia Sesion Aqui</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;




