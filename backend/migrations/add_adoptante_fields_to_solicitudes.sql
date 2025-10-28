-- Migración: Agregar campos del adoptante a solicitudes_adopcion
-- Fecha: 28 de octubre de 2025
-- Descripción: Agrega campos para guardar snapshot de datos del adoptante al momento de la solicitud

-- IMPORTANTE: Ejecutar esta migración en la base de datos de producción

ALTER TABLE solicitudes_adopcion
ADD COLUMN nombre VARCHAR(50) NOT NULL DEFAULT '',
ADD COLUMN apellido VARCHAR(50) NOT NULL DEFAULT '',
ADD COLUMN email VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN telefono VARCHAR(20) NOT NULL DEFAULT '',
ADD COLUMN direccion VARCHAR(200) NOT NULL DEFAULT '',
ADD COLUMN experienciaPrevia TEXT NULL,
ADD COLUMN motivacion TEXT NULL;

-- Eliminar defaults después de agregar las columnas
ALTER TABLE solicitudes_adopcion
ALTER COLUMN nombre DROP DEFAULT,
ALTER COLUMN apellido DROP DEFAULT,
ALTER COLUMN email DROP DEFAULT,
ALTER COLUMN telefono DROP DEFAULT,
ALTER COLUMN direccion DROP DEFAULT;

-- Nota: Las solicitudes existentes tendrán valores vacíos en estos campos
-- Si necesitas poblarlos desde la tabla de usuarios, ejecuta:
--
-- UPDATE solicitudes_adopcion sa
-- SET 
--   nombre = u.nombre,
--   apellido = u.apellido,
--   email = u.email,
--   telefono = u.telefono,
--   direccion = u.direccion
-- FROM usuarios u
-- WHERE sa.idUsuario = u.idUsuario
-- AND sa.nombre = '';
