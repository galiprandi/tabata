# Tabata - Agent Instructions

## Workflow para Implementación de Features

### 1. Tomar Tarea del Backlog
- Revisar la carpeta `backlog/` en orden numérico
- Tomar la tarea con el número más bajo (ej: `01-xxx.md`)
- Leer completamente la definición de la tarea

### Validación de Dependencias
- Verificar la sección "Dependencias" de la tarea (si existe)
- Si la tarea tiene dependencias, confirmar que las tareas dependientes estén completadas
- Verificar en la carpeta `specs/` que las tareas dependientes ya fueron implementadas
- Si las dependencias no están completadas, implementarlas primero

### 2. Implementar la Tarea
- Seguir la especificación descrita en el archivo de tarea
- Respetar las convenciones del proyecto (Astro, TypeScript, localStorage)
- No agregar funcionalidades extra no solicitadas
- Mantener el código limpio y bien comentado

### 3. Validación
- Probar la funcionalidad implementada
- Verificar que no rompa features existentes
- Asegurar que el build funcione correctamente

### 4. Documentación
- **Crear Spec**: Mover el archivo de `backlog/01-xxx.md` a `specs/01-xxx.md`
- **Eliminar del Backlog**: Borrar el archivo original de `backlog/`
- **Actualizar AGENTS.md**: Si es necesario, agregar aprendizajes o patrones nuevos

### 5. Commit
- Crear commit con mensaje descriptivo siguiendo el formato del proyecto
- Ejemplo: `feat: implementar gestión de rutinas`

## Reglas del Proyecto

### Stack
- **Framework**: Astro
- **Lenguaje**: TypeScript
- **Storage**: localStorage
- **Estilos**: CSS nativo (sin frameworks CSS)

### Convenciones
- Los componentes viven en `src/components/`
- Las páginas viven en `src/pages/`
- Lógica de storage en `src/assets/`
- Iconos en `src/components/icons/`

### Storage
- Usar localStorage para persistencia
- Keys con prefijo `tabata_` para evitar colisiones
- Estructura de datos consistente

### Testing
- Probar manualmente las features implementadas
- Verificar compatibilidad con features existentes

## Aprendizajes del Proyecto

### Storage Pattern
- Key principal: `settings` (formato actual)
- Migración: Preservar datos existentes al cambiar formato

### Component Structure
- Componentes Astro con lógica TypeScript
- Separación clara entre UI y lógica de negocio

### Audio
- Sistema de audio con Web Speech API
- Control de estado en localStorage
