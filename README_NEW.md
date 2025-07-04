# 🐾 Puma Chile - Frontend de Plataforma B2B de Órdenes

Frontend de la aplicación web desarrollada para Puma Chile, diseñada para automatizar y simplificar el proceso de ingreso de órdenes de compra entre clientes y el equipo de Customer Service.

## 🛠 Tecnologías utilizadas

- **Framework:** React.js
- **Enrutamiento:** React Router
- **Peticiones HTTP:** Axios
- **Gráficos:** Recharts
- **Autenticación:** JWT (JSON Web Tokens)
- **Estilos:** CSS3 personalizado
- **Fuentes:** Segoe UI, sans-serif

## 🌐 Funcionalidades del Frontend

### Para Clientes:
- 📤 **Carga de archivos:** Interfaz intuitiva para subir órdenes en Excel, CSV o PDF
- 📊 **Historial de órdenes:** Visualización del estado de todas las órdenes enviadas
- 👤 **Panel personalizado:** Header dinámico con logo de empresa y saludo personalizado
- 🔍 **Estados en tiempo real:** Badges coloridos para identificar el estado (aprobado, pendiente, error)

### Para Administradores (Customer Service):
- 📈 **Dashboard analítico:** Gráficos de barras y pie charts para visualizar estadísticas
- ✅ **Validación de órdenes:** Herramientas para aprobar o rechazar órdenes pendientes
- 📥 **Descarga de archivos:** Función para descargar órdenes validadas
- 🎯 **Gestión centralizada:** Tabla interactiva con todas las órdenes del sistema

## 🔐 Sistema de Autenticación

- **Login unificado:** Una sola página de acceso para ambos tipos de usuario
- **Redirección automática:** Basada en rol (cliente → `/client`, admin → `/admin`)
- **Protección de rutas:** Verificación automática de autenticación
- **Logout seguro:** Limpieza de tokens y redirección

## 🎨 Diseño y UX

- **Responsive Design:** Adaptable a diferentes tamaños de pantalla
- **Logos dinámicos:** Cada cliente ve su propio logo de empresa
- **Feedback visual:** Estados de órdenes con colores semánticos
- **Interfaz moderna:** Bordes redondeados, sombras sutiles y tipografía clara

## 📁 Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── OrderTable.jsx
│   └── OrderUpload.jsx
├── pages/              # Páginas principales
│   ├── Login.jsx       # Página de autenticación
│   ├── ClientView.jsx  # Dashboard del cliente
│   └── AdminDashboard.jsx # Dashboard administrativo
├── styles/             # Estilos CSS
│   ├── Login.css
│   ├── ClientView.css
│   └── AdminDashboard.css
├── utils/              # Utilidades
│   └── authUtils.js    # Funciones de autenticación
└── App.js             # Componente principal y rutas
```

## 🚀 Instrucciones para ejecutar

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

### Scripts disponibles

- `npm start` - Ejecuta la app en modo desarrollo
- `npm test` - Ejecuta las pruebas unitarias
- `npm run build` - Construye la app para producción
- `npm run eject` - Extrae la configuración (irreversible)

## 🔧 Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:5000
```

## 📦 Dependencias principales

- `react` - Librería principal
- `react-router-dom` - Manejo de rutas
- `axios` - Cliente HTTP
- `recharts` - Gráficos y visualizaciones
- `jwt-decode` - Decodificación de tokens JWT

## 🎯 Características técnicas

- **Autenticación JWT:** Manejo seguro de sesiones
- **Estado global:** Gestión eficiente del estado de la aplicación
- **Componentización:** Código modular y reutilizable
- **Responsive:** Adaptable a móviles y tablets
- **Optimizado:** Build optimizado para producción

## 📸 Capturas de pantalla

- **Login:** Página de autenticación con logo de Puma
- **Dashboard Cliente:** Panel personalizado con carga de archivos e historial
- **Dashboard Admin:** Gráficos estadísticos y tabla de validación de órdenes

## 🤝 Desarrollo

Este proyecto fue creado con [Create React App](https://github.com/facebook/create-react-app) para un desarrollo rápido y eficiente del MVP para Puma Chile.

## 🔗 Enlaces relacionados

- [Documentación de React](https://reactjs.org/)
- [Create React App](https://github.com/facebook/create-react-app)
- [Recharts Documentation](https://recharts.org/)
