# 🚗 Ride Balance

**Ride Balance** es una aplicación web moderna diseñada para conductores que necesitan llevar un control detallado de sus viajes, ingresos, gastos y obtener un resumen claro de su rendimiento y balances financieros en diferentes períodos (semanal, mensual).

---

## 🚀 Stack Tecnológico

El proyecto está construido con tecnologías modernas para ofrecer una experiencia rápida, reactiva y escalable:

- **Frontend Core:** React 19, TypeScript, Vite
- **Estilos:** Tailwind CSS v4, Lucide React (Iconos)
- **Componentes UI:** Radix UI, shadcn/ui
- **Gestión de Estado:** Zustand
- **Routing:** React Router 7
- **Gráficos y Visualización:** Recharts
- **Formularios y Validación:** React Hook Form + Zod
- **Backend / Base de Datos:** Supabase
- **Utilidades:** date-fns (Manejo de fechas)

---

## 📸 Screenshots del Dashboard

*Agrega aquí las capturas de pantalla de la aplicación.*

| Dashboard Principal | Reporte Mensual |
| :---: | :---: |
| ![Dashboard Principal](./public/screenshot-dashboard.webp) | ![Reportes y Gastos](./public/screenshot-reports.webp) |

*(Nota: Reemplaza las rutas de las imágenes una vez que incorpores las capturas reales en el proyecto).*

---

## 🏗️ Arquitectura Modular

El proyecto sigue una arquitectura modular en el `frontend`, enfocada en separar responsabilidades (*Separation of Concerns*) y mantener el código escalable dividiéndolo por dominios de negocio o *features*.

La arquitectura general se compone principalmente de:

- **🗺️ Routes (`src/routes`)**: Archivos encargados de definir y centralizar el enrutamiento de la aplicación a través de React Router. Mapean las URLs hacia los componentes y vistas correspondientes.
- **🎮 Controllers / Pages (`src/features/*/pages`)**: Componentes de React que actúan como "Controladores" de la vista. Coordinan el estado general de la pantalla, invocan a los servicios para la obtención de datos, manejan los estados de carga o error, y proveen la información a los componentes visuales.
- **⚙️ Services (`src/features/*/services`)**: Capa pura de lógica de negocio y comunicación de red. Estos archivos encapsulan todas las peticiones a la API o interacciones con el cliente de **Supabase**. Extraen datos crudos, los formatean garantizando consistencia de tipos (`interfaces/schemas`), y los envían listos para usar a los controladores.

Esta estructura asegura que la lógica de negocio y manipulación de datos no esté acoplada a la interfaz, lo que facilita realizar tests, reutilizar código y mantener la aplicación estable en el tiempo.

---

## 🛠️ Instrucciones de Instalación

Sigue estos pasos para levantar el entorno de desarrollo local:

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd ride-balance
```

### 2. Instalar las dependencias

Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Ejecuta el siguiente comando para descargar los paquetes necesarios:

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea o edita el archivo `.env` en la raíz del proyecto y configura tus credenciales de Supabase:

```env
VITE_SUPABASE_URL="tu_supabase_url"
VITE_SUPABASE_ANON_KEY="tu_supabase_anon_key"
```

### 4. Levantar el entorno de desarrollo

Inicia el servidor local manejado por Vite:

```bash
npm run dev
```

La aplicación estará disponible por defecto en `http://localhost:5173/`.
