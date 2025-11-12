-- Migración rápida: Agregar especie a animales existentes
-- Ejecutar ANTES de iniciar el servidor

-- Paso 1: Agregar columna especie como NULLABLE temporalmente
ALTER TABLE animales
ADD COLUMN IF NOT EXISTS especie VARCHAR(10);

-- Paso 2: Actualizar registros existentes con valor por defecto 'perro'
UPDATE animales
SET especie = 'perro'
WHERE especie IS NULL;

-- Paso 3: Crear el tipo ENUM si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_animales_especie') THEN
        CREATE TYPE enum_animales_especie AS ENUM ('perro', 'gato');
    END IF;
END $$;

-- Paso 4: Convertir la columna al tipo ENUM
ALTER TABLE animales
ALTER COLUMN especie TYPE enum_animales_especie USING especie::enum_animales_especie;

-- Paso 5: Hacer la columna NOT NULL
ALTER TABLE animales
ALTER COLUMN especie SET NOT NULL;

-- Verificar
SELECT nombre, especie FROM animales;
