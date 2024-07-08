import React, { useEffect, useState } from 'react';
import pb from '../server/Connection';
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

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

interface Location {
  id: string;
  name: string;
}

const MyAds: React.FC = () => {
  const [lodgings, setLodgings] = useState<Lodging[]>([]);
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

        const records = await pb.collection('lodging').getFullList<Lodging>({
          filter: `owner='${userId}'`,
          sort: '-created',
        });
        setLodgings(records);
        console.log(records)
      } catch (error) {
        console.error('Error fetching lodgings:', error);
      }
    };

    fetchLodgings();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await pb.collection('lodging').delete(id);
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

  const lodgingStatusMap = {
  AVAILABLE: 'Disponible',
  BOOKED: 'Reservado',
  RENTED: 'Alquilado',
  UNAVAILABLE: 'No disponible',
  UNDER_MAINTENANCE: 'En mantenimiento',
};

  return (
    <div className="min-h-screen bg-gray-100 p-4 mt-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-500">Mis Anuncios</h2>
        <Link to="/publish" className="bg-custom-purple text-white font-bold font-barlowc px-4 py-2 rounded hover:bg-hover_colors">
          Crear Anuncio
        </Link>
      </div>
      {lodgings.map((lodging) => (
        <div key={lodging.id} className="bg-gray-200 p-4 rounded-lg shadow-md mb-4 flex items-center">
          <img
            src={pb.files.getUrl(lodging, lodging.image)}
            alt={lodging.title}
            className="w-24 h-20 object-cover rounded-md mr-4"
          />
          <div className="flex-grow flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-600 font-barlowc">{lodging.title}</h3>
              <div className="flex space-x-4">
              <p className="text-gray-600">Estado: {lodgingStatusMap[lodging.status]}</p>
                <p className="text-gray-600 font-barlowc">Precio: ${lodging.price}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(lodging.id)}
              className="bg-red-500 text-white px-4 py-2 font-bold font-barlowc rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
};

export default MyAds;



