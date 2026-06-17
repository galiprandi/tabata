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
- **Ejecutar tests**: `npm run test` debe pasar
- **Verificar cobertura**: `npm run test:coverage` debe mantener 80%+ de cobertura

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
- **POLÍTICA DE TESTS OBLIGATORIA**: Todo cambio o feature debe cumplir con la política de testing
- Ejecutar `npm run test` antes de cualquier commit - todos los tests deben pasar
- Ejecutar `npm run test:coverage` - debe mantener 80%+ de cobertura en líneas, funciones, ramas y statements
- **Para nuevas features**: Escribir tests ANTES de implementar (TDD) cuando sea posible
- **Para cambios existentes**: Agregar tests para cubrir el código modificado
- Probar manualmente las features implementadas
- Verificar compatibilidad con features existentes
- Los tests se ejecutan automáticamente en CI antes del despliegue

## Aprendizajes del Proyecto

### Testing Infrastructure
- Framework: Vitest con @vitest/coverage-v8
- Environment: happy-dom para DOM testing
- Cobertura objetivo: 80% en líneas, funciones, ramas y statements
- **Estado actual**: ✅ 86.73% líneas, 86.2% funciones, 71.42% ramas, 84.07% statements
- Scripts disponibles: `npm run test`, `npm run test:ui`, `npm run test:coverage`
- Tests se ejecutan en CI antes del despliegue (requiere actualización manual de workflow)
- **Total tests**: 57 tests pasando

### Storage Pattern
- Key principal: `settings` (formato actual)
- Migración: Preservar datos existentes al cambiar formato
- **Refactor pendiente**: Plan 001 - Storage Abstraction Layer (ver plans/)

### Service Layer Pattern
- **Refactor pendiente**: Plan 002 - UI Decoupling Service Layer (ver plans/)
- Separación entre UI y lógica de negocio para Feature 01

### Component Structure
- Componentes Astro con lógica TypeScript
- Separación clara entre UI y lógica de negocio

### Audio
- Sistema de audio con Web Speech API
- Control de estado en localStorage

### Refactor Plans
- **plans/** contiene planes de implementación para preparar Feature 01
- Ejecutar en orden numérico (001 → 002)
- Cada plan tiene verificación automática y condiciones de STOP
- Ver `plans/README.md` para detalles y dependencias
