import React, { useState } from "react"

// --- UI Components (Accordion) ---
export function Accordion({ children, className = "" }) {
  return <div className={`space-y-2 ${className}`}>{children}</div>
}

export function AccordionItem({ value, children }) {
  return <div className="border rounded-md">{children}</div>
}

export function AccordionTrigger({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-2 text-left font-medium"
      >
        {children}
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-4">{/* Aquí va el contenido */}</div>}
    </div>
  )
}

export function AccordionContent({ children }) {
  return <div className="px-4 pb-4 text-sm text-gray-600">{children}</div>
}

// --- Donation FAQ ---
export function DonationFAQ() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Resolvemos las dudas más comunes sobre las donaciones
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>¿Cómo sé que mi donación llega a los animales?</AccordionTrigger>
              <AccordionContent>
                Publicamos informes mensuales de transparencia donde detallamos exactamente cómo se utilizan los fondos.
                Además, puedes visitarnos en cualquier momento para ver el trabajo que realizamos. El 98% de las
                donaciones van directamente al cuidado de los animales.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>¿Puedo deducir mi donación de impuestos?</AccordionTrigger>
              <AccordionContent>
                Sí, somos una organización sin fines de lucro registrada oficialmente. Todas las donaciones son
                deducibles de impuestos según la legislación vigente. Te enviaremos un certificado oficial por email que
                podrás usar en tu declaración anual.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>¿Cuál es el monto mínimo para donar?</AccordionTrigger>
              <AccordionContent>
                Para donaciones únicas el monto mínimo es de $100. Para donaciones recurrentes el mínimo es de $500. Sin
                embargo, cualquier monto es bienvenido y hace la diferencia en la vida de nuestros animales rescatados.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>¿Puedo cancelar mi donación recurrente?</AccordionTrigger>
              <AccordionContent>
                Por supuesto. Puedes cancelar, pausar o modificar tu donación recurrente en cualquier momento desde tu
                perfil en nuestra web, o contactándonos directamente. No hay compromisos a largo plazo ni
                penalizaciones.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>¿Qué métodos de pago aceptan?</AccordionTrigger>
              <AccordionContent>
                Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias, y
                billeteras digitales como MercadoPago, PayPal y Ualá. Todos los pagos son procesados de forma segura.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>¿Puedo donar productos en lugar de dinero?</AccordionTrigger>
              <AccordionContent>
                ¡Sí! Aceptamos donaciones en especie como alimento balanceado, medicamentos, mantas, juguetes y
                materiales de construcción. Contáctanos para coordinar la entrega y conocer nuestras necesidades
                actuales más urgentes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>¿Cómo puedo seguir el impacto de mi donación?</AccordionTrigger>
              <AccordionContent>
                Los donantes recurrentes reciben actualizaciones mensuales por email con fotos y historias de los
                animales ayudados. También publicamos en nuestras redes sociales y página web el progreso de nuestros
                proyectos y rescates.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
