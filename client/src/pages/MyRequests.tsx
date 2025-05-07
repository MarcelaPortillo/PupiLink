import React, { useEffect, useState } from 'react';
import getPBInstance from '../utils/PBHelper';
import pb from '../server/Connection';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '../services/AuthService';
import PupilinkRoutes from '../enums/PupilinkRoutes';
import { useNavigate } from 'react-router-dom';

interface Request {
  id: string;
  status: string;
  proposedPrice: number;
  lodging: string;
  created: string;
}

interface Lodging {
  id: string;
  title: string;
  image: string;
}

const MyRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [lodgings, setLodgings] = useState<{ [key: string]: Lodging }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const authData = pb.authStore.model;
        const userId = authData?.id;

        if (!userId) throw new Error('User not authenticated');

        const pbInstance = getPBInstance();
        const records = await pbInstance.collection('lodgingRequest').getFullList<Request>({
          filter: `applicant="${userId}"`,
          sort: '-created',
        });

        const lodgingIds = Array.from(new Set(records.map(req => req.lodging)));
        const lodgingsData = await Promise.all(
          lodgingIds.map(id => {
            const pbInstance = getPBInstance();
            return pbInstance.collection('lodging').getOne<Lodging>(id);
          })
          );

        const lodgingsDict = lodgingsData.reduce((acc, lodging) => {
          acc[lodging.id] = lodging;
          return acc;
        }, {} as { [key: string]: Lodging });

        setRequests(records);
        setLodgings(lodgingsDict);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (!AuthService.isLoggedIn()) {
      navigate(PupilinkRoutes.LOGIN);
    }
  }, [])

  const handleCancelRequest = async (requestId: string) => {
    try {
      const pbInstance = getPBInstance();
      await pbInstance.collection('lodgingRequest').delete(requestId);
      setRequests(requests.filter(request => request.id !== requestId));
      toast.success('Solicitud cancelada');
    } catch (error) {
      console.error('Error canceling request:', error);
      toast.error('Error al cancelar la solicitud');
    }
  };

  return (
    <div className="container mx-auto px-4 mt-20">
      <h1 className="text-2xl font-bold my-4">Tus Solicitudes</h1>
      <div className="space-y-4">
        {requests.map(request => {
          const lodging = lodgings[request.lodging];
          return (
            <div key={request.id} className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                {lodging && (
                  <img src={pb.files.getUrl(lodging, lodging.image)} alt={lodging.title} className="h-24 w-24 rounded-lg mr-4 object-cover" />
                )}
                <div>
                  <div className="text-purple-600 font-bold">{lodging?.title || 'Ubicación desconocida'}</div>
                  <div>Fecha de Creación: {new Date(request.created).toLocaleDateString()}</div>
                  <div>Precio Propuesto: ${request.proposedPrice}</div>
                  <div>Estado: {request.status}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCancelRequest(request.id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRequests;







