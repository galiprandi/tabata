# Análisis Avanzado de Progreso

## Dependencias
- Esta tarea DEPENDE de la tarea 06 (Análisis Básico)
- Requiere que el análisis básico esté implementado
- Requiere que la librería de gráficos esté instalada

## Problema del Usuario
Los entrenadores necesitan análisis más profundos para entender patrones específicos de sus alumnos. El análisis básico no es suficiente para identificar qué rutinas funcionan mejor, qué ejercicios se usan más, o cómo varía el entrenamiento por día de semana.

## Solución
Extender el análisis básico con comparaciones de rutinas, análisis de ejercicios y visualizaciones avanzadas de patrones.

## Funcionalidades

### 1. Comparación de Rutinas
- Gráfico de barras: frecuencia por rutina
- Comparación de tiempos entre rutinas
- Identificación de rutinas favoritas vs abandonadas
- Heatmap de rutinas usadas por día de semana

### 2. Análisis de Ejercicios
- Frecuencia de cada ejercicio en el tiempo
- Ejercicios que aparecen más/menos
- Combinaciones de ejercicios más comunes
- Distribución de tipos de ejercicio (si se clasifican)

### 3. Patrones Temporales
- Distribución de entrenamientos por día de semana
- Distribución por hora del día (si está disponible)
- Identificación de días/horarios preferidos

### 4. Comparación entre Períodos
- Comparar este mes vs mes anterior
- Comparar esta semana vs semana anterior
- Delta visual de mejoras/regresiones

## Experiencia de Usuario

### Flujo del Entrenador
1. Entrenador ve análisis básico
2. Accede a pestaña "Análisis Avanzado"
3. Explora comparaciones de rutinas
4. Analiza patrones de ejercicios
5. Compara períodos para evaluar progreso

### Diseño Analítico
- Tabs para navegar entre tipos de análisis
- Gráficos más complejos con interactividad
- Colores y highlight para patrones

## Requisitos Técnicos

### Estructura de Datos
- Reutiliza `WorkoutLog` de la tarea 04
- Reutiliza motor de análisis de la tarea 06

### Librería de Gráficos
- Extender uso de Chart.js o similar
- Gráficos: barras, heatmap, scatter
- Interactividad: zoom, tooltips, filtros

### Cálculos Avanzados
- Frecuencia por rutina: agrupación y conteo
- Combinaciones de ejercicios: análisis de co-ocurrencia
- Patrones temporales: análisis por día/hora
- Comparaciones: delta entre períodos

### Performance
- Cálculos en tiempo real con caché simple
- Lazy loading de gráficos complejos

## UI Components Requeridos

### 1. AdvancedAnalysisTabs
- Navegación entre tipos de análisis
- Rutinas, Ejercicios, Patrones, Comparaciones

### 2. RoutineComparison
- Gráfico de barras: frecuencia por rutina
- Heatmap: rutinas por día de semana
- Identificación de favoritas/abandonadas

### 3. ExerciseAnalysis
- Frecuencia de ejercicios en el tiempo
- Combinaciones más comunes
- Distribución por tipo

### 4. TemporalPatterns
- Distribución por día de semana
- Distribución por hora del día
- Identificación de preferencias

### 5. PeriodComparison
- Selector de períodos a comparar
- Gráficos de delta
- Indicadores visuales de mejora/regresión

## Archivos a Crear/Modificar

### Nuevos
- `src/assets/advancedAnalysis.ts` - Motor de cálculos avanzados
- `src/components/AdvancedAnalysisTabs.astro` - Tabs de navegación
- `src/components/RoutineComparison.astro` - Comparación rutinas
- `src/components/ExerciseAnalysis.astro` - Análisis ejercicios
- `src/components/TemporalPatterns.astro` - Patrones temporales
- `src/components/PeriodComparison.astro` - Comparación períodos

### Modificar
- `src/components/BasicAnalysisDashboard.astro` - Agregar tabs de navegación
- `src/assets/basicAnalysis.ts` - Reutilizar cálculos básicos

## Criterios de Aceptación
- [ ] Comparación de rutinas funciona correctamente
- [ ] Heatmap de rutinas por día se visualiza
- [ ] Análisis de ejercicios muestra patrones
- [ ] Combinaciones de ejercicios se identifican
- [ ] Patrones temporales se calculan correctamente
- [ ] Comparación entre períodos funciona
- [ ] Tabs de navegación funcionan
- [ ] Gráficos son interactivos
- [ ] Performance es aceptable
- [ ] UI extiende análisis básico coherentemente
