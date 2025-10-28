# Snapshot vs. Seguimiento: ¿Cómo hacer seguimiento del adoptante?

## 🤔 La Pregunta

> "Si el usuario adopta un animal y después actualiza su perfil, ¿cómo hago seguimiento?"

## ✅ La Respuesta: Tienes AMBOS datos

---

## 📊 Concepto: Dos Fuentes de Información

### 1. **Snapshot (Solicitud)** 📸
Datos HISTÓRICOS al momento de enviar la solicitud

### 2. **Usuario Actual (Relación)** 🔄
Datos ACTUALES del perfil del usuario

---

## 💡 Ejemplo Paso a Paso

### Día 1 (15 de enero): Usuario envía solicitud

```javascript
// Se guarda en la tabla solicitudes_adopcion
Solicitud #123 {
  idUsuario: 5,  // ← CLAVE: Mantiene relación con usuario
  idAnimal: 12,
  
  // SNAPSHOT - Datos históricos
  nombre: "María",
  apellido: "González",
  email: "maria@email.com",        // ← Email ORIGINAL
  telefono: "1234-5678",            // ← Teléfono ORIGINAL
  direccion: "Calle Falsa 123",    // ← Dirección ORIGINAL
  experienciaPrevia: "He tenido 3 perros",
  motivacion: "Me encanta Luna",
  
  estado: "pendiente",
  fechaSolicitud: "2025-01-15"
}
```

### Día 5 (20 de enero): Usuario actualiza su perfil

```javascript
// Se actualiza en la tabla usuarios
Usuario #5 {
  nombre: "María",
  apellido: "González Perez",       // ← Actualizó apellido
  email: "maria.nueva@email.com",   // ← Cambió email
  telefono: "9876-5432",            // ← Actualizó teléfono
  direccion: "Av. Principal 456"    // ← Nueva dirección
}

// ✅ La solicitud NO cambia (snapshot inmutable)
```

### Día 10 (25 de enero): Admin revisa la solicitud

El admin ve **AMBOS conjuntos de datos**:

```javascript
// Backend hace query con include
const solicitud = await SolicitudAdopcion.findOne({
  where: { idSolicitud: 123 },
  include: [{ model: Usuario, as: 'usuario' }]
});

// Resultado:
{
  // Datos históricos (snapshot)
  idSolicitud: 123,
  email: "maria@email.com",        // ← Original
  telefono: "1234-5678",            // ← Original
  direccion: "Calle Falsa 123",    // ← Original
  
  // Datos actuales (relación)
  usuario: {
    email: "maria.nueva@email.com",   // ← Actual
    telefono: "9876-5432",            // ← Actual
    direccion: "Av. Principal 456"    // ← Actual
  }
}
```

---

## 🎯 ¿Cuándo usar cada uno?

### Para CONTACTAR al usuario (seguimiento):

```javascript
// ✅ Siempre usas los datos ACTUALES
const emailParaContacto = solicitud.usuario.email;      // maria.nueva@email.com
const telefonoParaLlamar = solicitud.usuario.telefono;  // 9876-5432
const direccionVisita = solicitud.usuario.direccion;    // Av. Principal 456

// Admin puede:
- Enviar email → maria.nueva@email.com ✅
- Llamar → 9876-5432 ✅
- Visitar → Av. Principal 456 ✅
```

### Para AUDITORÍA / CONTEXTO:

```javascript
// ✅ Usas el snapshot histórico
const emailOriginal = solicitud.email;        // maria@email.com
const telefonoOriginal = solicitud.telefono;  // 1234-5678
const direccionOriginal = solicitud.direccion; // Calle Falsa 123

// Para análisis:
- "¿Dónde vivía cuando solicitó?" → Calle Falsa 123
- "¿Qué email usó originalmente?" → maria@email.com
- "¿Ha cambiado sus datos?" → SÍ (comparar snapshot vs actual)
```

---

## 🖥️ Implementación en Panel Admin

El panel admin muestra **AMBAS** versiones claramente:

```jsx
<Dialog>
  <Card>
    <CardTitle>Información del Solicitante</CardTitle>
    
    {/* SNAPSHOT - Datos históricos */}
    <div>
      <p className="text-primary">📸 Datos al momento de la solicitud:</p>
      <div className="bg-primary/5">
        <p>Email: {solicitud.email}</p>           {/* maria@email.com */}
        <p>Teléfono: {solicitud.telefono}</p>     {/* 1234-5678 */}
        <p>Dirección: {solicitud.direccion}</p>   {/* Calle Falsa 123 */}
      </div>
    </div>
    
    {/* DATOS ACTUALES - Para contacto */}
    <div>
      <p className="text-green-600">✓ Datos actuales para contacto:</p>
      <div className="bg-green-50">
        <p>Email actual: {solicitud.usuario.email}</p>      {/* maria.nueva@email.com */}
        <p>Teléfono actual: {solicitud.usuario.telefono}</p> {/* 9876-5432 */}
        <p>Dirección actual: {solicitud.usuario.direccion}</p> {/* Av. Principal 456 */}
        
        {/* Alertas de cambios */}
        {solicitud.usuario.email !== solicitud.email && (
          <p className="text-orange-600">⚠️ Cambió su email</p>
        )}
      </div>
      
      {/* Botón para contactar usa datos actuales */}
      <Button onClick={() => enviarEmail(solicitud.usuario.email)}>
        Contactar por email
      </Button>
    </div>
  </Card>
</Dialog>
```

---

## 📋 Casos de Uso Reales

### Caso 1: Contactar para coordinar visita

**Admin necesita:** Llamar al adoptante para coordinar visita al refugio

```javascript
// ✅ Usa datos actuales
const telefono = solicitud.usuario.telefono;  // 9876-5432 (actual)
llamar(telefono);

// ❌ NO usa snapshot (puede estar desactualizado)
// const telefono = solicitud.telefono;  // 1234-5678 (viejo)
```

### Caso 2: Auditar solicitud rechazada

**Admin necesita:** Documentar por qué se rechazó hace 6 meses

```javascript
// ✅ Usa snapshot (datos históricos)
const reporte = `
  Solicitud #${solicitud.idSolicitud}
  Fecha: ${solicitud.fechaSolicitud}
  Solicitante: ${solicitud.nombre} ${solicitud.apellido}
  Dirección original: ${solicitud.direccion}  // ← Importante: dónde vivía entonces
  Experiencia: ${solicitud.experienciaPrevia}
  Motivación: ${solicitud.motivacion}
  Razón rechazo: No cumplía requisitos de espacio
`;
```

### Caso 3: Usuario se mudó después de aplicar

**Escenario:**
- Usuario solicita adopción viviendo en CABA
- Admin aprueba solicitud
- Usuario se muda a otra provincia
- Admin necesita coordinar entrega

```javascript
// Ver cambio de dirección
console.log("Dirección original:", solicitud.direccion);      // CABA
console.log("Dirección actual:", solicitud.usuario.direccion); // Córdoba

// ✅ Admin puede:
1. Ver que se mudó (comparar snapshot vs actual)
2. Decidir si afecta la adopción
3. Usar dirección actual para entrega
```

### Caso 4: Análisis de datos

**Admin necesita:** Estadísticas de adopciones por zona

```javascript
// Usar snapshot para análisis histórico
const adopcionesXZona = solicitudes
  .filter(s => s.estado === 'aprobada')
  .map(s => ({
    zona: s.direccion,  // ← Dirección al momento de solicitar
    fecha: s.fechaSolicitud
  }));

// Resultado: "En enero tuvimos 10 solicitudes de CABA"
// (aunque algunos se hayan mudado después)
```

---

## 🔍 Resumen Visual

```
┌─────────────────────────────────────────────────────┐
│  SOLICITUD DE ADOPCIÓN #123                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  idUsuario: 5  ◄────────┐                          │
│                          │                          │
│  📸 SNAPSHOT (Histórico) │                          │
│  ✓ Email: maria@email.com                          │
│  ✓ Teléfono: 1234-5678                             │
│  ✓ Dirección: Calle Falsa 123                      │
│  ✓ Experiencia: "He tenido 3 perros"               │
│  ✓ Motivación: "Me encanta Luna"                   │
│                          │                          │
│  Uso: Auditoría, contexto, análisis                │
│                          │                          │
└──────────────────────────┼──────────────────────────┘
                           │
                           │ Relación N-1
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│  USUARIO #5                                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔄 DATOS ACTUALES (Dinámicos)                      │
│  ✓ Email: maria.nueva@email.com                    │
│  ✓ Teléfono: 9876-5432                             │
│  ✓ Dirección: Av. Principal 456                    │
│                                                     │
│  Uso: CONTACTO, seguimiento, entrega               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Ventajas de este Enfoque

1. **Seguimiento efectivo:**
   - Siempre puedes contactar al usuario (datos actuales)
   
2. **Auditoría completa:**
   - Registro histórico inmutable (snapshot)
   
3. **Detección de cambios:**
   - Comparar snapshot vs actual
   - Alertar si cambió datos importantes
   
4. **Flexibilidad:**
   - Usuario puede actualizar su perfil sin problemas
   - Admin siempre tiene ambas versiones

---

## 🎓 Para la Defensa

**"¿Cómo hacen seguimiento si el usuario actualiza su perfil?"**

> "Implementamos un sistema dual: guardamos un snapshot inmutable de los datos al momento de la solicitud para auditoría, pero mantenemos la relación con el usuario mediante `idUsuario`. Cuando el admin necesita contactar al adoptante, el sistema consulta los datos actuales del usuario mediante la relación. El panel admin muestra claramente ambas versiones: datos históricos (snapshot) y datos actuales (usuario), e incluso alerta si hubo cambios importantes. Esto nos da lo mejor de ambos mundos: registro histórico completo + información actualizada para seguimiento."

---

**Generado:** 28 de octubre de 2025  
**Proyecto:** Salvando Huellas  
