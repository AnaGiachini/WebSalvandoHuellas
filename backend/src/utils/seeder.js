/*
 * Seeder: Usuarios, Animales y Solicitudes de Adopción
 * --------------------------------------------------------------------------
 * Ejecuta: npm run seed  (desde la carpeta backend)
 * Requisitos:
 *  - Variables de entorno: DATABASE_URL (o TEST_DB_*) según configs/db.js
 *  - Este script borrará y recreará todas las tablas (sync({ force: true }))
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../configs/db');
const associations = require('../configs/associations');

// Modelos
const Usuario = require('../models/usuario');
const Animal = require('../models/animal');
const SolicitudAdopcion = require('../models/solicitudAdopcion');
const Articulo = require('../models/articulo');

(async () => {
  try {
    console.log('> Cargando asociaciones...');
    associations();

    console.log('> Sincronizando base de datos (force: true)...');
    await sequelize.sync({ force: true });

    console.log('> Creando usuarios...');
    const passwordAdmin = await bcrypt.hash('Admin1234', 10);
    const passwordUser = await bcrypt.hash('User1234', 10);

    const admin = await Usuario.create({
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@admin.com',
      contrasena: passwordAdmin,
      rol: 'admin',
    });

    const user = await Usuario.create({
      nombre: 'Ana',
      apellido: 'Gonzalez',
      email: 'ana@gmail.com',
      contrasena: passwordUser,
      rol: 'user',
    });

    console.log('> Creando animales...');
    const animalesData = [
      {
        nombre: 'Luna', sexo: 'hembra', edad: 'joven', tamano: 'mediano', historia: 'Rescatada de la calle, muy cariñosa y juguetona.', estadoAdopcion: 'sin_hogar', foto: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop'
      },
      {
        nombre: 'Simba', sexo: 'macho', edad: 'cachorro', tamano: 'pequeño', historia: 'Curioso y activo, ideal para familia con niños.', estadoAdopcion: 'sin_hogar', foto: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200&auto=format&fit=crop'
      },
      {
        nombre: 'Mía', sexo: 'hembra', edad: 'adulto', tamano: 'pequeño', historia: 'Tranquila y muy limpia, le gustan los lugares cálidos.', estadoAdopcion: 'sin_hogar', foto: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=1200&auto=format&fit=crop'
      },
      {
        nombre: 'Rocky', sexo: 'macho', edad: 'adulto', tamano: 'grande', historia: 'Leal y protector, necesita espacio para jugar.', estadoAdopcion: 'sin_hogar', foto: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1200&auto=format&fit=crop'
      },
      {
        nombre: 'Nala', sexo: 'hembra', edad: 'adulto mayor', tamano: 'mediano', historia: 'Dulce y tranquila, excelente compañía.', estadoAdopcion: 'sin_hogar', foto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop'
      },
    ];

    const animales = await Animal.bulkCreate(animalesData, { returning: true });

    console.log('> Creando artículos (productos) para la tienda...');
    const articulosData = [
      {
        nombre: 'Alimento Premium para Perros',
        descripcion: 'Alimento balanceado de alta calidad para perros adultos. Ingredientes naturales y sin conservantes.',
        precio: 2500,
        stock: 50,
        foto: 'https://images.unsplash.com/photo-1610085833750-cf59bb6b2c83?q=80&w=1200&auto=format&fit=crop'
      },
      {
        nombre: 'Cama para Gatos',
        descripcion: 'Cama suave y cómoda para gatos de todos los tamaños.',
        precio: 1800,
        stock: 30,
        foto: 'https://images.unsplash.com/photo-1568640381651-9273950f7f21?q=80&w=1200&auto=format&fit=crop'
      },
      {
        nombre: 'Juguete Interactivo',
        descripcion: 'Juguete interactivo para mantener a tu mascota entretenida.',
        precio: 950,
        stock: 100,
        foto: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1200&auto=format&fit=crop'
      },
      {
        nombre: 'Shampoo Hipoalergénico',
        descripcion: 'Shampoo suave para pieles sensibles, apto para perros y gatos.',
        precio: 1200,
        stock: 40,
        foto: 'https://images.unsplash.com/photo-1598550874175-2b1f30586b43?q=80&w=1200&auto=format&fit=crop'
      },
      {
        nombre: 'Correa Reforzada',
        descripcion: 'Correa de nylon reforzado, ideal para paseos seguros.',
        precio: 1400,
        stock: 60,
        foto: 'https://images.unsplash.com/photo-1612538494402-6fdb9fee9601?q=80&w=1200&auto=format&fit=crop'
      }
    ];
    const articulos = await Articulo.bulkCreate(articulosData, { returning: true });

    // Creamos algunas solicitudes para probar estados y la lógica exclusiva
    console.log('> Creando solicitudes de adopción de ejemplo...');

    // 1) Solicitud pendiente → el animal debe quedar en_proceso
    const animalPendiente = animales[0];
    const solPendiente = await SolicitudAdopcion.create({
      idUsuario: user.idUsuario,
      idAnimal: animalPendiente.idAnimal,
      estado: 'pendiente',
    });
    await animalPendiente.update({ estadoAdopcion: 'en_proceso' });

    // 2) Solicitud aprobada → el animal queda adoptado
    const animalAprobada = animales[1];
    const solAprobada = await SolicitudAdopcion.create({
      idUsuario: user.idUsuario,
      idAnimal: animalAprobada.idAnimal,
      estado: 'aprobada',
    });
    await animalAprobada.update({ estadoAdopcion: 'adoptado' });

    // 3) Solicitud rechazada → el animal vuelve a sin_hogar (se mantiene)
    const animalRechazada = animales[2];
    const solRechazada = await SolicitudAdopcion.create({
      idUsuario: user.idUsuario,
      idAnimal: animalRechazada.idAnimal,
      estado: 'rechazada',
    });
    await animalRechazada.update({ estadoAdopcion: 'sin_hogar' });

    console.log('> Seed completado ✅');
    console.log('Resumen:');
    console.log(`  Usuarios: admin=${admin.email} (Admin1234), user=${user.email} (User1234)`);
    console.log(`  Animales creados: ${animales.length}`);
    console.log(`  Artículos creados: ${articulos.length}`);
    console.log('  Solicitudes:');
    console.log(`   - Pendiente #${solPendiente.idSolicitud} → Animal ${animalPendiente.nombre} en_proceso`);
    console.log(`   - Aprobada  #${solAprobada.idSolicitud} → Animal ${animalAprobada.nombre} adoptado`);
    console.log(`   - Rechazada #${solRechazada.idSolicitud} → Animal ${animalRechazada.nombre} sin_hogar`);

    process.exit(0);
  } catch (err) {
    console.error('> Error en seeder:', err);
    process.exit(1);
  }
})();
