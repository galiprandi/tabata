# Herramientas de Análisis

## Dependencias
- Esta tarea DEPENDE de la tarea 06 (Análisis Básico)
- Esta tarea DEPENDE de la tarea 07 (Análisis Avanzado)
- Requiere que el análisis básico y avanzado estén implementados

## Problema del Usuario
Los entrenadores necesitan herramientas prácticas para trabajar con los análisis: filtrar datos específicos, exportar para reportes, y agregar anotaciones personalizadas para dar feedback contextualizado.

## Solución
Agregar herramientas de análisis que permitan filtrado avanzado, exportación de datos y anotaciones personalizadas por parte del entrenador.

## Funcionalidades

### 1. Filtros Avanzados
- Filtrar por rango de fechas específico
- Filtrar por rutinas específicas
- Filtrar por ejercicios específicos
- Combinación de múltiples filtros
- Guardar filtros como "vistas" (opcional)

### 2. Exportación de Datos
- Exportar a CSV (para Excel)
- Exportar a JSON (para integración)
- Exportar a PDF (para reportes, opcional)
- Selección de qué datos exportar

### 3. Anotaciones del Entrenador
- Entrenador puede agregar notas a un análisis
- Notas se guardan localmente (localStorage del entrenador)
- Notas están vinculadas al alumno (por ID o pseudo)
- Notas son privadas (no se comparten)

### 4. Gestión de Anotaciones
- Ver todas las anotaciones de un alumno
- Editar o eliminar anotaciones
- Búsqueda en anotaciones
- Orden cronológico

## Experiencia de Usuario

### Flujo del Entrenador
1. Entrenador ve análisis de un alumno
2. Aplica filtros para enfocar en período específico
3. Exporta datos para reporte o archivo personal
4. Agrega anotación con feedback para el alumno
5. Guarda y puede revisitar anotaciones después

### Diseño de Herramientas
- Panel de herramientas colapsable
- Filtros intuitivos con selects y date pickers
- Exportación con feedback visual
- Anotaciones tipo sticky notes

## Requisitos Técnicos

### Estructura de Datos
```typescript
interface AnalysisNote {
  id: string;
  studentId: string;        // ID o pseudo del alumno
  date: number;             // timestamp
  text: string;
  analysisContext: {
    dateRange: { from: number; to: number };
    filters: any;           // filtros aplicados
  };
}

interface TrainerStorage {
  notes: AnalysisNote[];
}
```

### Storage Keys
- `tabata_trainer_notes`: Anotaciones del entrenador
- Solo en localStorage del entrenador (no se comparte)

### Filtros
- Filtros se aplican en tiempo real
- Combinación lógica AND entre filtros
- Reset rápido de todos los filtros

### Exportación
- CSV: formato simple con headers
- JSON: estructura completa de datos
- PDF: opcional, requiere librería adicional

### Anotaciones
- Guardadas en localStorage del entrenador
- Vinculadas por studentId (pseudo del alumno)
- No se comparten (privadas)

## UI Components Requeridos

### 1. AnalysisToolsPanel
- Panel colapsable con herramientas
- Tabs: Filtros, Exportar, Anotaciones

### 2. AdvancedFilters
- Filtros por rango de fechas
- Filtros por rutinas (multi-select)
- Filtros por ejercicios (multi-select)
- Botón "Aplicar filtros" y "Reset"

### 3. DataExport
- Selector de formato (CSV, JSON)
- Selector de datos a exportar
- Botón "Exportar" con feedback

### 4. AnnotationEditor
- Textarea para agregar nota
- Contexto automático (fecha, filtros)
- Botones "Guardar" y "Cancelar"

### 5. AnnotationsList
- Lista de anotaciones del alumno
- Búsqueda en anotaciones
- Acciones: editar, eliminar

## Archivos a Crear/Modificar

### Nuevos
- `src/assets/analysisTools.ts` - Lógica de herramientas
- `src/components/AnalysisToolsPanel.astro` - Panel de herramientas
- `src/components/AdvancedFilters.astro` - Filtros avanzados
- `src/components/DataExport.astro` - Exportación de datos
- `src/components/AnnotationEditor.astro` - Editor de anotaciones
- `src/components/AnnotationsList.astro` - Lista de anotaciones

### Modificar
- `src/components/BasicAnalysisDashboard.astro` - Integrar panel de herramientas
- `src/assets/basicAnalysis.ts` - Aplicar filtros a cálculos

## Criterios de Aceptación
- [ ] Filtros avanzados funcionan correctamente
- [ ] Combinación de múltiples filtros funciona
- [ ] Exportación a CSV funciona
- [ ] Exportación a JSON funciona
- [ ] Entrenador puede agregar anotaciones
- [ ] Anotaciones se guardan en localStorage
- [ ] Anotaciones se vinculan al alumno
- [ ] Lista de anotaciones funciona
- [ ] Búsqueda en anotaciones funciona
- [ ] Panel de herramientas es intuitivo
- [ ] Herramientas se integran coherentemente con análisis
