# Repositories Viewer

Una aplicación web moderna para visualizar repositorios de GitHub, construida con Laravel (Backend) y Angular 18 (Frontend).

## 🚀 Características

- Búsqueda de repositorios por nombre de usuario de GitHub
- Filtrado por lenguaje de programación
- Scroll infinito para cargar más repositorios
- Interfaz moderna y responsive
- Animaciones suaves y transiciones elegantes
- Visualización detallada de cada repositorio

## 📋 Prerrequisitos

### Backend (Laravel)
- PHP >= 8.1
- Composer
- Laravel CLI

### Frontend (Angular)
- Node.js >= 18.19.0
- npm o yarn
- Angular CLI 18.x

## 🔧 Instalación

### Backend (Laravel)

1. Navega al directorio del backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
composer install
```

3. Copia el archivo de configuración:
```bash
cp .env.example .env
```

4. Genera la clave de la aplicación:
```bash
php artisan key:generate
```

5. (Opcional) Si deseas usar un token de GitHub para aumentar el límite de peticiones a la API:
   - Genera un token en GitHub (Settings > Developer settings > Personal access tokens)
   - Agrega el token en el archivo `.env`:
   ```
   GITHUB_TOKEN=tu_token_aquí
   ```

### Frontend (Angular)

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de configuración:
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

4. Actualiza la URL de la API en `src/environments/environment.ts`

## 🚀 Ejecución del Proyecto

### Backend

1. Inicia el servidor de Laravel:
```bash
cd backend
php artisan serve
```
El backend estará disponible en `http://localhost:8000`

### Frontend

1. Inicia el servidor de desarrollo de Angular:
```bash
cd frontend
ng serve
```
El frontend estará disponible en `http://localhost:4200`

## 🌐 Uso

1. Abre tu navegador y ve a `http://localhost:4200`
2. Ingresa un nombre de usuario de GitHub en el campo de búsqueda por ejemplo (kleideradrian99)
3. Los repositorios se cargarán automáticamente
4. Usa el filtro de lenguaje para encontrar repositorios específicos
5. Desplázate hacia abajo para cargar más repositorios

## 🛠️ Construido con

### Backend
- [Laravel](https://laravel.com/) - El framework PHP más elegante
- [Guzzle](https://docs.guzzlephp.org/) - Cliente HTTP para PHP

### Frontend
- [Angular 18](https://angular.dev/) - Framework web moderno
- [Angular Material](https://material.angular.io/) - Componentes UI Material Design
- [RxJS](https://rxjs.dev/) - Biblioteca para programación reactiva

## 📝 Notas Adicionales

- Asegúrate de que tanto el backend como el frontend estén ejecutándose simultáneamente
- El backend debe estar corriendo en el puerto 8000 para que el frontend pueda comunicarse correctamente
- La aplicación utiliza la API pública de GitHub, que tiene un límite de peticiones. Si necesitas un límite mayor, configura un token de GitHub en el backend

## ✨ Autor

- **Kleider Machado** - *Trabajo Inicial* - [kleideradrian99](https://github.com/kleideradrian99)