# Sistema de Gestión de Inventario

Este proyecto es un backend desarrollado con NestJS para un sistema de gestión de inventario empresarial.

## Descripción

Sistema completo para la gestión de inventario, que permite el registro y control de productos, proveedores, categorías, empresas, movimientos de inventario, generación de alertas por stock bajo, y reportes personalizados.

## Características principales

- **Autenticación y autorización**: Sistema de login/registro con JWT y control de acceso basado en roles
- **Gestión de usuarios**: Administración de usuarios y asignación de roles
- **Empresas y proveedores**: Registro y gestión de empresas y sus proveedores
- **Catálogo de productos**: Organización de productos por categorías
- **Control de inventario**: Seguimiento de stock de productos con historial de movimientos
- **Alertas de stock**: Notificaciones en tiempo real cuando el stock llega a niveles mínimos
- **Pedidos**: Gestión de pedidos a proveedores 
- **Reportes**: Generación de informes personalizados

## Estructura del proyecto

```
/src
  /config                    - Configuraciones de la aplicación
  /common                    - Elementos compartidos en la aplicación
  /auth                      - Módulo de autenticación
  /usuarios                  - Módulo de usuarios
  /roles                     - Módulo de roles
  /empresas                  - Módulo de empresas
  /proveedores               - Módulo de proveedores
  /categorias                - Módulo de categorías
  /productos                 - Módulo de productos
  /inventario                - Módulo de inventario
  /movimientos               - Módulo de movimientos de inventario
  /alertas                   - Módulo de alertas de stock
  /reportes                  - Módulo de reportes
  /pedidos                   - Módulo de pedidos
  app.module.ts              - Módulo principal
  main.ts                    - Punto de entrada de la aplicación
```

## Requisitos previos

- Node.js (v14 o superior)
- npm o yarn
- Base de datos PostgreSQL

## Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/sistema-inventario.git
cd sistema-inventario
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=inventario_db
JWT_SECRET=tu_clave_secreta_jwt
```

4. Iniciar la aplicación en modo desarrollo
```bash
npm run start:dev
```

## Documentación API

La documentación de la API está disponible en `/api/docs` después de iniciar la aplicación, implementada con Swagger.

## Tecnologías utilizadas

- NestJS - Framework de desarrollo
- TypeORM - ORM para la base de datos
- PostgreSQL - Base de datos relacional
- Passport & JWT - Autenticación
- Swagger - Documentación de API
- WebSockets - Notificaciones en tiempo real
