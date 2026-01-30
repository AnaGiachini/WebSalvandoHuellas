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
const Evento = require('../models/evento');
const Donacion = require('../models/donacion');
const Compra = require('../models/compra');
const ItemCompra = require('../models/itemCompra');

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
        nombre: 'Luna', especie: 'perro', sexo: 'hembra', edad: 'joven', tamano: 'mediano', historia: 'Rescatada de la calle, muy cariñosa y juguetona.', estadoAdopcion: 'sin_hogar', foto: 'https://plus.unsplash.com/premium_photo-1676390051589-bead49b416a6?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        nombre: 'Simba', especie: 'gato', sexo: 'macho', edad: 'cachorro', tamano: 'pequeño', historia: 'Curioso y activo, ideal para familia con niños.', estadoAdopcion: 'sin_hogar', foto: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200&auto=format&fit=crop'
      },
      {
        nombre: 'Mía', especie: 'gato', sexo: 'hembra', edad: 'adulto', tamano: 'pequeño', historia: 'Tranquila y muy limpia, le gustan los lugares cálidos.', estadoAdopcion: 'sin_hogar', foto: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=1200&auto=format&fit=crop'
      },
      {
        nombre: 'Rocky', especie: 'perro', sexo: 'macho', edad: 'adulto', tamano: 'grande', historia: 'Leal y protector, necesita espacio para jugar.', estadoAdopcion: 'sin_hogar', foto: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1200&auto=format&fit=crop'
      },
      {
        nombre: 'Nala', especie: 'perro', sexo: 'hembra', edad: 'adulto mayor', tamano: 'mediano', historia: 'Dulce y tranquila, excelente compañía.', estadoAdopcion: 'sin_hogar', foto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop'
      },
    ];

    const animales = await Animal.bulkCreate(animalesData, { returning: true });

    console.log('> Creando artículos (ropa) para la feria americana...');
    const articulosData = [
      {
        nombre: 'Campera de abrigo unisex',
        descripcion: 'Campera de invierno en excelente estado, ideal para días fríos. Talle M/L.',
        precio: 6000,
        stock: 5,
        foto: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        categoria: 'ropa',
        segmento: 'unisex',
        descuento: 0,
        variantes: '',
        activo: true,
      },
      {
        nombre: 'Remera Basica Verde',
        descripcion: 'Remera básica de algodón color verde, suave y cómoda. Talle único.',
        precio: 4500,
        stock: 8,
        foto: 'https://images.unsplash.com/photo-1759572095329-1dcf9522762b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        categoria: 'ropa',
        segmento: 'mujer',
        descuento: 0,
        variantes: '',
        activo: true,
      },
      {
        nombre: 'Jean azul clásico',
        descripcion: 'Pantalón de jean azul, corte recto. Poco uso. Talle 40.',
        precio: 5500,
        stock: 6,
        foto: 'https://plus.unsplash.com/premium_photo-1691367279139-218a8b8dcbb3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        categoria: 'ropa',
        segmento: 'unisex',
        descuento: 0,
        variantes: '',
        activo: true,
      },
      {
        nombre: 'Vestido floreado',
        descripcion: 'Vestido informal con estampado floral, ideal para primavera/verano. Talle S/M.',
        precio: 5200,
        stock: 4,
        foto: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        categoria: 'ropa',
        segmento: 'mujer',
        descuento: 0,
        variantes: '',
        activo: true,
      },
      {
        nombre: 'Zapatillas urbanas',
        descripcion: 'Zapatillas deportivas urbanas, cómodas y versátiles. Talle 38.',
        precio: 7000,
        stock: 3,
        foto: 'https://images.unsplash.com/photo-1578955220606-4a6c181aa6bb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        categoria: 'calzados',
        segmento: 'mujer',
        descuento: 0,
        variantes: '',
        activo: true,
      }
    ];
    const articulos = await Articulo.bulkCreate(articulosData, { returning: true });

    console.log('> Creando eventos...');
    const now = new Date();
    const atHour = (base, daysOffset, hour = 10, minute = 0) => {
      const d = new Date(base);
      d.setDate(d.getDate() + daysOffset);
      d.setHours(hour, minute, 0, 0);
      return d;
    };
    const eventosData = [
      {
        titulo: 'Jornada de Adopción',
        descripcion: 'Conoce a nuestros peludos y encuentra a tu compañero ideal.',
        fecha: atHour(now, 7, 10, 0), // próximo en 7 días
        lugar: 'Plaza Central',
        foto: 'https://images.unsplash.com/photo-1661481815672-b41a26208086?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        titulo: 'Campaña de Vacunación',
        descripcion: 'Vacunación y desparasitación a bajo costo.',
        fecha: atHour(now, 14, 9, 0), // próximo en 14 días
        lugar: 'Sede Salvando Huellas',
        foto: 'https://plus.unsplash.com/premium_photo-1726768886710-92e78c6272df?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        titulo: 'Taller de Tenencia Responsable',
        descripcion: 'Aprende cuidados esenciales para tu mascota.',
        fecha: atHour(now, -10, 18, 0), // pasado hace 10 días
        lugar: 'Biblioteca Municipal',
        foto: 'https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        titulo: 'Caminata Solidaria',
        descripcion: 'Actividad familiar para recaudar fondos.',
        fecha: atHour(now, -25, 9, 0), // pasado hace 25 días
        lugar: 'Parque Central',
        foto: 'https://images.unsplash.com/photo-1719093716464-e96aa6dca6f2?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
    ];

    const eventos = await Evento.bulkCreate(eventosData, { returning: true });

    // Creamos algunas solicitudes para probar estados y la lógica exclusiva
    console.log('> Creando solicitudes de adopción de ejemplo...');

    // 1) Solicitud pendiente → el animal debe quedar en_proceso
    const animalPendiente = animales[0];
    const solPendiente = await SolicitudAdopcion.create({
      idUsuario: user.idUsuario,
      idAnimal: animalPendiente.idAnimal,
      estado: 'pendiente',
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: '11-2345-6789',
      direccion: 'Calle Ejemplo 123, Buenos Aires',
    });
    await animalPendiente.update({ estadoAdopcion: 'en_proceso' });

    // 2) Solicitud aprobada → el animal queda adoptado
    const animalAprobada = animales[1];
    const solAprobada = await SolicitudAdopcion.create({
      idUsuario: user.idUsuario,
      idAnimal: animalAprobada.idAnimal,
      estado: 'aprobada',
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: '11-2345-6789',
      direccion: 'Calle Ejemplo 123, Buenos Aires',
    });
    await animalAprobada.update({ estadoAdopcion: 'adoptado' });

    // 3) Solicitud rechazada → el animal vuelve a sin_hogar (se mantiene)
    const animalRechazada = animales[2];
    const solRechazada = await SolicitudAdopcion.create({
      idUsuario: user.idUsuario,
      idAnimal: animalRechazada.idAnimal,
      estado: 'rechazada',
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: '11-2345-6789',
      direccion: 'Calle Ejemplo 123, Buenos Aires',
    });
    await animalRechazada.update({ estadoAdopcion: 'sin_hogar' });

    console.log('> Creando donaciones de ejemplo...');
    const donaciones = await Donacion.bulkCreate(
      [
        {
          idUsuario: user.idUsuario,
          monto: 10000,
          estadoPago: 'pagado',
          metodoPago: 'mercado_pago',
        },
        {
          idUsuario: user.idUsuario,
          monto: 5000,
          estadoPago: 'pagado',
          metodoPago: 'transferencia',
        },
      ],
      { returning: true }
    );

    console.log('> Creando compras de ejemplo...');
    // Compra 1: 1 unidad del primer y segundo artículo, pagada por MP
    const compra1Total = articulos[0].precio + articulos[1].precio;
    const compra1 = await Compra.create({
      idUsuario: user.idUsuario,
      total: compra1Total,
      estadoPago: 'pagado',
      metodoPago: 'mercado_pago',
    });

    await ItemCompra.bulkCreate([
      {
        idCompra: compra1.idCompra,
        idArticulo: articulos[0].idArticulo,
        cantidad: 1,
        precioUnitario: articulos[0].precio,
        subtotal: articulos[0].precio,
      },
      {
        idCompra: compra1.idCompra,
        idArticulo: articulos[1].idArticulo,
        cantidad: 1,
        precioUnitario: articulos[1].precio,
        subtotal: articulos[1].precio,
      },
    ]);

    // Compra 2: 2 unidades del tercer artículo, pagada por transferencia
    const compra2Total = articulos[2].precio * 2;
    const compra2 = await Compra.create({
      idUsuario: user.idUsuario,
      total: compra2Total,
      estadoPago: 'pagado',
      metodoPago: 'transferencia',
    });

    await ItemCompra.bulkCreate([
      {
        idCompra: compra2.idCompra,
        idArticulo: articulos[2].idArticulo,
        cantidad: 2,
        precioUnitario: articulos[2].precio,
        subtotal: articulos[2].precio * 2,
      },
    ]);

    console.log('> Seed completado ✅');
    console.log('Resumen:');
    console.log(`  Usuarios: admin=${admin.email} (Admin1234), user=${user.email} (User1234)`);
    console.log(`  Animales creados: ${animales.length}`);
    console.log(`  Artículos creados: ${articulos.length}`);
    console.log(`  Eventos creados: ${eventos.length}`);
    console.log('  Solicitudes:');
    console.log(`   - Pendiente #${solPendiente.idSolicitud} → Animal ${animalPendiente.nombre} en_proceso`);
    console.log(`   - Aprobada  #${solAprobada.idSolicitud} → Animal ${animalAprobada.nombre} adoptado`);
    console.log(`   - Rechazada #${solRechazada.idSolicitud} → Animal ${animalRechazada.nombre} sin_hogar`);
    console.log(`  Donaciones creadas: ${donaciones.length}`);
    console.log(`  Compras creadas: 2 (IDs: ${compra1.idCompra}, ${compra2.idCompra})`);

    process.exit(0);
  } catch (err) {
    console.error('> Error en seeder:', err);
    process.exit(1);
  }
})();
