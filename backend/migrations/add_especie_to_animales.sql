-- Migración: Agregar campo especie a animales
-- Fecha: 3 de noviembre de 2025
-- Descripción: Agrega campo especie (perro/gato) a la tabla animales

-- IMPORTANTE: Ejecutar esta migración en la base de datos

-- Paso 1: Crear el ENUM type para especie
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_animales_especie') THEN
        CREATE TYPE enum_animales_especie AS ENUM ('perro', 'gato');
    END IF;
END $$;

-- Paso 2: Agregar columna con valor temporal por defecto para datos existentes
ALTER TABLE animales
ADD COLUMN especie enum_animales_especie DEFAULT 'perro';

-- Paso 3: Hacer la columna NOT NULL (el DEFAULT se mantiene para futuros inserts)
ALTER TABLE animales
ALTER COLUMN especie SET NOT NULL;

-- Nota: Los animales existentes tendrán 'perro' por defecto
-- Si necesitas actualizar manualmente algunos registros a 'gato', ejecuta:
--
-- UPDATE animales
-- SET especie = 'gato'
-- WHERE nombre IN ('nombre_gato_1', 'nombre_gato_2');
