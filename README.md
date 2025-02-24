# 🏨 Plataforma de Gestión de Hoteles y Reservas

## 📌 Descripción del Proyecto
Este proyecto es una **plataforma web** desarrollada con **React y TypeScript** que permite a los usuarios **gestionar hoteles y realizar reservas**. Se diseñó con un enfoque en la administración de hoteles, habitaciones y clientes, proporcionando una interfaz intuitiva y funcional.

## 🚀 Funcionalidades Principales
- Creación, edición y eliminación de hoteles.
- Administración de habitaciones (precios, capacidad, estado).
- Realización de reservas con validaciones detalladas.
- Gestión de estados de hoteles y habitaciones (habilitar/deshabilitar).
- Visualización de reservas con filtros por hotel y fecha.
- Despliegue automatizado con **GitHub Actions**.

## 🛠️ Desarrollo del Proyecto
### 1️⃣ **Manejo del API con Mocks**
No se desarrollaron servicios web reales para el API. En su lugar, utilizamos **MirageJS** para simular las respuestas del servidor y manejar los datos de manera local sin necesidad de un backend real.

### 2️⃣ **Pruebas Automatizadas**
Se implementaron pruebas automatizadas con **Jest** para validar la renderización básica de los componentes. **Las pruebas son sencillas**, enfocadas en verificar que los componentes se montan correctamente y que los elementos clave existen en la UI.

> ⚠️ **Nota**: No se realizaron pruebas avanzadas de integración o end-to-end debido a la naturaleza del proyecto.

### 3️⃣ **Despliegue con GitHub Actions**
El proyecto se despliega automáticamente en cada `push` o `pull request` utilizando **GitHub Actions**. Se configuró un flujo de trabajo que:
- Instala dependencias.
- Ejecuta las pruebas automatizadas.
- Facilita la integración y la entrega continua.

🔗 **URL del despliegue**: [Hotel System](https://hotel-system-blue.vercel.app/)

### 4️⃣ **Patrones de Diseño Implementados**
Durante el desarrollo del código, aplicamos algunos patrones de diseño clave:
- **Store Pattern** con Zustand para la gestión del estado global.
- **Componentes Reutilizables** para la UI, como formularios y modales.
- **Separación de Responsabilidades** con hooks personalizados y utilidades externas.

### 5️⃣ **Envío de Correos Electrónicos**
El requerimiento de enviar correos electrónicos **no se implementó** porque habría sido necesario **exponer la llave del servicio de correo**, lo cual comprometería la seguridad del sistema. Si hubiéramos implementado esta funcionalidad, habríamos optado por crear un **servicio en Express** para manejar el envío de correos desde el backend, asegurando una mejor gestión de credenciales y seguridad.

## 📂 Estructura del Proyecto
```
📦 src
 ┣ 📂 components        # Componentes reutilizables
 ┣ 📂 pages             # Páginas principales (Home, Login, Hotels, Reservations)
 ┣ 📂 services          # API y lógica de negocio
 ┣ 📂 store             # Gestión de estado con Zustand
 ┣ 📂 types             # Tipado y modelos de datos
 ┣ 📂 Mocks             # Simulación del backend con MirageJS
 ┣ 📂 __tests__         # Pruebas automatizadas con Jest
 ┗ 📜 main.tsx         # Punto de entrada de la aplicación
```

## 📜 Conclusión
Este proyecto demuestra el uso de **React con TypeScript** para construir una plataforma de gestión de hoteles sin necesidad de un backend real. Se implementaron **pruebas automatizadas, mocks de API y despliegue continuo** para garantizar una mejor calidad del software. Aunque no se desarrolló la funcionalidad de envío de correos electrónicos, se dejó documentado cómo podría integrarse en un futuro con una API en **Express**.

> **🚀 Próximos pasos:**
> - Mejorar las pruebas automatizadas con más validaciones.
> - Optimizar la experiencia de usuario en el flujo de reservas.
> - Implementar un backend real para manejar datos de manera persistente.