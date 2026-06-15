# Historial y Estadísticas

## Dependencias
- Esta tarea DEPENDE de la tarea 01 (Gestión de Rutinas)
- Requiere que la estructura de datos `Routine` esté implementada
- Requiere que el sistema de storage (`routineStorage.ts`) esté funcionando

## Problema del Usuario
Los usuarios entrenan regularmente pero no tienen seguimiento de su progreso. No saben cuántas veces completaron cada rutina, su evolución temporal, o tienen motivación visual de su constancia. Además, si eliminan una rutina, pierden todo el historial asociado.

## Solución
Sistema de historial de entrenamientos con snapshots inmutables. Cada entrenamiento guarda una copia completa de la rutina tal como era en ese momento, permitiendo que el historial persista incluso si se eliminan o modifican las rutinas originales.

## Funcionalidades

### 1. Registrar Entrenamiento
- Al completar un entrenamiento, guardar automáticamente en historial
- Guardar snapshot completo: nombre, ejercicios, tiempos, rondas
- Guardar fecha y duración real del entrenamiento
- ID único para cada registro

### 2. Historial de Entrenamientos
- Lista de todos los entrenamientos completados
- Orden cronológico (más reciente primero)
- Mostrar: fecha, nombre rutina, duración, ejercicios
- Paginación si hay muchos registros

### 3. Estadísticas por Rutina
- Cuántas veces entrenó cada rutina
- Última vez que entrenó cada rutina
- Tiempo total invertido en cada rutina
- Promedio de tiempo por sesión

### 4. Estadísticas por Ejercicio
- Frecuencia de cada ejercicio (cuántas veces apareció)
- Tiempo total invertido en cada ejercicio
- Ejercicios más y menos frecuentes

### 5. Estadísticas Generales
- Total de entrenamientos completados
- Tiempo total de entrenamiento
- Streaks (días consecutivos entrenando)
- Promedio de entrenamientos por semana

### 6. Gestión de Historial
- Límite de 100 entrenamientos más recientes (para no explotar localStorage)
- Opción de limpiar historial manualmente
- Confirmación antes de eliminar historial

## Experiencia de Usuario

### Flujo de Registro
1. Usuario completa un entrenamiento
2. App registra automáticamente en historial
3. Usuario puede ver historial en cualquier momento

### Flujo de Visualización
1. Usuario accede a sección "Historial"
2. Ve lista de entrenamientos con stats
3. Puede filtrar por rutina o ejercicio
4. Ve gráficos simples de progreso

### Persistencia de Datos
- Si usuario elimina una rutina, el historial persiste
- Los snapshots son inmutables (no cambian con el tiempo)
- Stats se calculan dinámicamente desde los snapshots

## Requisitos Técnicos

### Estructura de Datos
```typescript
interface WorkoutLog {
  id: string;
  date: number;              // timestamp
  duration: number;          // duración real en segundos
  routineSnapshot: {
    name: string;
    exercises: string[];
    prepDuration: number;
    workDuration: number;
    restDuration: number;
    rounds: number;
  };
}

interface Storage {
  workoutLogs: WorkoutLog[];
}
```

### Storage Keys
- `tabata_workout_logs`: Array de registros de entrenamiento
- Límite: máximo 100 registros (FIFO)

### Registro Automático
- Al completar entrenamiento en `src/pages/end.astro`
- Crear snapshot de la rutina activa
- Guardar en localStorage
- Mantener solo los 100 más recientes

### Cálculo de Estadísticas
- Por rutina: agrupar por `routineSnapshot.name`
- Por ejercicio: contar frecuencia en `routineSnapshot.exercises`
- Streaks: calcular días consecutivos desde registros
- Todo calculado dinámicamente (no se guarda)

### Gestión de Storage
- Al guardar nuevo registro: verificar límite de 100
- Si excede, eliminar el más antiguo
- Opción manual: limpiar todo historial con confirmación

## UI Components Requeridos

### 1. WorkoutHistory
- Lista de entrenamientos con paginación
- Filtros por rutina y ejercicio
- Orden cronológico

### 2. StatsDashboard
- Resumen de estadísticas generales
- Cards con: total entrenamientos, tiempo total, streak actual
- Gráficos simples (últimos 7 días, 30 días)

### 3. RoutineStats
- Estadísticas por rutina
- Lista con: nombre, veces entrenada, último entrenamiento
- Barra de progreso visual

### 4. ExerciseStats
- Estadísticas por ejercicio
- Lista con: nombre, frecuencia, tiempo total
- Ordenado por frecuencia

### 5. HistoryActions
- Botón para limpiar historial
- Confirmación antes de eliminar
- Feedback visual

## Archivos a Crear/Modificar

### Nuevos
- `src/assets/workoutLog.ts` - Lógica de historial y stats
- `src/components/WorkoutHistory.astro` - Lista de historial
- `src/components/StatsDashboard.astro` - Dashboard de stats
- `src/components/RoutineStats.astro` - Stats por rutina
- `src/components/ExerciseStats.astro` - Stats por ejercicio
- `src/pages/history.astro` - Página de historial

### Modificar
- `src/pages/end.astro` - Registrar entrenamiento al completar
- `src/assets/routineStorage.ts` - Reutilizar estructura Routine

## Criterios de Aceptación
- [ ] Entrenamientos se registran automáticamente al completar
- [ ] Cada registro guarda snapshot completo de la rutina
- [ ] Historial persiste si se elimina la rutina original
- [ ] Historial muestra lista de entrenamientos
- [ ] Estadísticas por rutina se calculan correctamente
- [ ] Estadísticas por ejercicio se calculan correctamente
- [ ] Streaks se calculan correctamente
- [ ] Límite de 100 registros se respeta
- [ ] Usuario puede limpiar historial manualmente
- [ ] UI es intuitiva y motiva al usuario
- [ ] Gráficos simples muestran progreso
