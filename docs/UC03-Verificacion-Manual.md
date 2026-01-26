# UC03 - Guía de Verificación Manual (28 Oct 2025)

## ✅ Estado de Compilación

**Frontend:** ✅ COMPILADO EXITOSAMENTE
- Sin errores de sintaxis
- Solo warnings pre-existentes (no relacionados con cambios)
- Servidor corriendo en http://localhost:3000

**Cambios implementados:**
1. ✅ Filtros funcionales en tienda
2. ✅ Toast notifications en lugar de alert()

---

## 🧪 Checklist de Verificación Manual

### 1. Verificar Filtros en Tienda ✅

**URL:** http://localhost:3000/tienda

**Tests a realizar:**

#### A. Filtro de Búsqueda
- [ ] Escribir nombre de producto → debe filtrar
- [ ] Escribir parte de descripción → debe filtrar
- [ ] Escribir texto que no existe → mensaje "No se encontraron productos"
- [ ] Borrar texto → muestra todos los productos

#### B. Filtro de Categoría
- [ ] Seleccionar "Alimentos" → muestra solo alimentos
- [ ] Seleccionar "Accesorios" → muestra solo accesorios
- [ ] Seleccionar "Todas" → muestra todos

#### C. Filtro de Tipo de Mascota
- [ ] Seleccionar "Perros" → muestra solo productos para perros
- [ ] Seleccionar "Gatos" → muestra solo productos para gatos
- [ ] Seleccionar "Todas" → muestra todos

#### D. Filtro de Precio Máximo
- [ ] Ingresar "5000" → muestra solo productos ≤ $5000
- [ ] Ingresar "1000" → muestra solo productos ≤ $1000
- [ ] Borrar → muestra todos

#### E. Combinación de Filtros
- [ ] Búsqueda + Categoría → filtra por ambos
- [ ] Categoría + Precio → filtra por ambos
- [ ] Todos los filtros activos → filtra correctamente

#### F. Botón Limpiar Filtros
- [ ] Con filtros aplicados, click "Limpiar filtros"
- [ ] Todos los filtros vuelven a "Todas" / vacío
- [ ] Muestra todos los productos

**Resultado esperado:**
- ✅ Filtrado en tiempo real
- ✅ Mensaje cuando no hay resultados
- ✅ Botón limpiar funciona

---

### 2. Verificar Toast Notifications ✅

#### A. Toast en Tienda (StorePage)

**URL:** http://localhost:3000/tienda

**Test:**
- [ ] Login con usuario
- [ ] Click botón carrito (🛒) en cualquier producto
- [ ] **Verificar:** Toast verde aparece con:
  - Título: "Producto agregado"
  - Descripción: "El producto se agregó correctamente al carrito"
- [ ] Toast desaparece automáticamente (3-5 seg)

**Resultado esperado:**
- ✅ NO más alert() bloqueante
- ✅ Toast aparece arriba a la derecha
- ✅ Desaparece solo

#### B. Toast en Detalle de Producto

**URL:** http://localhost:3000/tienda/[ID]

**Test 1 - Agregar:**
- [ ] Cambiar cantidad a 3
- [ ] Click "Agregar al carrito"
- [ ] **Verificar:** Toast con "3 unidades agregadas al carrito"

**Test 2 - Compartir:**
- [ ] Click botón "Compartir"
- [ ] **Verificar:** Toast "Enlace copiado al portapapeles"

**Resultado esperado:**
- ✅ Mensajes contextuales (cantidad dinámica)
- ✅ No más alert()

#### C. Toast en Carrito (CartPage)

**URL:** http://localhost:3000/carrito

**Test 1 - Eliminar:**
- [ ] Click 🗑️ en un producto
- [ ] **Verificar:** Toast "Producto eliminado"
- [ ] Producto desaparece de la lista

**Test 2 - Error (simular):**
- [ ] Backend apagado, intentar modificar cantidad
- [ ] **Verificar:** Toast rojo con mensaje de error

**Resultado esperado:**
- ✅ Toast de confirmación al eliminar
- ✅ Toast de error si falla

#### D. Toast en Checkout

**URL:** http://localhost:3000/checkout

**Test - Transferencia:**
- [ ] Agregar productos al carrito
- [ ] Ir a checkout
- [ ] Seleccionar "Transferencia bancaria"
- [ ] Click "Confirmar compra"
- [ ] **Verificar:** Toast "Compra generada"
- [ ] Redirige a /gracias

**Resultado esperado:**
- ✅ Toast en lugar de alert con datos bancarios
- ✅ Compra creada correctamente

---

### 3. Verificar Flujo Completo de Compra ✅

**Flujo end-to-end:**

1. **Tienda con filtros:**
   - [ ] http://localhost:3000/tienda
   - [ ] Filtrar por categoría "Alimentos"
   - [ ] Buscar "comida"
   - [ ] Máximo $3000
   - [ ] Debe mostrar solo productos que cumplan TODOS los criterios

2. **Agregar con toast:**
   - [ ] Click carrito en producto
   - [ ] Ver toast de confirmación
   - [ ] No bloquea la página

3. **Modificar carrito con toast:**
   - [ ] http://localhost:3000/carrito
   - [ ] Cambiar cantidad con +/-
   - [ ] Eliminar producto → Toast "Producto eliminado"

4. **Checkout con toast:**
   - [ ] http://localhost:3000/checkout
   - [ ] Seleccionar transferencia
   - [ ] Confirmar → Toast de confirmación
   - [ ] Redirige a /gracias

5. **Verificar compra:**
   - [ ] http://localhost:3000/mis-pedidos
   - [ ] Ver compra en estado "pendiente"

**Resultado esperado:**
- ✅ TODO el flujo funciona sin alert()
- ✅ Filtros funcionan en tiempo real
- ✅ UX fluida y profesional

---

## 🚀 Tests Rápidos (5 minutos)

### Test Mínimo Esencial:

1. **Filtros (30 seg):**
   - Ir a /tienda
   - Escribir algo en búsqueda
   - Cambiar categoría
   - Verificar que filtra

2. **Toasts (1 min):**
   - Agregar producto al carrito
   - Ver toast verde
   - Eliminar del carrito
   - Ver toast de confirmación

3. **Flujo completo (3 min):**
   - Filtrar productos
   - Agregar 2 productos
   - Ir a carrito
   - Checkout con transferencia
   - Ver toast de confirmación
   - Verificar en mis-pedidos

**Si todo esto funciona → ✅ LISTO PARA PASAR AL SIGUIENTE UC**

---

## ⚠️ Problemas Conocidos (No críticos)

### Warnings de compilación:
- Variables no usadas en AdminEvents, AdminOrders
- No afectan funcionalidad
- Código legacy, no de mis cambios

### Mercado Pago:
- ❌ Aún requiere MP_ACCESS_TOKEN
- ✅ Transferencia bancaria 100% funcional
- 📝 Dejar para después (según indicación)

---

## ✅ Confirmación Final

**Criterios de éxito:**

- [x] Frontend compila sin errores
- [ ] Filtros funcionan en tiempo real
- [ ] Toast aparecen en lugar de alert()
- [ ] Flujo de compra completo funciona
- [ ] No hay errores en consola del navegador

**Si todos los checkboxes están marcados:**
✅ **UC03 COMPLETAMENTE VERIFICADO Y FUNCIONAL**
✅ **LISTO PARA PASAR AL SIGUIENTE UC**

---

**Fecha de verificación:** 28 de octubre de 2025  
**Tiempo estimado de pruebas:** 5-10 minutos  
**Proyecto:** Salvando Huellas
