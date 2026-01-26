import { Progress } from "../../components/ui/Progress"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { TrendingUp, Target, Calendar } from "lucide-react"

export function DonationProgress() {
  const currentAmount = 4750000
  const goalAmount = 8000000
  const progressPercentage = (currentAmount / goalAmount) * 100
  const remainingAmount = goalAmount - currentAmount
  const daysLeft = 45

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Target className="h-5 w-5" />
          Meta anual 2024: Nuevo refugio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progreso actual</span>
            <span className="font-bold">{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${currentAmount.toLocaleString()} recaudados</span>
            <span>Meta: ${goalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">${remainingAmount.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600">Faltan por recaudar</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{daysLeft}</span>
            </div>
            <p className="text-sm text-gray-600">Días restantes</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">150</span>
            </div>
            <p className="text-sm text-gray-600">Animales beneficiados</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg mt-4">
          <h4 className="font-semibold mb-2">¿Para qué necesitamos estos fondos?</h4>
          <p className="text-sm text-gray-700">
            Estamos construyendo un nuevo refugio que nos permitirá rescatar y cuidar a 150 animales adicionales.
            Incluirá quirófano veterinario, área de cuarentena y espacios de socialización.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
