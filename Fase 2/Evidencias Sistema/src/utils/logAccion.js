import { supabase } from "../lib/supabase";

export async function registrarAccion({ id_usuario, accion, detalle }) {
  try {
    const { error } = await supabase.from("LogAccion").insert([
      {
        id_usuario,
        accion,
        detalle,
      },
    ]);

    if (error) {
      throw error; // Lanza el error para que pueda ser manejado en el componente
    }
  } catch (err) {
    console.error("Error registrando acción en LogAccion:", err);
    throw err; // Lanza el error para que pueda ser manejado en el componente
  }
}