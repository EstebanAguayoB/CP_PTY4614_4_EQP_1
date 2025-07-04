# Guía de Pruebas Unitarias con Vitest

Este proyecto utiliza **Vitest** como framework de testing para las pruebas unitarias de los componentes React.

## 📋 Configuración Realizada

### Dependencias Instaladas
- `vitest` - Framework de testing principal
- `@vitest/ui` - Interfaz gráfica para las pruebas
- `@testing-library/react` - Utilidades para testing de componentes React
- `@testing-library/jest-dom` - Matchers adicionales para DOM
- `@testing-library/user-event` - Simulación de eventos de usuario
- `jsdom` - Simulación del DOM para pruebas

### Archivos de Configuración
- `vite.config.js` - Configuración de Vitest
- `src/test/setup.js` - Configuración global de las pruebas

## 🚀 Comandos para Ejecutar las Pruebas

### Instalar Dependencias (si es necesario)
```bash
npm install
```

### Ejecutar Todas las Pruebas
```bash
npm test
```

### Ejecutar Pruebas en Modo Watch (se ejecutan automáticamente al guardar)
```bash
npm run test:watch
```

### Ejecutar Pruebas una Sola Vez
```bash
npm run test:run
```

### Ejecutar Pruebas con Interfaz Gráfica
```bash
npm run test:ui
```

### Ejecutar Pruebas con Cobertura de Código
```bash
npm run test:coverage
```

## 📁 Estructura de las Pruebas

```
src/test/
├── setup.js                    # Configuración global
├── LoginForm.test.jsx          # Pruebas del formulario de login
├── GestionEstudiante.test.jsx  # Pruebas de gestión de estudiantes
├── GestionProfesores.test.jsx  # Pruebas de gestión de profesores
├── GestionTalleres.test.jsx    # Pruebas de gestión de talleres
├── GestionReportes.test.jsx    # Pruebas de gestión de reportes
├── AlumnosContent.test.jsx     # Pruebas del contenido de alumnos
├── EvidenciasContent.test.jsx  # Pruebas del contenido de evidencias
├── MisTalleresContent.test.jsx # Pruebas de mis talleres
└── ProfesorDashboard.test.jsx  # Pruebas del dashboard del profesor
```

## 🧪 Tipos de Pruebas Implementadas

### Para cada componente se han creado pruebas que verifican:

#### 1. **Renderizado Correcto**
- ✅ El componente se renderiza sin errores
- ✅ Los elementos principales están presentes
- ✅ Los textos y etiquetas son correctos

#### 2. **Interacciones del Usuario**
- ✅ Formularios funcionan correctamente
- ✅ Botones responden a clicks
- ✅ Campos de entrada aceptan texto
- ✅ Checkboxes y selects funcionan

#### 3. **Estados y Datos**
- ✅ Loading states se muestran correctamente
- ✅ Datos se cargan y muestran
- ✅ Errores se manejan apropiadamente
- ✅ Estados locales se actualizan

#### 4. **Navegación**
- ✅ Redirecciones funcionan
- ✅ Cierre de sesión funciona
- ✅ Cambios entre pestañas

#### 5. **Validaciones**
- ✅ Campos requeridos
- ✅ Validaciones de formularios
- ✅ Mensajes de error apropiados

#### 6. **Funcionalidades Específicas**
- ✅ Búsqueda y filtrado
- ✅ CRUD operations (Crear, Leer, Actualizar, Eliminar)
- ✅ Modales y popups
- ✅ Generación de reportes

## 🔧 Configuración Personalizada

### Mocks Incluidos
- **Supabase**: Mock completo de la base de datos
- **React Router**: Mock de navegación
- **React Toastify**: Mock de notificaciones
- **jsPDF**: Mock para generación de PDFs
- **LocalStorage/SessionStorage**: Mock de almacenamiento local

### Variables de Entorno de Prueba
Las pruebas utilizan mocks que no requieren variables de entorno reales.

## 📊 Cobertura de Código

Para ver la cobertura de código detallada:
```bash
npm run test:coverage
```

Esto generará un reporte HTML en `coverage/` que muestra qué líneas de código están cubiertas por las pruebas.

## 🐛 Debugging de Pruebas

### Para debuggear una prueba específica:
```bash
# Ejecutar solo un archivo de prueba
npx vitest LoginForm.test.jsx

# Ejecutar solo una prueba específica
npx vitest -t "renderiza correctamente"
```

### Para ver output detallado:
```bash
npx vitest --reporter=verbose
```

## 📈 Mejores Prácticas Implementadas

1. **Aislamiento**: Cada prueba es independiente
2. **Mocking**: Dependencias externas están mockeadas
3. **Descripción Clara**: Cada prueba tiene un nombre descriptivo
4. **Setup/Teardown**: Limpieza automática entre pruebas
5. **Assertions Específicas**: Verificaciones precisas de comportamiento
6. **User-Centric Testing**: Pruebas desde la perspectiva del usuario

## 🚨 Solución de Problemas Comunes

### Si las pruebas fallan por dependencias:
```bash
npm install --save-dev vitest @vitest/ui @testing-library/jest-dom @testing-library/react @testing-library/user-event jsdom
```

### Si hay problemas con imports:
Verificar que `vite.config.js` tenga la configuración correcta de Vitest.

### Si los mocks no funcionan:
Verificar que `src/test/setup.js` esté configurado correctamente en `vite.config.js`.

## 📝 Añadir Nuevas Pruebas

Para añadir pruebas para un nuevo componente:

1. Crear archivo `NombreComponente.test.jsx` en `src/test/`
2. Importar las utilidades necesarias
3. Seguir la estructura de las pruebas existentes
4. Incluir mocks necesarios
5. Ejecutar `npm test` para verificar

## 🎯 Próximos Pasos

- Añadir pruebas de integración
- Implementar pruebas E2E con Playwright
- Aumentar cobertura de código al 90%+
- Añadir pruebas de performance
- Implementar pruebas de accesibilidad

---

**¡Las pruebas están listas para ejecutar!** 🎉
