import PocketBase from "pocketbase";

const PB_URL = "http://localhost:8090";

/**
 * Nueva instancia de PocketBase con autoCancellation desactivado.
 */
export default function getPBInstance() {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);
  return pb;
}
