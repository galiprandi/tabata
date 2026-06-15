# Compartir Rutinas

## Dependencias
- Esta tarea DEPENDE de la tarea 01 (Gestión de Rutinas)
- Requiere que la estructura de datos `Routine` esté implementada
- Requiere que el sistema de storage (`routineStorage.ts`) esté funcionando
- Requiere que la UI de gestión de rutinas (`RoutineList.astro`) exista

## Problema del Usuario
Los usuarios crean rutinas personalizadas pero no pueden compartirlas con amigos, familia o la comunidad. Si alguien quiere usar una rutina creada por otro usuario, tiene que configurarla manualmente, lo cual es tedioso y propenso a errores.

## Solución
Permitir a los usuarios compartir sus rutinas mediante un enlace que contiene todos los datos comprimidos. Al abrir el enlace, la app detecta la rutina y ofrece al usuario la opción de guardarla.

## Funcionalidades

### 1. Compartir Rutina
- Desde la lista de rutinas, el usuario puede compartir una rutina específica
- Genera un enlace único con los datos comprimidos de la rutina
- El usuario puede copiar el enlace o compartirlo directamente (WhatsApp, etc.)

### 2. Recibir Rutina Compartida
- Cuando un usuario abre un enlace de rutina compartida
- La app detecta el parámetro `?r={datos_comprimidos}` en la URL
- Descomprime los datos y muestra un preview de la rutina

### 3. Guardar Rutina Recibida
- La app muestra un diálogo: "¿Deseas guardar esta rutina en tu galería?"
- Si el usuario acepta, la rutina se guarda con un ID nuevo
- La app pregunta: "¿Deseas establecer esta rutina como activa?"
- Si acepta, se convierte en la rutina activa
- Si rechaza, se guarda pero no se activa

### 4. Validación
- Verificar que el enlace tenga el formato correcto
- Validar que los datos descomprimidos sean válidos
- Si están corruptos, mostrar error amigable: "Este enlace parece estar dañado"

## Experiencia de Usuario

### Flujo del Compartidor
1. Usuario ve sus rutinas en configuración
2. Selecciona "Compartir" en una rutina
3. App genera el enlace comprimido
4. Usuario copia el enlace o comparte directamente
5. Envía el enlace a otro usuario

### Flujo del Receptor
1. Usuario recibe enlace y lo abre
2. App detecta parámetro `?r={datos}` en la URL
3. App descomprime y muestra preview de la rutina
4. App pregunta: "¿Guardar esta rutina?"
5. Si acepta → "¿Establecer como activa?"
6. Rutina queda disponible en su galería

## Requisitos Técnicos

### Formato del Enlace
```
https://galiprandi.github.io/tabata/?r={datos_comprimidos}
```

### Librería de Compresión
- **Librería**: LZ-String
- **Método**: `compressToEncodedURIComponent()` y `decompressFromEncodedURIComponent()`
- **Instalación**: `npm install lz-string`
- **Por qué**: Diseñado específicamente para URLs, muy ligero (2.4KB), sin dependencias

### Datos a Comprimir
```typescript
{
  name: string;
  prepDuration: number;
  workDuration: number;
  restDuration: number;
  rounds: number;
  exercises: string[];
}
```

### Proceso de Compresión
1. Convertir datos a JSON string
2. Comprimir con `LZString.compressToEncodedURIComponent(jsonString)`
3. Generar enlace: `https://galiprandi.github.io/tabata/?r={comprimido}`

### Proceso de Descompresión
1. Detectar parámetro `?r=` en la URL
2. Descomprimir con `LZString.decompressFromEncodedURIComponent(datos)`
3. Parsear JSON
4. Validar estructura de datos
5. Mostrar preview al usuario

### Validación
- Verificar que el parámetro `r` exista
- Intentar descomprimir
- Validar que el JSON tenga todos los campos requeridos
- Si falla cualquier paso, mostrar error amigable

## UI Components Requeridos

### 1. ShareButton
- Botón para compartir una rutina
- Genera el enlace comprimido
- Opciones: copiar al portapapeles, compartir nativo (si disponible)

### 2. RoutinePreview
- Muestra la rutina recibida (nombre, ejercicios, tiempos)
- Botones: "Guardar", "Cancelar"

### 3. SaveConfirmation
- Diálogo: "¿Establecer como activa?"
- Botones: "Sí", "No"

## Archivos a Crear/Modificar

### Nuevos
- `src/assets/routineSharing.ts` - Lógica de compresión/descompresión
- `src/components/ShareButton.astro` - Botón de compartir
- `src/components/RoutinePreview.astro` - Preview de rutina recibida
- `src/components/SaveConfirmation.astro` - Diálogo de confirmación

### Modificar
- `src/components/RoutineList.astro` - Agregar botón de compartir
- `src/pages/index.astro` - Detectar parámetro URL y mostrar preview
- `package.json` - Agregar dependencia `lz-string`

## Criterios de Aceptación
- [ ] Usuario puede compartir una rutina mediante enlace
- [ ] Enlace contiene todos los datos comprimidos
- [ ] Enlace es lo suficientemente corto para WhatsApp (< 1000 caracteres)
- [ ] Usuario que abre el enlace ve preview de la rutina
- [ ] Usuario puede guardar la rutina recibida
- [ ] Usuario puede elegir si establecerla como activa
- [ ] Enlaces corruptos muestran error amigable
- [ ] Validación de datos funciona correctamente
- [ ] UI es intuitiva y sigue el diseño actual
