import ClearIcon from '@mui/icons-material/Clear';
import { zodResolver } from "@hookform/resolvers/zod";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChairIcon from "@mui/icons-material/Chair";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import PetsIcon from "@mui/icons-material/Pets";
import SecurityIcon from "@mui/icons-material/Security";
import TvIcon from "@mui/icons-material/Tv";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import "leaflet/dist/leaflet.css";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  SxProps,
  TextField,
  Typography
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import addImageIcon from "../assets/addImage.svg";
import SprayBottleIcon from "../assets/sprayBottle.svg";
import ToiletIcon from "../assets/toilet.svg";
import PupilinkButton from "../components/PupilinkButton";
import CheckboxInput from "../components/form/CheckboxInput";
import NumericInput from "../components/form/NumericInput";
import RadioGroupInput, { RadioGroupType } from "../components/form/RadioGroupInput";
import TextInput from "../components/form/TextInput";
import LodgingStatus from "../enums/LodgingStatus";
import LodgingType from "../enums/LodgingType";
import FormUtils from "../utils/FormUtils";
import { PublishLodgingRequest, PublishLodgingSchema } from "../utils/PublishLodgingSchema";
import LodgingService from '../services/LodgingService';
import { useNavigate } from 'react-router-dom';
import PupilinkRoutes from '../enums/PupilinkRoutes';
import { MapContainer, TileLayer, useMap,  useMapEvent, Marker, Popup } from "react-leaflet";
import { Marker as LeafletMarker } from "leaflet";
import { toast, ToastOptions } from 'react-toastify';
import Navbar from '../components/Navbar';

const formTitleStyle: SxProps = {
  fontFamily: "Barlow Condensed, Arial",
  mt: 1,
  fontSize: "1.25rem",
  fontWeight: "500",
  color: "#686D76",
};

const formDescriptionStyle: SxProps = {
  fontFamily: "Barlow Condensed, Arial",
  mt: 1,
  fontSize: "1rem",
  fontWeight: "400",
  color: "#686D76",
};

const extraTitleStyle: SxProps = {
  fontFamily: "Barlow Condensed, Arial",
  fontSize: "1rem",
  fontWeight: "400",
  color: "#686D76",
  ml: "5px",
};

const extraParentBoxStyle: SxProps = {
  display: "flex",
  alignItems: "center",
};

const extraChildBoxStyle: SxProps = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #865DFF",
  borderRadius: "0.5rem",
  padding: "0.25rem 0.5rem",
  bgcolor: "#ffffff",
  minWidth: { xs: "100px", sm: "15vw" },
  maxWidth: "200px",
  mr: 1,
};

const lodgingStatusRadioOptions: RadioGroupType<LodgingStatus>[] = [
  {
    name: "Disponible",
    value: LodgingStatus.AVAILABLE,
  },
  {
    name: "Reservado",
    value: LodgingStatus.BOOKED,
  },
  {
    name: "Alquilado",
    value: LodgingStatus.RENTED,
  },
  {
    name: "No disponible",
    value: LodgingStatus.UNAVAILABLE,
  },
  {
    name: "En mantenimiento",
    value: LodgingStatus.UNDER_MAINTENANCE,
  }
];

const lodgingTypeRadioOptions: RadioGroupType<LodgingType>[] = [
  {
    name: "Apartamento",
    value: LodgingType.APARTMENT,
  },
  {
    name: "Estudio",
    value: LodgingType.STUDIO,
  },
  {
    name: "Casa",
    value: LodgingType.HOUSE,
  },
  {
    name: "Habitación",
    value: LodgingType.ROOM,
  },
  {
    name: "Residencial Estudiantil",
    value: LodgingType.STUDENT_RESIDENCE,
  },
]

interface ClickHandlerProps {
  setCoordinates: React.Dispatch<React.SetStateAction<{ lat: string; lng: string } | null>>;
}
const PublishForm = () => {
  const [coordinates, setCoordinates] = useState<{ lat: string; lng: string } | null>(null);
  const [searchAddress, setSearchAddress] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const { handleSubmit, control, setValue, formState: { errors } } = useForm<PublishLodgingRequest>({ resolver: zodResolver(PublishLodgingSchema) });
  const navigate = useNavigate();
  const markerRef = useRef<LeafletMarker | null>(null);

  const toastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const clearImage = () => {
    setImage(null);
    setValue("image", null);
  }

  const searchLocation = async () => {
    if (!searchAddress) return;

    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`);
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon, display_name } = data[0];
      setCoordinates({ lat, lng: lon });
      setValue("location", display_name);
    } else {
      toast.error("No se encontró la ubicación", toastOptions);
    }
  };
  

  const ClickHandler = ({ setCoordinates }: ClickHandlerProps) => {
    useMapEvent("click", (event) => {
      const { lat, lng } = event.latlng;
      setCoordinates({ lat: lat.toString(), lng: lng.toString() });
    });
    return null;
  };

  const MapCenterer = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], 16);
    }, [lat, lng]);
    return null;
  };

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [coordinates]);

  const onSubmit = async (data: PublishLodgingRequest) => {
    try {
      data.latitude = coordinates?.lat ? coordinates.lat : "0";
      data.longitude = coordinates?.lng ? coordinates.lng : "0";

      const response = await LodgingService.createLodging(data);

      toast.success("Alojamiento publicado con exito", {
        ...toastOptions,
        style: { backgroundColor: "white", color: "green" },
        progressStyle: { backgroundColor: "green" },
      });
      setTimeout(() => {
        navigate(PupilinkRoutes.ROOT);
      }, 1000);
    } catch (error) {
      toast.error("Error al registrar alojamiento", {
        ...toastOptions,
        style: { backgroundColor: "white", color: "red" },
        progressStyle: { backgroundColor: "red" },
      });
      console.error(error);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error("Por favor revisa que todos los campos esten llenos", {
        ...toastOptions,
        style: { backgroundColor: "white", color: "red" },
        progressStyle: { backgroundColor: "red" },
      });
    }
  }, [errors]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setValue("image", file);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [setValue]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <>
      <Navbar/>
      <Grid
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
        sx={{ bgcolor: "#F5F5F5", width: "98%", marginInline: "auto", my: 2, mt: { xs: 10, md: 12 } }}
        container
        spacing={2}
      >
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Typography
              variant="h1"
              sx={{
                mt: 1,
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#686D76",
              }}
            >
              Formulario para agregar una nueva propiedad
            </Typography>
            <Box>
              <Typography sx={formTitleStyle}>Titulo</Typography>
              <Typography sx={formDescriptionStyle}>
                Agrega un título corto a tu publicación para que sea fácil de leer
                para los interesados
              </Typography>
              <TextInput name="title" control={control} multiline />
            </Box>
            <Box>
              <Typography sx={formTitleStyle}>Descripción</Typography>
              <Typography sx={formDescriptionStyle}>
                Agrega una descripción conciza del espacio que estas dando en
                alquiler
              </Typography>
              <TextInput name="description" control={control} multiline />
            </Box>
            <Box>
              <Typography sx={formTitleStyle}>Tipo</Typography>
              <Typography sx={formDescriptionStyle}>
                Selecciona el tipo de lugar según nuestras categorias ya
                establecidas
              </Typography>
              <RadioGroupInput
                control={control}
                name="type"
                options={lodgingTypeRadioOptions}
              />
            </Box>
            <Box>
              <Typography sx={formTitleStyle}>Estado</Typography>
              <Typography sx={formDescriptionStyle}>
                Selecciona el estado de disponibilidad con el que cuenta actualmente
                el lugar que estas dando en alquiler
              </Typography>
              <RadioGroupInput
                control={control}
                name="status"
                options={lodgingStatusRadioOptions}
              />
            </Box>
            <Box>
              <Typography sx={formTitleStyle}>Precio</Typography>
              <Typography sx={formDescriptionStyle}>
                Indica el precio por el cual vas a alquilar el lugar
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field, formState: { errors } }) => {
                    const formError = FormUtils.getFormError("price", errors);
                    return (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        error={!!formError}
                        helperText={formError}
                        size="small"
                        id={`input-price`}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": { bgcolor: "#dcdce8" },
                          fontFamily: "Barlow Condensed, Arial",
                          "& > *": { paddingLeft: "0px !important" },
                        }}
                        inputProps={{
                          sx: { fontSize: "0.88rem", paddingBlock: "0.25rem" },
                        }}
                        InputProps={{
                          type: "number",
                          startAdornment: (
                            <InputAdornment
                              sx={{
                                color: "#865DFF",
                                paddingLeft: "0.5rem !important",
                              }}
                              position="start"
                            >
                              <AttachMoneyIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    );
                  }}
                />
              </Box>
            </Box>
            <Box>
              <Typography sx={formTitleStyle}>Fecha de disponibilidad</Typography>
              <Typography sx={formDescriptionStyle}>
                Indica la fecha en que estara disponible el lugar que daras en
                alquiler
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Controller
                  name="available"
                  control={control}
                  render={({ field, formState: { errors } }) => {
                    const formError = FormUtils.getFormError("available", errors);
                    return (
                      <DatePicker
                        {...field}
                        value={field.value ?? null}
                        slots={{
                          openPickerIcon: () => (
                            <CalendarMonthIcon
                              sx={{
                                color: "#865DFF",
                                "&:hover": { color: "#571FFF" },
                              }}
                            />
                          ),
                        }}
                        slotProps={{
                          inputAdornment: {
                            position: "start",
                          },
                          textField: {
                            size: "small",
                            error: !!formError,
                            helperText: formError,
                            sx: {
                              "& *": {
                                fontSize: "0.88rem !important",
                                paddingBlock: "0rem !important",
                              },

                              fontFamily: "Barlow Condensed, Arial",
                              "& > *": {
                                paddingBlock: "0.25rem !important",
                              },
                              "& .MuiOutlinedInput-root": { bgcolor: "#dcdce8" },
                            },
                          },
                        }}
                      />
                    );
                  }}
                />
              </Box>
            </Box>
            <Box>
              <Typography sx={formTitleStyle}>Reglas de convivencia</Typography>
              <Typography sx={formDescriptionStyle}>
                En este apartado puedes indicar de manera textual algunas reglas o
                normas que quieras que los inquilinos sepan si es que desean mudarse
                al lugar que estas dando en alquiler
              </Typography>
              <TextInput name="coexistenceRules" control={control} multiline />
            </Box>
            <Box>
              <Typography sx={formTitleStyle}>Dirección</Typography>
              <Typography sx={formDescriptionStyle}>
                En la siguiente seccion coloque la dirección exacta del lugar que
                esta dando en alquiler
              </Typography>
              <TextInput name="location" control={control} multiline />
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", gap: 1, height: "100%" }}>
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                border: "1px solid #686D76",
                height: "100% !important",
                marginBlock: "auto",
              }}
            />

            <Stack spacing={2}>
              <Box>
                <Typography sx={formTitleStyle}>Extras</Typography>
                <Typography sx={formDescriptionStyle}>
                  A continuación se presentan una lista de servicios básicos con los
                  que se espera que cuente el lugar que esta dando en alquiler,
                  marca las casillas correspondientes a los servicios con los que
                  cuenta tu lugar
                </Typography>
                <Box display={"flex"} flexWrap={"wrap"} gap={2}>
                  <Box sx={extraParentBoxStyle}>
                    <CheckboxInput name="extras.petFriendly" control={control} />
                    <Box sx={extraChildBoxStyle}>
                      <PetsIcon sx={{ color: "#865DFF" }} />
                      <Typography sx={extraTitleStyle}>Mascotas</Typography>
                    </Box>
                  </Box>
                  <Box sx={extraParentBoxStyle}>
                    <CheckboxInput name="extras.commonAreas" control={control} />
                    <Box sx={extraChildBoxStyle}>
                      <ChairIcon sx={{ color: "#865DFF" }} />
                      <Typography sx={extraTitleStyle}>Sala Compartida</Typography>
                    </Box>
                  </Box>
                  <Box sx={extraParentBoxStyle}>
                    <CheckboxInput name="extras.yard" control={control} />
                    <Box sx={extraChildBoxStyle}>
                      <LocalFloristIcon sx={{ color: "#865DFF" }} />
                      <Typography sx={extraTitleStyle}>Jardín</Typography>
                    </Box>
                  </Box>
                  <Box sx={extraParentBoxStyle}>
                    <CheckboxInput name="extras.cleaningService" control={control} />
                    <Box sx={extraChildBoxStyle}>
                      <Box
                        component={"img"}
                        src={SprayBottleIcon}
                        alt="toilet icon"
                        sx={{ width: "1.5rem", height: "1.5rem" }}
                      />
                      <Typography sx={extraTitleStyle}>
                        Servicio de limpieza
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={extraParentBoxStyle}>
                    <CheckboxInput name="extras.satelliteTV" control={control} />
                    <Box sx={extraChildBoxStyle}>
                      <TvIcon sx={{ color: "#865DFF" }} />
                      <Typography sx={extraTitleStyle}>TV Satelital</Typography>
                    </Box>
                  </Box>
                  <Box sx={extraParentBoxStyle}>
                    <CheckboxInput name="extras.laundryService" control={control} />
                    <Box sx={extraChildBoxStyle}>
                      <LocalLaundryServiceIcon sx={{ color: "#865DFF" }} />
                      <Typography sx={extraTitleStyle}>Lavanderia</Typography>
                    </Box>
                  </Box>
                  <Box sx={extraParentBoxStyle}>
                    <CheckboxInput name="extras.parkingLot" control={control} />
                    <Box sx={extraChildBoxStyle}>
                      <DirectionsCarIcon sx={{ color: "#865DFF" }} />
                      <Typography sx={extraTitleStyle}>Estacionamiento</Typography>
                    </Box>
                  </Box>
                  <Box sx={extraParentBoxStyle}>
                    <CheckboxInput name="extras.privateSecurity" control={control} />
                    <Box sx={extraChildBoxStyle}>
                      <SecurityIcon sx={{ color: "#865DFF" }} />
                      <Typography sx={extraTitleStyle}>
                        Seguridad Privada
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography sx={formTitleStyle}>Velocidad de internet</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <NumericInput
                    name="extras.internet"
                    control={control}
                    icon={<WifiOutlinedIcon />}
                  />
                </Box>
              </Box>
              <Box>
                <Typography sx={formTitleStyle}>Cantidad de habitaciones</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <NumericInput
                    name="extras.rooms"
                    control={control}
                    icon={<HotelIcon />}
                  />
                </Box>
              </Box>
              <Box>
                <Typography sx={formTitleStyle}>Cantidad de baños</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <NumericInput
                    name="extras.bathrooms"
                    control={control}
                    icon={
                      <Box
                        component={"img"}
                        src={ToiletIcon}
                        alt="Toilet icon"
                        sx={{ width: "18px", height: "18px" }}
                      />
                    }
                  />
                </Box>
              </Box>
              <Box>
                <Typography sx={formTitleStyle}>Fotografía del lugar</Typography>
                <Typography sx={formDescriptionStyle}>
                  Coloca una fotografía que muestre el mejor ángulo y capte lo
                  mejor del lugar que deseas anunciar en nuestra aplicación
                </Typography>
                {!image ? (
                  <Box
                    {...getRootProps({ className: "dropzone" })}
                    sx={{
                      bgcolor: "#D9D9D9",
                      width: "100%",
                      minHeight: "330px",
                      borderRadius: "10px",
                      mt: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box component={"input"} {...getInputProps()} />
                    <Stack
                      sx={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Box
                        component={"img"}
                        src={addImageIcon}
                        alt="add image"
                        sx={{ width: "100px", height: "100px" }}
                      />
                      <Typography
                        sx={{ ...formDescriptionStyle, fontSize: "0.75rem" }}
                      >
                        Arrastre o suba aquí la fotografía de su espacio,
                        formatos permitidos PNG, JPG
                      </Typography>
                      {!!errors.image && (
                        <Typography
                          sx={{ color: "#d32f2f", fontSize: "0.75rem" }}
                        >
                          {`${errors.image?.message  ??
                            "La imagen es obligatoria"}`}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      maxHeight: "330px",
                      borderRadius: "10px",
                      mt: 1,
                      position: "relative",
                    }}
                  >
                    <IconButton
                      onClick={clearImage}
                      sx={{
                        backgroundColor: "rgba(0,0,0, 0.45)",
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                      }}
                    >
                      <ClearIcon sx={{ color: "white" }} />
                    </IconButton>
                    <Box
                      component={"img"}
                      src={`${image}`}
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "300px",
                        borderRadius: "10px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography sx={formDescriptionStyle}>
            En el siguiente visor de mapa le pedimos que marque de la manera
            más certera posible la localización del lugar que desea publicar
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ mt: 2 }}>Buscar dirección</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              placeholder="Ejemplo: San Benito, San Salvador"
              size="small"
              fullWidth
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
            />
            <PupilinkButton type="button" onClick={searchLocation}>Buscar</PupilinkButton>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ height: { xs: "40vh", md: "calc(50vh - 50px)" } }}>
          <MapContainer center={[13.6989, -89.1914]} zoom={9} style={{ height: "90%", width: "99%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ClickHandler setCoordinates={setCoordinates} />
            {coordinates && (
              <>
              <MapCenterer lat={Number(coordinates.lat)} lng={Number(coordinates.lng)} />
              <Marker
                position={[Number(coordinates.lat), Number(coordinates.lng)]}
                ref={markerRef}
              >
                <Popup>
                  <Typography sx={{ ...formDescriptionStyle }}>
                    La dirección ingresada posee coordenadas de Latitud:{" "}
                    {coordinates.lat} y Longitud: {coordinates.lng}
                  </Typography>
                </Popup>
              </Marker>
              </>
            )}
          </MapContainer>
        </Grid>

        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <PupilinkButton type="submit">Publicar pupilaje</PupilinkButton>
        </Grid>
      </Grid>
    </>
  );
};

export default PublishForm;

