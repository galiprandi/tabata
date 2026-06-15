# Gestión de Rutinas

## Alcance
Esta tarea implementa una biblioteca simple de rutinas con las siguientes capacidades:
- ✅ Ver rutinas (listar todas las rutinas creadas)
- ✅ Activar rutinas (seleccionar rutina activa)
- ✅ Eliminar rutinas (borrar rutinas no deseadas)
- ❌ Compartir rutinas (implementado en tarea 02)

## Problema del Usuario
Actualmente el usuario solo puede tener una configuración de ejercicios. Si quiere entrenar diferentes partes del cuerpo o intensidades, tiene que modificar la misma rutina cada vez, perdiendo la configuración anterior.

## Solución
Permitir al usuario crear múltiples rutinas con nombres personalizados y cambiar entre ellas fácilmente antes de cada entrenamiento.

## Funcionalidades

### 1. Crear Rutina
- El usuario puede crear una nueva rutina con un nombre (ej: "Pierna", "Cardio", "Full Body")
- Configura los tiempos y ejercicios para esa rutina específica
- La rutina se guarda automáticamente

### 2. Ver Mis Rutinas
- Lista de todas las rutinas creadas
- Cada rutina muestra su nombre y configuración básica
- Indica cuál es la rutina activa actual

### 3. Cambiar de Rutina
- El usuario selecciona una rutina de la lista
- Esa rutina se marca como "activa"
- El sistema recuerda esta selección para la próxima vez

### 4. Editar Rutina
- El usuario puede modificar ejercicios o tiempos de una rutina existente
- Los cambios se guardan en esa rutina específica

### 5. Eliminar Rutina
- El usuario puede borrar rutinas que ya no usa
- Si borra la rutina activa, el sistema selecciona automáticamente otra

## Experiencia de Usuario

### Flujo Principal
1. Usuario abre la app → ve su rutina activa actual
2. Antes de entrenar, puede cambiar a otra rutina si lo desea
3. Entrena con la rutina seleccionada
4. La próxima vez que abra la app, esa rutina sigue siendo la activa

### Configuración Inicial
- La primera vez, el usuario tiene una rutina por defecto llamada "Mi Rutina"
- Puede crear más rutinas desde el menú de configuración

## Requisitos Técnicos

### Estructura de Datos
```typescript
interface Routine {
  id: string;           // UUID v4
  name: string;         // "Full Body", "Cardio", etc.
  prepDuration: number;
  workDuration: number;
  restDuration: number;
  rounds: number;
  exercises: string[];
}

interface Storage {
  routines: Routine[];
  activeRoutineId: string;  // Última rutina seleccionada
}
```

### Storage Keys
- `tabata_routines`: Array de rutinas
- `tabata_active_routine`: ID de la rutina activa

### Migración
- Convertir el formato actual (`settings`) al nuevo formato
- Crear rutina por defecto "Mi Rutina" con la configuración existente
- Preservar todos los datos del usuario

## UI Components Requeridos

### 1. RoutineList
- Lista de rutinas con nombre y configuración básica
- Indicador visual de rutina activa
- Botones para editar/eliminar/seleccionar

### 2. RoutineForm
- Formulario para crear/editar rutinas
- Campos: nombre, tiempos, ejercicios
- Validación básica

### 3. RoutineSelector
- Dropdown o selector para cambiar rápidamente de rutina
- Integrado en la pantalla principal

## Archivos a Crear/Modificar

### Nuevos
- `src/assets/routineStorage.ts` - Lógica de storage de rutinas
- `src/components/RoutineList.astro` - Lista de rutinas
- `src/components/RoutineForm.astro` - Formulario de rutina
- `src/components/RoutineSelector.astro` - Selector de rutina

### Modificar
- `src/assets/main.ts` - Agregar migración
- `src/pages/settings.astro` - Integrar gestión de rutinas
- `src/pages/index.astro` - Mostrar rutina activa
- `src/pages/start.astro` - Usar rutina activa

## Criterios de Aceptación
- [ ] Usuario puede crear múltiples rutinas con nombres personalizados
- [ ] Usuario puede cambiar entre rutinas
- [ ] Sistema recuerda la última rutina seleccionada
- [ ] Usuario puede editar rutinas existentes
- [ ] Usuario puede eliminar rutinas
- [ ] Migración desde formato actual funciona correctamente
- [ ] UI es intuitiva y sigue el diseño actual
- [ ] No se pierden datos durante la migración
