# Skilltrack

## 👥 Integrantes

- Joaquin Mardones
- Claudio Jara
- Esteban Aguayo

## 📝 Descripción General

Este repositorio corresponde a un proyecto académico enfocado en el desarrollo de una aplicación web para la gestión de talleres, usuarios y evidencias. El desarrollo se realiza principalmente con JavaScript (React) para el frontend y utiliza **Supabase** como backend (Base de Datos y autenticación).

---

## 📁 Estructura del Proyecto

```
Fase 2/
└── Evidencias Sistema/
    └── src/
        ├── components/        # Componentes reutilizables de React
        ├── context/           # Manejo de estado global (React Context)
        ├── lib/               # Librerías y funciones auxiliares
        ├── pages/             # Páginas principales de la app
        ├── services/          # Lógica de interacción con APIs y Supabase
        ├── test/              # Pruebas unitarias (Vitest)
        └── utils/             # Utilidades
```

---

## 🚀 Tecnologías Principales

- **Frontend:** React, JavaScript
- **Backend:** Supabase (Base de datos, autenticación y almacenamiento)
- **Testing:** Vitest, Testing Library (React, Jest-DOM, User-Event)
- **Herramientas auxiliares:** jsdom, React Router, React Toastify

---

## ⚙️ Instalación y Configuración

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/EstebanAguayoB/CP_PTY4614_4_EQP_1.git
   cd CP_PTY4614_4_EQP_1
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Configura variables de entorno**

   Debes agregar tu URL y clave anónima de Supabase en las variables de entorno del frontend:

   ```env
   VITE_SUPABASE_URL=TU_URL_SUPABASE
   VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
   ```

   Crea un archivo `.env` en la raíz y pega estos valores.

---

## 🧪 Pruebas Unitarias

El proyecto implementa pruebas unitarias utilizando **Vitest** para los componentes principales de React.

### Comandos principales

- Ejecutar todas las pruebas:
  ```bash
  npm test
  ```
- Modo watch:
  ```bash
  npm run test:watch
  ```
- Ejecutar con interfaz gráfica:
  ```bash
  npm run test:ui
  ```
- Generar cobertura:
  ```bash
  npm run test:coverage
  ```

### Estructura y Cobertura

Las pruebas están en `src/test/` y cubren:
- Renderizado y presencia de elementos
- Interacciones de usuario y eventos
- Manejo de estados y datos
- Validaciones y mensajes de error
- Navegación y flujos principales
- Funciones CRUD, búsqueda, reportes y modales

**Mocks incluidos:**  
- Supabase (base de datos y autenticación)
- React Router (navegación)
- React Toastify (notificaciones)
- jsPDF (PDFs)
- LocalStorage y SessionStorage

---

## 📈 Buenas Prácticas

- Testing exhaustivo y modular.
- Uso de mocks para dependencias externas.
- Limpieza y aislamiento entre pruebas.
- Documentación clara para contribuir y mantener el proyecto.

---

## 📝 Contribuir

1. Crea un branch desde `main`.
2. Realiza tus cambios siguiendo la estructura y estilo existente.
3. Añade o actualiza pruebas.
4. Realiza un Pull Request.

---

**¡Listo para desarrollar, probar y desplegar!**