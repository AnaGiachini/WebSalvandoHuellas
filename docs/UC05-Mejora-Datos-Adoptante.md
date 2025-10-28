# UC05 - Mejora: Guardar Datos Completos del Adoptante

## 📋 Resumen del Cambio

**Fecha:** 28 de octubre de 2025  
**Tipo:** Mejora funcional  
**Prioridad:** Alta  
**Estado:** ✅ Implementado

---

## 🎯 Problema Identificado

**Problema original:**
- El formulario de adopción solo enviaba `idAnimal` al backend
- Solo se guardaban `idUsuario` e `idAnimal` en la solicitud
- Si el usuario actualizaba su perfil después de enviar la solicitud, se perdían los datos originales
- Los administradores no tenían acceso a información importante del adoptante (experiencia con mascotas, motivación)

**Impacto:**
- ❌ No hay registro histórico de los datos del adoptante
- ❌ Pérdida de información si el usuario cambia su perfil
- ❌ Falta de contexto para evaluar solicitudes
- ❌ No se guarda experiencia ni motivación del adoptante

---

## ✅ Solución Implementada

### Concepto: "Snapshot" de Datos

Implementamos un **snapshot** (instantánea) de los datos del adoptante al momento de enviar la solicitud:

**Campos agregados al modelo:**
1. `nombre` - Nombre del solicitante
2. `apellido` - Apellido del solicitante
3. `email` - Email al momento de la solicitud
4. `telefono` - Teléfono de contacto
5. `direccion` - Dirección actual
6. `experienciaPrevia` - Experiencia con mascotas (texto libre)
7. `motivacion` - Razón para adoptar (texto libre)

**Beneficios:**
- ✅ Registro histórico completo
- ✅ Datos inmutables una vez creada la solicitud
- ✅ Contexto completo para evaluación
- ✅ No depende de cambios en el perfil del usuario

---

## 🔧 Cambios Técnicos

### 1. Modelo de Datos (Backend)

**Archivo:** `/backend/src/models/solicitudAdopcion.js`

```javascript
const SolicitudAdopcion = sequelize.define("SolicitudAdopcion", {
  // Campos existentes
  idSolicitud: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idUsuario: { type: DataTypes.INTEGER, allowNull: false },
  idAnimal: { type: DataTypes.INTEGER, allowNull: false },
  estado: { type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'), defaultValue: 'pendiente' },
  fechaSolicitud: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  
  // ✅ NUEVOS CAMPOS - Snapshot del adoptante
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  apellido: { type: DataTypes.STRING(50), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false },
  telefono: { type: DataTypes.STRING(20), allowNull: false },
  direccion: { type: DataTypes.STRING(200), allowNull: false },
  experienciaPrevia: { type: DataTypes.TEXT, allowNull: true },
  motivacion: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'solicitudes_adopcion', timestamps: false });
```

### 2. Validaciones (Backend)

**Archivo:** `/backend/src/validations/adoptionApplicationValidation.js`

```javascript
const nombre = body('nombre')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('El nombre debe tener entre 2 y 50 caracteres');

const apellido = body('apellido')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('El apellido debe tener entre 2 y 50 caracteres');

const email = body('email')
  .trim()
  .isEmail()
  .withMessage('Debe proporcionar un email válido');

const telefono = body('telefono')
  .trim()
  .isLength({ min: 7, max: 20 })
  .withMessage('El teléfono debe tener entre 7 y 20 caracteres');

const direccion = body('direccion')
  .trim()
  .isLength({ min: 5, max: 200 })
  .withMessage('La dirección debe tener entre 5 y 200 caracteres');

const experienciaPrevia = body('experienciaPrevia').optional().trim();
const motivacion = body('motivacion').optional().trim();
```

### 3. Servicio (Backend)

**Archivo:** `/backend/src/services/adoptionApplicationService.js`

```javascript
const createAdoptionApplicationService = async (data) => {
  const { idAnimal, idUsuario, nombre, apellido, email, telefono, direccion, experienciaPrevia, motivacion } = data;
  
  // Validar animal disponible...
  
  const result = await sequelize.transaction(async (t) => {
    // ✅ Normalizar datos antes de guardar
    const payload = {
      idUsuario,
      idAnimal,
      nombre: nombre?.trim(),
      apellido: apellido?.trim(),
      email: email?.trim().toLowerCase(),
      telefono: telefono?.trim(),
      direccion: direccion?.trim(),
      experienciaPrevia: experienciaPrevia?.trim() || null,
      motivacion: motivacion?.trim() || null,
      estado: 'pendiente'
    };
    
    const solicitud = await SolicitudAdopcion.create(payload, { transaction: t });
    
    // Actualizar estado del animal...
    
    return solicitud;
  });
  
  return result;
};
```

### 4. Controlador (Backend)

**Archivo:** `/backend/src/controllers/adoptionApplicationController.js`

```javascript
const createAdoptionApplication = async (req, res, next) => {
  try {
    // ✅ Extraer todos los campos del body
    const { idAnimal, nombre, apellido, email, telefono, direccion, experienciaPrevia, motivacion } = req.body;
    const idUsuario = req.user.idUsuario;

    const solicitud = await createAdoptionApplicationService({ 
      idUsuario, 
      idAnimal, 
      nombre, 
      apellido, 
      email, 
      telefono, 
      direccion, 
      experienciaPrevia, 
      motivacion 
    });

    res.status(201).json({
      status: 'success',
      message: 'Solicitud de adopción creada exitosamente',
      data: solicitud
    });
  } catch (err) {
    next(err);
  }
};
```

### 5. Formulario (Frontend)

**Archivo:** `/frontend/src/components/AdoptionForm.jsx`

**Cambios principales:**
- ✅ Campos ahora tienen `name` attribute
- ✅ Se captura FormData al submit
- ✅ Se envían todos los datos al backend

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  // Validaciones...
  
  // ✅ Capturar todos los datos del formulario
  const formData = new FormData(e.currentTarget);
  const payload = {
    idAnimal: animalId,
    nombre: formData.get('firstName')?.trim() || me?.nombre || '',
    apellido: formData.get('lastName')?.trim() || me?.apellido || '',
    email: formData.get('email')?.trim() || me?.email || '',
    telefono: me?.telefono?.toString().trim() || '',
    direccion: me?.direccion?.toString().trim() || '',
    experienciaPrevia: formData.get('experience')?.trim() || '',
    motivacion: formData.get('reason')?.trim() || ''
  };
  
  await adoptionApplicationsService.create(payload);
  // ...
};
```

**Campos del formulario:**
```jsx
<Input 
  id="firstName" 
  name="firstName"
  defaultValue={me?.nombre || ''}
  required
/>

<Textarea 
  id="experience" 
  name="experience"
  placeholder="Ej: He tenido perros toda mi vida..."
/>
```

### 6. Panel Admin (Frontend)

**Archivo:** `/frontend/src/components/admin/AdminAdoptions.jsx`

**Mejoras en el dialog de detalle:**
```jsx
<CardContent className="space-y-4">
  <div>
    <p className="font-semibold text-lg">
      {selectedRequest.nombre} {selectedRequest.apellido}
    </p>
  </div>
  <div className="space-y-3">
    <div>
      <p className="text-xs font-medium text-muted-foreground">Email</p>
      <p className="text-sm">{selectedRequest.email}</p>
    </div>
    <div>
      <p className="text-xs font-medium text-muted-foreground">Teléfono</p>
      <p className="text-sm">{selectedRequest.telefono}</p>
    </div>
    <div>
      <p className="text-xs font-medium text-muted-foreground">Dirección</p>
      <p className="text-sm">{selectedRequest.direccion}</p>
    </div>
    {selectedRequest.experienciaPrevia && (
      <div>
        <p className="text-xs font-medium text-muted-foreground">Experiencia con mascotas</p>
        <p className="text-sm whitespace-pre-wrap">{selectedRequest.experienciaPrevia}</p>
      </div>
    )}
    {selectedRequest.motivacion && (
      <div>
        <p className="text-xs font-medium text-muted-foreground">Motivación</p>
        <p className="text-sm whitespace-pre-wrap">{selectedRequest.motivacion}</p>
      </div>
    )}
  </div>
</CardContent>
```

---

## 🗄️ Migración de Base de Datos

**Archivo:** `/backend/migrations/add_adoptante_fields_to_solicitudes.sql`

### Pasos para ejecutar:

1. **Backup de la base de datos:**
   ```bash
   pg_dump -U postgres salvando_huellas > backup_antes_migracion.sql
   ```

2. **Ejecutar migración:**
   ```bash
   psql -U postgres -d salvando_huellas -f backend/migrations/add_adoptante_fields_to_solicitudes.sql
   ```

3. **Verificar columnas agregadas:**
   ```sql
   SELECT column_name, data_type, character_maximum_length, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'solicitudes_adopcion'
   ORDER BY ordinal_position;
   ```

### Columnas agregadas:

| Columna | Tipo | Longitud | Nullable |
|---------|------|----------|----------|
| `nombre` | VARCHAR | 50 | NO |
| `apellido` | VARCHAR | 50 | NO |
| `email` | VARCHAR | 100 | NO |
| `telefono` | VARCHAR | 20 | NO |
| `direccion` | VARCHAR | 200 | NO |
| `experienciaPrevia` | TEXT | - | YES |
| `motivacion` | TEXT | - | YES |

### Notas importantes:

- ⚠️ **Solicitudes existentes:** Tendrán valores vacíos en los nuevos campos
- 📝 **Poblar datos históricos:** Si es necesario, ejecutar el UPDATE incluido en el script de migración para copiar datos desde la tabla `usuarios`
- ✅ **Nuevas solicitudes:** Guardarán todos los datos automáticamente

---

## 📊 Comparativa Antes/Después

### ANTES:

**Modelo:**
```javascript
{
  idSolicitud: 1,
  idUsuario: 5,
  idAnimal: 12,
  estado: 'pendiente',
  fechaSolicitud: '2025-10-28'
}
```

**Problemas:**
- ❌ Solo referencias (IDs)
- ❌ Datos del adoptante solo en tabla usuarios
- ❌ Si usuario actualiza perfil, se pierden datos originales
- ❌ No hay experiencia ni motivación

### DESPUÉS:

**Modelo:**
```javascript
{
  idSolicitud: 1,
  idUsuario: 5,
  idAnimal: 12,
  estado: 'pendiente',
  fechaSolicitud: '2025-10-28',
  // ✅ Snapshot completo del adoptante
  nombre: 'María',
  apellido: 'González',
  email: 'maria@email.com',
  telefono: '+54 11 1234-5678',
  direccion: 'Av. Libertador 1234, CABA',
  experienciaPrevia: 'He tenido perros toda mi vida, actualmente tengo un gato de 3 años...',
  motivacion: 'Me encanta la personalidad de Luna, tengo un hogar preparado con patio...'
}
```

**Beneficios:**
- ✅ Datos completos en la solicitud
- ✅ Inmutable (snapshot histórico)
- ✅ Contexto completo para evaluación
- ✅ Experiencia y motivación documentadas

---

## ✅ Estado de Compilación

**Frontend:** ✅ Compilado exitosamente
```bash
webpack compiled with 1 warning
```

**Backend:** ✅ Sin errores (requiere migración de BD)

**Warnings:**
- Solo warnings legacy (no relacionados con cambios)

---

## 🧪 Testing

### Test 1: Crear solicitud con datos completos

**Pasos:**
```
1. Login como usuario
2. Ir a /adopcion/:id de un animal disponible
3. Completar formulario:
   - Nombre: Ana
   - Apellido: Pérez
   - Email: ana@test.com
   - Experiencia: "He tenido 3 perros"
   - Motivación: "Me encanta este animal"
4. Click "Enviar solicitud"
```

**Resultado esperado:**
- ✅ Solicitud creada con todos los campos
- ✅ Verificar en BD que se guardaron nombre, apellido, email, telefono, direccion, experienciaPrevia, motivacion

### Test 2: Ver solicitud en panel admin

**Pasos:**
```
1. Login como admin
2. Ir a /admin → Adopciones
3. Click "Ver detalles" en una solicitud
```

**Resultado esperado:**
- ✅ Se muestra nombre completo
- ✅ Se muestra email, teléfono, dirección
- ✅ Se muestra experiencia con mascotas
- ✅ Se muestra motivación

### Test 3: Datos inmutables

**Pasos:**
```
1. Usuario crea solicitud con email: original@test.com
2. Usuario cambia su email en perfil a: nuevo@test.com
3. Admin ve la solicitud
```

**Resultado esperado:**
- ✅ Solicitud sigue mostrando: original@test.com
- ✅ Datos no cambian cuando usuario actualiza perfil

---

## 🎓 Para la Defensa

**"¿Por qué guardan datos duplicados del usuario?"**
> "No es duplicación, es un snapshot histórico. Si un adoptante cambia su email o teléfono después de enviar la solicitud, necesitamos tener registro de los datos que tenía al momento de aplicar. Esto es crítico para auditoría y seguimiento. Además, guardamos información específica de la solicitud como experiencia con mascotas y motivación, que no están en el perfil general del usuario."

**"¿Qué pasa si el usuario actualiza su perfil?"**
> "Los datos de la solicitud NO cambian. Es una instantánea inmutable del momento en que el usuario aplicó. Esto garantiza integridad histórica y permite al admin evaluar la solicitud con los datos exactos que el adoptante proporcionó en ese momento."

---

## ✅ Checklist de Implementación

### Backend ✅
- [x] Modelo actualizado con 7 nuevos campos
- [x] Validaciones con express-validator
- [x] Servicio normaliza datos antes de guardar
- [x] Controlador extrae todos los campos del body
- [x] Script de migración SQL creado

### Frontend ✅
- [x] Formulario captura todos los datos
- [x] Campos con name attribute
- [x] Payload completo enviado al backend
- [x] Admin ve datos completos en dialog
- [x] Placeholders informativos en textareas

### Base de Datos ⚠️
- [ ] **PENDIENTE:** Ejecutar migración SQL
- [ ] Verificar columnas agregadas
- [ ] (Opcional) Poblar datos históricos

---

**Generado:** 28 de octubre de 2025  
**Proyecto:** Salvando Huellas  
**Estado:** ✅ Implementado (requiere migración de BD)
