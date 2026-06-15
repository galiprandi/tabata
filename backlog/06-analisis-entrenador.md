# Análisis Básico de Progreso

## Dependencias
- Esta tarea DEPENDE de la tarea 04 (Historial y Estadísticas)
- Esta tarea DEPENDE de la tarea 05 (Compartir Progreso)
- Requiere que el sistema de compartir progreso esté implementado
- Requiere que la estructura `WorkoutLog` esté implementada

## Problema del Usuario
Los entrenadores necesitan herramientas analíticas básicas para evaluar el progreso de sus alumnos. Actualmente solo ven estadísticas simples, pero necesitan visualizar el progreso en el tiempo y tendencias fundamentales para dar feedback informado.

## Solución
Crear una vista de análisis básico para entrenadores con gráficos temporales, tendencias fundamentales y KPIs clave. Esta es la base para análisis más avanzados.

## Funcionalidades

### 1. Vista de Análisis Temporal
- Gráfico de línea: entrenamientos vs tiempo
- Zoom en períodos específicos (semana, mes)
- Highlight de períodos de alta/baja actividad
- Identificación visual de streaks y gaps

### 2. Análisis de Tendencias Básicas
- Tendencia de frecuencia (¿entrena más o menos?)
- Tendencia de duración (¿entrena más tiempo?)
- Tendencia de variedad (¿usa más rutinas diferentes?)
- Indicadores visuales (flechas arriba/abajo)

### 3. KPIs Fundamentales
- Consistencia: % de días entrenados en el período
- Intensidad promedio: basada en duración y frecuencia
- Total de entrenamientos en el período
- Streak actual (días consecutivos)

## Experiencia de Usuario

### Flujo del Entrenador
1. Entrenador abre enlace de progreso del alumno
2. Ve dashboard básico con gráficos temporales
3. Puede filtrar por período (semana, mes)
4. Identifica tendencias básicas
5. Usa KPIs para evaluación rápida

### Diseño Analítico
- Layout tipo dashboard simple
- Gráficos interactivos básicos (tooltips)
- Colores semánticos (verde=progreso, rojo=regresión)

## Requisitos Técnicos

### Estructura de Datos
- Reutiliza `WorkoutLog` de la tarea 04
- Reutiliza `SharedProgress` de la tarea 05

### Librería de Gráficos
- Usar librería ligera para gráficos (Chart.js o similar)
- Gráficos: línea básica
- Interactividad: tooltips básicos
- Responsive (desktop-first pero usable en mobile)

### Cálculos Básicos
- Tendencias: comparación simple (último período vs anterior)
- Consistencia: ratio días entrenados / días totales
- Streaks: cálculo desde registros

### Performance
- Cálculos en tiempo real (no pre-calculados)
- Sin caché (datos simples)

## UI Components Requeridos

### 1. BasicAnalysisDashboard
- Layout principal con paneles básicos
- Header con filtros de período

### 2. TimelineChart
- Gráfico de línea: entrenamientos vs tiempo
- Zoom básico (semana, mes)
- Highlight de eventos

### 3. BasicTrendAnalysis
- Gráficos de tendencia básicos
- Indicadores visuales simples

### 4. BasicKPIsPanel
- Cards con métricas clave
- Indicadores de progreso/regresión

## Archivos a Crear/Modificar

### Nuevos
- `src/assets/basicAnalysis.ts` - Motor de cálculos básicos
- `src/components/BasicAnalysisDashboard.astro` - Dashboard básico
- `src/components/TimelineChart.astro` - Gráfico temporal
- `src/components/BasicTrendAnalysis.astro` - Tendencias básicas
- `src/components/BasicKPIsPanel.astro` - Panel de KPIs

### Modificar
- `src/pages/index.astro` - Vista de análisis básico para `?progress=`
- `src/assets/workoutLog.ts` - Reutilizar estructura WorkoutLog
- `package.json` - Agregar librería de gráficos

## Criterios de Aceptación
- [ ] Vista de análisis muestra gráficos temporales
- [ ] Gráficos tienen tooltips básicos
- [ ] Tendencias básicas se calculan correctamente
- [ ] KPIs fundamentales se calculan correctamente
- [ ] Filtros de período funcionan
- [ ] Performance es aceptable
- [ ] UI es intuitiva y tipo dashboard simple
- [ ] Reutiliza datos de tareas 04 y 05
