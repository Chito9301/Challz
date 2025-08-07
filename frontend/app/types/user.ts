export interface User {
  _id: string           // Identificador único (como en MongoDB)
  username?: string     // Nombre de usuario (opcional)
  email?: string        // Email (opcional)
  photoURL?: string     // URL de foto de perfil (opcional)
  // puedes agregar aquí más propiedades que uses en user
}
