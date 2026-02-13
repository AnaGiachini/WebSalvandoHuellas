import React, { useState } from "react"

// --- UI Components (Accordion) ---
export function Accordion({ children, className = "" }) {
  return <div className={`space-y-2 ${className}`}>{children}</div>
}

// Cada AccordionItem maneja su propio estado de apertura y lo pasa a Trigger/Content
export function AccordionItem({ value, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border rounded-md">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { open, setOpen })
          : child
      )}
    </div>
  )
}

export function AccordionTrigger({ children, open, setOpen }) {
  return (
    <button
      onClick={() => setOpen && setOpen(!open)}
      className="w-full flex justify-between items-center px-4 py-2 text-left font-medium"
    >
      {children}
      <span>{open ? "−" : "+"}</span>
    </button>
  )
}

export function AccordionContent({ children, open }) {
  if (!open) return null
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
                Publicamos en nuestras redes y en nuestra página informes de transparencia con los saldos/estado de cuenta de las veterinarias con las que trabajamos y el detalle de los principales gastos. Además, cuando hay rescates o casos especiales, compartimos actualizaciones y comprobantes para que puedas ver exactamente en qué se utiliza cada donación.
              </AccordionContent>
            </AccordionItem>
{/* 
            <AccordionItem value="item-2">
              <AccordionTrigger>¿Puedo deducir mi donación de impuestos?</AccordionTrigger>
              <AccordionContent>
                Sí, somos una organización sin fines de lucro registrada oficialmente. Todas las donaciones son
                deducibles de impuestos según la legislación vigente. Te enviaremos un certificado oficial por email que
                podrás usar en tu declaración anual.
              </AccordionContent>
            </AccordionItem> */}

            <AccordionItem value="item-3">
              <AccordionTrigger>¿Cuál es el monto mínimo para donar?</AccordionTrigger>
              <AccordionContent>
                Cualquier monto es bienvenido y hace la diferencia en la vida de nuestros animales rescatados.
              </AccordionContent>
            </AccordionItem>

            {/* <AccordionItem value="item-4">
              <AccordionTrigger>¿Puedo cancelar mi donación recurrente?</AccordionTrigger>
              <AccordionContent>
                Por supuesto. Puedes cancelar, pausar o modificar tu donación recurrente en cualquier momento desde tu
                perfil en nuestra web, o contactándonos directamente. No hay compromisos a largo plazo ni
                penalizaciones.
              </AccordionContent>
            </AccordionItem> */}

            <AccordionItem value="item-5">
              <AccordionTrigger>¿Qué métodos de pago aceptan?</AccordionTrigger>
              <AccordionContent>
                Aceptamos transferencias bancarias, y billeteras digitales como MercadoPago. Todos los pagos son procesados de forma segura.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>¿Puedo donar productos en lugar de dinero?</AccordionTrigger>
              <AccordionContent>
                ¡Sí! Aceptamos donaciones como alimento balanceado, medicamentos, mantas. Contáctanos para coordinar la entrega.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
