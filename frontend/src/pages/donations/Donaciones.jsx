import { Heart } from "lucide-react"
import { DonationForm } from "../../components/donation/DonationForm"
//import { RecurringDonation } from "../../components/donation/RecurringDonation"
import { DonationFAQ } from "../../components/donation/DonationFAQ"
import { useAuth } from "../../components/auth/AuthProvider"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function DonacionesPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  // Precondición UC06: el usuario debe estar autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login?next=/donaciones', { replace: true })
    }
  }, [user, isLoading, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="relative h-64 w-full mb-8 rounded-lg overflow-hidden">
            <img
              src="/images/donation-hero.jpg"
              alt="Animales rescatados esperando ayuda"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-white">
                <Heart className="h-16 w-16 mx-auto mb-4 text-red-400" />
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Tu donación salva vidas</h1>
                <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                  Cada peso cuenta para rescatar, cuidar y encontrar hogares para animales abandonados
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Forms */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Elige cómo quieres ayudar</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hoy puedes hacer una donación única y proximamente podras convertirte en un donante recurrente para generar un impacto sostenible
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <DonationForm />
          </div>
        </div>
      </section>

      {/* How We Use Donations */}
      {/* ... (resto igual, solo cambias <Image> por <img> en testimonios) ... */}

      <DonationFAQ />

    </div>
  )
}
