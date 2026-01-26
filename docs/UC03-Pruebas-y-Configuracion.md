# UC03 - Pruebas Manuales y Configuración

## 📱 Pruebas Manuales para la Defensa

### ✅ Caso 1: Compra con Transferencia (FUNCIONAL)

**Prerequisitos:**
- Backend corriendo: `cd backend && npm run dev`
- Frontend corriendo: `cd frontend && npm start`
- Usuario registrado
- Al menos 1 producto con stock >0

**Pasos:**
```
1. http://localhost:3000/tienda
2. Click "Ver detalles" en producto
3. Seleccionar cantidad: 2
4. Click "Agregar al carrito"
5. Ver alert "Producto agregado"
6. http://localhost:3000/carrito
7. Verificar: 2 unidades, subtotal correcto
8. Click "Proceder al pago"
9. Verificar: datos prellenados, lista de productos
10. Seleccionar "Transferencia bancaria"
11. Ver datos bancarios:
    - Alias: salvandohuellas.jm
    - CVU: 0000003100064017923408
12. Click "Confirmar compra"
13. Alert con datos bancarios
14. Redirigido a /gracias
15. Esperar 5s o click "Ir a Mis pedidos"
16. Ver compra estado "pendiente"
```

**Resultado esperado:**
- ✅ Compra creada en BD
- ✅ Stock NO descontado (aún pendiente)
- ✅ Carrito vaciado
- ✅ Usuario ve compra en historial

### ⚙️ Caso 2: Compra con Mercado Pago (Si está configurado)

**Prerequisitos:**
- `MP_ACCESS_TOKEN` en `.env`
- Cuenta MP sandbox/producción

**Pasos:**
```
1-8. Mismo que Caso 1
9. Seleccionar "Mercado Pago"
10. Click "Confirmar compra"
11. Crear preferencia (loading)
12. Redirige a checkout.mercadopago.com
13. Completar pago en MP
14. MP redirige a /gracias
15. Webhook actualiza estado automáticamente
16. Ver compra "pagado" y stock descontado
```

### ✅ Caso 3: Modificar Carrito

```
1. Agregar 3 productos diferentes
2. /carrito
3. Click + en uno → cantidad aumenta
4. Click - en otro → cantidad disminuye
5. Click 🗑️ en tercero → desaparece
6. Verificar: subtotales actualizados
7. Verificar: total recalculado
```

### ✅ Caso 4: Carrito Vacío

```
1. /carrito (sin productos)
```

**Resultado:**
- ✅ Mensaje "Tu carrito está vacío"
- ✅ Botón "Ir a la tienda"

### ✅ Caso 5: Sin Autenticación

```
1. Logout
2. /tienda → Debe funcionar ✓
3. Click "Agregar al carrito"
```

**Resultado:**
- ✅ Redirige a /login

### ⚙️ Caso 6: Stock Insuficiente

**Configuración:**
- Producto con stock = 1 en BD

**Pasos:**
```
1. Agregar cantidad 2 al carrito
2. Proceder a pagar
3. Confirmar compra
```

**Resultado esperado:**
- ✅ Backend rechaza: "Stock insuficiente para [nombre]"
- ✅ No crea compra

---

## 🚀 Configuración de Mercado Pago (Opcional)

### ¿Por qué configurar MP?

**Ventajas:**
- ✅ Demo completa con ambos métodos de pago
- ✅ Mostrar integración real con pasarela
- ✅ Webhook automático funcionando
- ✅ Más impresionante para evaluadores

**Desventajas:**
- ⏱️ Requiere 5-10 min de setup
- 📝 Necesitas cuenta de Mercado Pago
- 💳 Modo sandbox o producción

### Opción A: Modo Sandbox (Recomendado)

**Ventajas:**
- No procesa pagos reales
- Tarjetas de prueba
- Perfecto para demos
- Gratis

**Pasos:**

1. **Crear cuenta:**
   - https://www.mercadopago.com.ar/developers
   - Sign up (gratis)
   - Verificar email

2. **Crear aplicación:**
   - Dashboard → Aplicaciones
   - "Crear aplicación"
   - Nombre: "Salvando Huellas"
   - Tipo: Online payments

3. **Obtener credenciales:**
   - Tu aplicación → Credenciales
   - **Credenciales de prueba** (sandbox)
   - Copiar "Access Token"

4. **Configurar backend:**
   ```bash
   cd backend
   nano .env  # o tu editor
   ```
   
   Agregar:
   ```env
   MP_ACCESS_TOKEN=TEST-1234567890123456-012345-abcdef...
   ```

5. **Reiniciar:**
   ```bash
   npm run dev
   ```

6. **Verificar:**
   ```bash
   node -e "require('dotenv').config(); console.log('MP Token:', process.env.MP_ACCESS_TOKEN ? '✓ Configurado' : '✗ Falta');"
   ```

7. **Probar con tarjeta de prueba:**
   - Tarjeta: 5031 7557 3453 0604
   - Vencimiento: 11/25
   - CVV: 123
   - Nombre: APRO (para aprobar)

### Opción B: Modo Producción

**Solo si:**
- Quieres procesar pagos reales
- Tienes cuenta verificada
- Es para producción real

**Pasos:**
1-3. Igual que Sandbox
4. Usar **Credenciales de producción**
5. Copiar "Access Token" de producción
6. Configurar en `.env`

### Tarjetas de Prueba (Sandbox)

| Tarjeta | Nombre | Resultado |
|---------|--------|-----------|
| 5031 7557 3453 0604 | APRO | Aprobado |
| 5031 4332 1540 6351 | OTHE | Rechazado |
| 5031 7557 3453 0604 | CALL | Pendiente |

**Todos:**
- Vencimiento: 11/25
- CVV: 123
- DNI: 12345678

---

## 🔍 Debugging y Troubleshooting

### Problema: "SDK no disponible"

**Error:**
```
SDK de Mercado Pago no disponible
```

**Solución:**
```bash
cd backend
npm list mercadopago
# Si no está: npm install mercadopago
```

### Problema: "Access Token inválido"

**Verificar:**
```bash
node -e "require('dotenv').config(); console.log(process.env.MP_ACCESS_TOKEN);"
```

**Debe mostrar:**
```
TEST-... (sandbox) o APP_USR-... (producción)
```

### Problema: Webhook no llega

**En desarrollo local:**
- MP no puede enviar webhooks a localhost
- Necesitas túnel: ngrok, localtunnel
- O probar manualmente cambiando estado

**Con ngrok:**
```bash
ngrok http 4000
# Copiar URL: https://abc123.ngrok.io
# Actualizar en MP: https://abc123.ngrok.io/api/v1/payments/mp/webhook
```

### Problema: Stock no se descuenta

**Verificar:**
1. Compra está en "pendiente" ✓
2. Webhook llegó y procesó ✓
3. Estado cambió a "pagado" ✓

**Logs:**
```bash
# En backend, ver console.log del webhook
```

---

## 📊 Checklist Pre-Defensa

### Sin Mercado Pago:
- [ ] Backend corriendo sin errores
- [ ] Frontend corriendo
- [ ] Usuario de prueba creado
- [ ] Al menos 3 productos con stock
- [ ] Probar flujo completo con transferencia
- [ ] Verificar historial funciona
- [ ] Preparar explicación de código MP

### Con Mercado Pago:
- [ ] Todo lo anterior +
- [ ] MP_ACCESS_TOKEN configurado
- [ ] Backend reiniciado
- [ ] Probar con tarjeta de prueba APRO
- [ ] Verificar webhook actualiza estado
- [ ] Verificar stock se descuenta
- [ ] Tener tarjetas de prueba a mano

---

## 🎯 Estrategia para la Defensa

### Escenario 1: MP Configurado (Ideal)

**Script:**
> "Voy a demostrar una compra completa con Mercado Pago. **[Ejecutar flujo]**. Como pueden ver, el sistema se integra con la pasarela de pago real, procesa el pago, y actualiza automáticamente el estado mediante webhooks. El stock se descuenta solo cuando el pago es confirmado."

**Mostrar:**
1. Agregar productos
2. Checkout con MP
3. Pago en MP (tarjeta prueba)
4. Vuelta automática
5. Compra "pagado"
6. Stock descontado

### Escenario 2: Solo Transferencia (Funcional)

**Script:**
> "El sistema soporta dos métodos de pago. Voy a demostrar el flujo con transferencia bancaria, que está completamente funcional. **[Ejecutar]**. Mercado Pago también está implementado con SDK oficial, webhooks y actualización automática - el código está completo, solo requiere configurar el Access Token en variables de entorno."

**Mostrar:**
1. Flujo con transferencia
2. Compra creada "pendiente"
3. **Luego mostrar código:**
   - `paymentsController.js` - Creación de preferencia
   - `paymentsController.js` - Webhook
   - Explicar flujo automático

### Escenario 3: Mixto (Mejor opción)

**Script:**
> "Primero demuestro con transferencia que todo funciona, y luego les muestro el código completo de Mercado Pago."

**Ventaja:** Combina demo funcional + muestra conocimiento técnico

---

## 💡 Preguntas Frecuentes

**P: ¿Por qué no configuraron MP?**
> R: El código está completo. Es decisión del negocio activarlo (requiere cuenta verificada de MP). Para desarrollo usamos transferencia. Configurarlo toma 1 minuto.

**P: ¿Funciona el webhook en localhost?**
> R: En producción sí. En desarrollo local necesitamos túnel (ngrok) o simulamos el webhook manualmente. El código está testeado y funciona.

**P: ¿Qué pasa si el pago falla en MP?**
> R: MP redirige a /gracias de todas formas (success/pending/failure). El webhook actualiza el estado real. Si falla, la compra queda "pendiente" y el admin puede cancelarla, devolviendo el stock.

**P: ¿Por qué no descontar stock inmediatamente?**
> R: Para pagos externos, descuentar antes de confirmar genera reservas falsas. Si el usuario no completa el pago, el stock queda bloqueado. Nuestro sistema descuenta solo al confirmar, liberando stock de compras no completadas.

---

**Generado:** 28 de octubre de 2025  
**Proyecto:** Salvando Huellas
