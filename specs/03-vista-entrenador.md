# Vista Entrenador

## Dependencias
- Esta tarea DEPENDE de la tarea 01 (Gestión de Rutinas)
- Esta tarea DEPENDE de la tarea 02 (Compartir Rutinas)
- Requiere que la estructura de datos `Routine` esté implementada
- Requiere que el sistema de storage (`routineStorage.ts`) esté funcionando
- Requiere que el sistema de compartir (`routineSharing.ts`) esté implementado

## Problema del Usuario
Los entrenadores de gimnasio necesitan gestionar rutinas para múltiples alumnos de manera eficiente. La interfaz actual está diseñada para usuarios individuales (mobile-first), no para la gestión masiva de rutinas que requiere un entrenador.

## Solución
Crear una vista desktop dedicada para entrenadores donde puedan ver, buscar, gestionar y enviar rutinas a sus alumnos de manera eficiente. Esta vista es 100% compatible con el resto de la app y usa el mismo sistema de almacenamiento y compartir.

## Funcionalidades

### 1. Acceso a la Vista
- Ruta dedicada: `/trainer`
- Acceso directo via URL (no desde la app principal)
- Diseño desktop-first (no mobile-first como la app actual)

### 2. Gestión Masiva de Rutinas
- Vista de lista optimizada para gestión masiva
- Mostrar todas las rutinas en localStorage
- Información densa pero legible (nombre, ejercicios, tiempos)
- Acciones rápidas por rutina (compartir, editar, eliminar)

### 3. Búsqueda y Filtrado
- Buscar rutinas por nombre
- Buscar rutinas por ejercicios que incluyen
- Búsqueda en tiempo real (mientras escribe)
- Resultados destacados de coincidencias

### 4. Enviar a Alumnos
- Botón "Enviar" en cada rutina
- Usa el sistema de compartir de la tarea 02
- Genera enlace comprimido con LZ-String
- El entrenador copia el enlace y lo envía (WhatsApp, email, etc.)

### 5. Gestión Rápida
- Editar rutina directamente desde la vista
- Eliminar rutina con confirmación
- Crear nueva rutina desde la vista
- Todas las acciones usan el sistema de la tarea 01

## Experiencia de Usuario

### Flujo del Entrenador
1. Entrenador accede a `/trainer`
2. Ve todas sus rutinas en formato lista densa
3. Busca rutina por nombre o ejercicio
4. Selecciona rutina y hace clic en "Enviar"
5. Copia el enlace generado
6. Envía el enlace a su alumno (WhatsApp, email, etc.)

### Diseño Desktop-First
- Layout optimizado para pantallas grandes
- Tabla o grid con información densa
- Sin menú hamburguesa, navegación visible
- Accesos directos por teclado si es posible
- Diseño productivo, no minimalista

## Requisitos Técnicos

### Ruta
- Nueva ruta: `/trainer`
- Página independiente: `src/pages/trainer.astro`
- No integrada en la navegación principal de la app

### Almacenamiento
- Usa el mismo localStorage que la app principal
- Keys: `tabata_routines`, `tabata_active_routine`
- Sin separación entre rutinas de entrenador y alumnos
- 100% compatible con el formato de la tarea 01

### Compartir
- Usa el sistema de la tarea 02
- Lógica en `routineSharing.ts`
- Compresión con LZ-String
- Formato de enlace: `?r={datos_comprimidos}`

### Búsqueda
- Búsqueda en tiempo real sobre el array de rutinas
- Filtrado por nombre (case-insensitive)
- Filtrado por ejercicios (includes)
- Combinación de ambos criterios

### Estructura de Datos
- Usa la misma interfaz `Routine` de la tarea 01
- Sin modificaciones al formato
- Sin atributos especiales de "entrenador"

## UI Components Requeridos

### 1. TrainerLayout
- Layout desktop optimizado para gestión masiva
- Header con búsqueda y acciones globales
- Cuerpo con lista/grid de rutinas

### 2. RoutineTable
- Tabla o grid con información densa
- Columnas: nombre, ejercicios, tiempos, acciones
- Filas interactivas con hover states

### 3. SearchBar
- Campo de búsqueda en tiempo real
- Placeholder: "Buscar por nombre o ejercicio..."
- Icono de búsqueda

### 4. QuickActions
- Botones rápidos por rutina: compartir, editar, eliminar
- Dropdown o botones inline
- Confirmación para acciones destructivas

### 5. BulkActions (opcional)
- Seleccionar múltiples rutinas
- Acciones en lote (eliminar, compartir)

## Archivos a Crear/Modificar

### Nuevos
- `src/pages/trainer.astro` - Vista principal del entrenador
- `src/components/TrainerLayout.astro` - Layout desktop
- `src/components/RoutineTable.astro` - Tabla de rutinas
- `src/components/SearchBar.astro` - Barra de búsqueda
- `src/components/QuickActions.astro` - Acciones rápidas

### Modificar
- `src/assets/routineStorage.ts` - Reutilizar sin cambios
- `src/assets/routineSharing.ts` - Reutilizar sin cambios
- `astro.config.mjs` - Agregar ruta `/trainer` si es necesario

## Criterios de Aceptación
- [ ] Vista `/trainer` es accesible y funcional
- [ ] Diseño es desktop-first (no mobile-first)
- [ ] Muestra todas las rutinas del localStorage
- [ ] Búsqueda por nombre funciona correctamente
- [ ] Búsqueda por ejercicios funciona correctamente
- [ ] Búsqueda es en tiempo real
- [ ] Botón "Enviar" genera enlace comprimido
- [ ] Enlace usa el sistema de la tarea 02
- [ ] Editar rutina funciona correctamente
- [ ] Eliminar rutina funciona correctamente
- [ ] Crear rutina funciona correctamente
- [ ] 100% compatible con el formato de la tarea 01
- [ ] 100% compatible con el sistema de compartir de la tarea 02
- [ ] UI es intuitiva para gestión masiva
- [ ] No hay separación de datos entre app y vista entrenador
