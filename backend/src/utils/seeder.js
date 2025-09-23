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
      email: 'admin@salvandohuellas.org',
      contrasena: passwordAdmin,
      rol: 'admin',
    });

    const user = await Usuario.create({
      nombre: 'Ana',
      apellido: 'Gonzalez',
      email: 'ana@example.com',
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
