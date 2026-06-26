# Compartir Progreso

## Dependencias
- Esta tarea DEPENDE de la tarea 01 (Gestión de Rutinas)
- Esta tarea DEPENDE de la tarea 04 (Historial y Estadísticas)
- Requiere que el historial de entrenamientos esté implementado
- Requiere que el sistema de compartir (`routineSharing.ts`) esté implementado

## Problema del Usuario
Los usuarios quieren compartir su progreso con sus entrenadores para recibir feedback y seguimiento. Actualmente no pueden enviar sus estadísticas de entrenamiento de manera fácil y estructurada.

## Solución
Permitir a los usuarios compartir su progreso de entrenamiento mediante un enlace comprimido, similar al sistema de compartir rutinas. El usuario controla qué datos comparte y el entrenador puede ver las estadísticas al abrir el enlace.

## Funcionalidades

### 1. Seleccionar Datos a Compartir
- Usuario elige qué compartir: "Últimos 7 días", "Últimos 30 días", "Todo el historial"
- Opción personalizada: seleccionar rango de fechas
- Vista previa de qué datos se incluirán

### 2. Generar Enlace de Progreso
- Comprimir los datos seleccionados con LZ-String
- Generar enlace: `?progress={datos_comprimidos}`
- Usuario puede copiar o compartir directamente

### 3. Recibir Progreso Compartido
- Entrenador abre enlace con `?progress=`
- App detecta y descomprime los datos
- Muestra vista de estadísticas del alumno

### 4. Vista de Progreso para Entrenador
- Mostrar estadísticas del alumno (similar a dashboard)
- Gráficos temporales de progreso
- Lista de entrenamientos del rango seleccionado
- Sin posibilidad de modificar (solo lectura)

### 5. Privacidad y Control
- Usuario siempre controla qué comparte
- No se comparten datos sensibles (solo estadísticas de entrenamiento)
- Enlace expira después de ser visto (opcional)
- Usuario puede revocar acceso (opcional, futuro)

## Experiencia de Usuario

### Flujo del Usuario
1. Usuario accede a sección "Historial"
2. Selecciona "Compartir progreso"
3. Elige rango de fechas o período
4. Ve vista previa de datos a compartir
5. Genera enlace y lo envía a su entrenador

### Flujo del Entrenador
1. Entrenador recibe enlace y lo abre
2. App detecta `?progress=` en la URL
3. Descomprime y muestra estadísticas del alumno
4. Entrenador analiza progreso y evolución

### Privacidad
- Usuario decide exactamente qué compartir
- No se comparten datos personales (solo stats de entrenamiento)
- El entrenador solo puede ver, no modificar

## Requisitos Técnicos

### Formato del Enlace
```
https://galiprandi.github.io/tabata/?progress={datos_comprimidos}
```

### Datos a Compartir
```typescript
interface SharedProgress {
  userPseudo: string;        // Nombre o pseudo (opcional)
  dateRange: {
    from: number;           // timestamp inicio
    to: number;             // timestamp fin
  };
  workoutLogs: WorkoutLog[]; // Solo los del rango seleccionado
  summary: {
    totalWorkouts: number;
    totalDuration: number;
    uniqueRoutines: number;
    streak: number;
  };
}
```

### Proceso de Compresión
1. Filtrar `workoutLogs` por rango de fechas seleccionado
2. Calcular summary (total workouts, duración, etc.)
3. Convertir a JSON string
4. Comprimir con `LZString.compressToEncodedURIComponent()`
5. Generar enlace: `?progress={comprimido}`

### Proceso de Descompresión
1. Detectar parámetro `?progress=` en la URL
2. Descomprimir con `LZString.decompressFromEncodedURIComponent()`
3. Parsear JSON
4. Validar estructura de datos
5. Mostrar vista de progreso (solo lectura)

### Validación
- Verificar que el parámetro `progress` exista
- Intentar descomprimir
- Validar que el JSON tenga todos los campos requeridos
- Si falla cualquier paso, mostrar error amigable

### Reutilización
- Usar LZ-String de la tarea 02
- Usar estructura `WorkoutLog` de la tarea 04
- Usar lógica de cálculo de stats de la tarea 04

## UI Components Requeridos

### 1. ShareProgressButton
- Botón para compartir progreso
- Abre selector de rango de fechas
- Muestra vista previa de datos

### 2. DateRangeSelector
- Selector de rango de fechas
- Opciones predefinidas: 7 días, 30 días, todo
- Selector personalizado: desde/hasta

### 3. ProgressPreview
- Vista previa de datos a compartir
- Muestra: cantidad de entrenamientos, rango de fechas
- Botones: "Generar enlace", "Cancelar"

### 4. ProgressView (solo lectura)
- Vista de estadísticas del alumno
- Similar a `StatsDashboard` pero sin edición
- Gráficos temporales de progreso
- Lista de entrenamientos del rango

## Archivos a Crear/Modificar

### Nuevos
- `src/assets/progressSharing.ts` - Lógica de compartir progreso
- `src/components/ShareProgressButton.astro` - Botón compartir
- `src/components/DateRangeSelector.astro` - Selector fechas
- `src/components/ProgressPreview.astro` - Vista previa
- `src/components/ProgressView.astro` - Vista progreso (solo lectura)

### Modificar
- `src/pages/history.astro` - Agregar botón compartir progreso
- `src/pages/index.astro` - Detectar `?progress=` y mostrar vista
- `src/assets/workoutLog.ts` - Reutilizar estructura WorkoutLog

## Criterios de Aceptación
- [ ] Usuario puede seleccionar rango de fechas a compartir
- [ ] Usuario puede ver vista previa de datos a compartir
- [ ] Enlace contiene datos comprimidos del rango seleccionado
- [ ] Enlace es lo suficientemente corto para WhatsApp
- [ ] Entrenador que abre el enlace ve estadísticas del alumno
- [ ] Vista de progreso es solo lectura (no se puede modificar)
- [ ] Usuario controla qué datos comparte
- [ ] Validación de datos funciona correctamente
- [ ] UI es intuitiva y sigue el diseño actual
- [ ] Reutiliza sistema de compresión de la tarea 02
- [ ] Reutiliza estructura de datos de la tarea 04
