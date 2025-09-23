import { Heart, Users, TrendingUp, Shield } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { DonationForm } from "../../components/donation/DonationForm"
import { RecurringDonation } from "../../components/donation/RecurringDonation"
import { DonationProgress } from "../../components/donation/DonationProgress"
import { DonationFAQ } from "../../components/donation/DonationFAQ"

export default function DonacionesPage() {
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

      {/* Impact Stats */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">847</h3>
              <p className="text-gray-600">Animales rescatados este año</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">623</h3>
              <p className="text-gray-600">Adopciones exitosas</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1,250</h3>
              <p className="text-gray-600">Donantes activos</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">98%</h3>
              <p className="text-gray-600">De fondos van directamente a los animales</p>
            </div>
          </div>

          <DonationProgress />
        </div>
      </section>

      {/* Donation Forms */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Elige cómo quieres ayudar</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Puedes hacer una donación única o convertirte en un donante recurrente para generar un impacto sostenible
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <DonationForm />
            <RecurringDonation />
          </div>
        </div>
      </section>

      {/* How We Use Donations */}
      {/* ... (resto igual, solo cambias <Image> por <img> en testimonios) ... */}

      <DonationFAQ />

      {/* Tax Information */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Información fiscal</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg text-gray-700 mb-4">
                Salvando Huellas es una organización sin fines de lucro registrada. Todas las donaciones son deducibles
                de impuestos según la legislación vigente.
              </p>
              <p className="text-sm text-gray-600 mb-6">
                CUIT: 30-12345678-9 | Personería Jurídica: Resolución IGJ N° 123/2020
              </p>
              <Badge variant="secondary">Te enviaremos el certificado de donación por email</Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
