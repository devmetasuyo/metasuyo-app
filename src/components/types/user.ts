export type UserSession = {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  creado_el: string;
  actualizado_el: string;
  telefono: string | null;
  direccion: string | null;
  wallet: string;
  tipo_documento: string;
  documento: string | null;
  isAdmin?: boolean;
  chainId: number;
};
