# Roadmap Profesional

Este roadmap prioriza mejoras que hacen el proyecto más sólido para portfolio y más útil para una protectora real.

## Corto Plazo

- Crear `.env.example` y mantener secretos fuera del repositorio.
- Unificar puertos locales entre frontend y backend.
- Agregar validación de variables obligatorias al iniciar backend.
- Corregir tests base del frontend para que prueben la app real.
- Documentar instalación, scripts y arquitectura.
- Agregar capturas de pantalla al README cuando haya una versión visual estable.

## Producto para Protectora

- Tablero de indicadores: animales publicados, solicitudes pendientes, adopciones aprobadas, donaciones del mes, ventas solidarias y eventos próximos.
- Estados claros para cada solicitud de adopción: recibida, en revisión, entrevista, aprobada, rechazada, seguimiento.
- Historial por animal: rescate, tratamientos, vacunas, castración, tránsito, adopción y seguimiento.
- Perfil del adoptante con historial de solicitudes y datos de contacto.
- Registro de gastos veterinarios asociado a cada animal.
- Donaciones con destino: alimento, medicamentos, castraciones, traslados u otros fondos.
- Reportes descargables para rendición de cuentas.

## Comunicación

- Notificaciones por email para solicitud recibida, cambio de estado y adopción aprobada.
- Plantillas de respuesta para admins.
- Recordatorios de seguimiento post-adopción.
- Mensajes automáticos para donantes con comprobante y agradecimiento.

## Seguridad y Operación

- Rate limiting en auth y contacto.
- Validación de firma en webhooks de Mercado Pago.
- Auditoría básica de acciones administrativas.
- Logs estructurados para errores importantes.
- Backups documentados de base de datos.
- Roles más granulares: admin, voluntario, tesorería, adopciones.

## Calidad Técnica

- Tests de integración para flujos críticos.
- Tests de componentes principales del frontend.
- CI en GitHub Actions: lint, test y build.
- Migraciones completas y versionadas.
- Seeders de demo seguros para portfolio.
- Documentación OpenAPI/Swagger para la API.

## Portfolio

- README con screenshots, demo y credenciales de prueba.
- Video corto mostrando flujo de adopción, compra y panel admin.
- Deploy público del frontend.
- Deploy público del backend con base de datos demo.
- Issues organizadas por `bug`, `feature`, `documentation` y `good first issue`.
- Releases con changelog.
