import React, { useEffect, useState } from 'react';
import getPBInstance from '../utils/PBHelper';
import pb from '../server/Connection';
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import PupilinkRoutes from '../enums/PupilinkRoutes';

interface Lodging {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  available: string;
  coexistenceRules: string;
  owner: string;
  location: string;
  extras: string[];
  image: string;
}

interface LodgingRequest {
  id: string;
  status: string;
  proposedPrice: number;
  applicant: string;
  lodging: string;
  created: string;
  expand?: {
    lodging: Lodging;
  };
}

const MyAds: React.FC = () => {
  const [lodgings, setLodgings] = useState<Lodging[]>([]);
  const [requests, setRequests] = useState<LodgingRequest[]>([]);
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

  useEffect(() => {
    const fetchLodgings = async () => {
      try {
        const userId = pb.authStore.model?.id;
        if (!userId) throw new Error('User not authenticated');

        // Fetch user lodgings
        const pbInstance1 = getPBInstance();
        const lodgingRecords = await pbInstance1.collection('lodging').getFullList<Lodging>({
          filter: `owner='${userId}'`,
          sort: '-created',
        });
        setLodgings(lodgingRecords);

        // Fetch requests for user's lodgings
        const pbInstance2 = getPBInstance();
        const requestRecords = await pbInstance2.collection('lodgingRequest').getFullList<LodgingRequest>({
          filter: `lodging.owner='${userId}'`,
          expand: 'lodging',
          sort: '-created',
        });
        setRequests(requestRecords);
      } catch (error) {
        console.error('Error fetching lodgings or requests:', error);
      }
    };

    fetchLodgings();
  }, []);

  useEffect(() => {
    if (!AuthService.isLoggedIn()) {
      navigate(PupilinkRoutes.LOGIN);
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const pbInstance = getPBInstance();
      await pbInstance.collection('lodging').delete(id);
      setLodgings((prevLodgings) => prevLodgings.filter((lodging) => lodging.id !== id));
      toast.success('Anuncio eliminado con éxito', {
        ...toastOptions,
        style: { backgroundColor: 'white', color: 'green' },
        progressStyle: { backgroundColor: 'green' }
      });
    } catch (error) {
      console.error('Error deleting lodging:', error);
      toast.error('Error al eliminar el anuncio', {
        ...toastOptions,
        style: { backgroundColor: 'white', color: 'red' },
        progressStyle: { backgroundColor: 'red' }
      });
    }
  };

  const handleUpdateRequestStatus = async (id: string, status: string) => {
    try {
      const pbInstance = getPBInstance();
      await pbInstance.collection('lodgingRequest').update(id, { status });
      setRequests(prevRequests =>
        prevRequests.map(req => (req.id === id ? { ...req, status } : req))
      );
      toast.success(`Solicitud ${status.toLowerCase()} con éxito`, {
        ...toastOptions,
        style: { backgroundColor: 'white', color: 'green' },
        progressStyle: { backgroundColor: 'green' }
      });
    } catch (error) {
      console.error(`Error updating request status:`, error);
      toast.error(`Error al ${status.toLowerCase()} la solicitud`, {
        ...toastOptions,
        style: { backgroundColor: 'white', color: 'red' },
        progressStyle: { backgroundColor: 'red' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Mis Anuncios</h2>
        <Link to="/publish" className="bg-custom-purple text-white px-4 py-2 rounded hover:bg-hover_colors">
          Crear Anuncio
        </Link>
      </div>
      {lodgings.map((lodging) => (
        <div key={lodging.id} className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center">
          <img
            src={pb.files.getUrl(lodging, lodging.image)}
            alt={lodging.title}
            className="w-20 h-20 object-cover rounded-md mr-4"
          />
          <div className="flex-1">
            <h3 className="font-bold text-custom-purple mb-2">{lodging.title}</h3>
            <p className="text-gray-600">Estado: {lodging.status}</p>
            <p className="text-gray-600">Precio: ${lodging.price}</p>
          </div>
          <button
            onClick={() => handleDelete(lodging.id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      ))}
      <h2 className="text-2xl font-bold mb-4">Solicitudes Recibidas</h2>
      {requests.map((request) => (
        <div key={request.id} className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center">
          {request.expand?.lodging && (
            <img
              src={pb.files.getUrl(request.expand.lodging, request.expand.lodging.image)}
              alt={request.expand.lodging.title}
              className="w-20 h-20 object-cover rounded-md mr-4"
            />
          )}    

          <div className="flex-1">
            <h3 className="font-bold text-custom-purple mb-2">{request.expand?.lodging.title}</h3>
            <p className="text-gray-600">Estado: {request.status}</p>
            <p className="text-gray-600">Precio Propuesto: ${request.proposedPrice}</p>
            <p className="text-gray-600">Fecha de Creación: {new Date(request.created).toLocaleDateString()}</p>
          </div>
          {request.status === 'SENT' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateRequestStatus(request.id, 'ACCEPTED')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Aceptar
              </button>
              <button
                onClick={() => handleUpdateRequestStatus(request.id, 'REJECTED')}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Rechazar
              </button>
            </div>
          )}
        </div>
      ))}
      <ToastContainer />
    </div>
  );
};

export default MyAds;




