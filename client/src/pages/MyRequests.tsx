import React, { useEffect, useState } from 'react';
import pb from '../server/Connection';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const authData = pb.authStore.model;
        const userId = authData?.id;

        if (!userId) throw new Error('User not authenticated');

        const records = await pb.collection('lodgingRequest').getFullList<Request>({
          filter: `applicant="${userId}"`,
          sort: '-created',
        });

        const lodgingIds = Array.from(new Set(records.map(req => req.lodging)));
        const lodgingsData = await Promise.all(
          lodgingIds.map(id => pb.collection('lodging').getOne<Lodging>(id))
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

  const handleCancelRequest = async (requestId: string) => {
    try {
      await pb.collection('lodgingRequest').delete(requestId);
      setRequests(requests.filter(request => request.id !== requestId));
      toast.success('Solicitud cancelada exitosamente');
    } catch (error) {
      console.error('Error canceling request:', error);
      toast.error('Error al cancelar la solicitud');
    }
  };

  const requestStatusMap = {
    SENT: "Enviado",
    ACCEPTED: "Aceptado",
    REJECTED: "Rechazado",
    ON_EVALUATION: "En evaluación",
  };

  return (
    <div className="container mx-auto pt-4 mt-20 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-500 my-4">Tus Solicitudes</h1>
      <div className="space-y-4">
        {requests.map((request) => {
          const lodging = lodgings[request.lodging];
          return (
            <div key={request.id} className="bg-gray-200 p-4 m-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                {lodging && (
                  <img
                    src={pb.files.getUrl(lodging, lodging.image)}
                    alt={lodging.title}
                    className="h-24 w-25   rounded-lg mr-4 object-cover"
                  />
                )}
                <div>
                  <div className="text-gray-600  text-lg font-bold">
                    {lodging?.title || "Ubicación desconocida"}
                  </div>
                  <div className="flex space-x-4">
                    <div>Fecha de Creación: {new Date(request.created).toLocaleDateString()}</div>
                    <div>Precio Propuesto: ${request.proposedPrice}</div>
                    <div>
                      Estado: {requestStatusMap[request.status] || request.status}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleCancelRequest(request.id)}
                  className="bg-red-500 text-white px-4 py-2 mr-5 font-bold font-barlowc rounded hover:bg-red-700"
                >
                  Eliminar
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







