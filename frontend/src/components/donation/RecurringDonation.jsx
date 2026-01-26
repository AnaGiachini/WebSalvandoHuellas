import React, { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Calendar, Heart, Star } from "lucide-react"

const recurringAmounts = [500, 1000, 2500, 5000]
const frequencies = [
  { value: "monthly", label: "Mensual", multiplier: 12 },
  { value: "quarterly", label: "Trimestral", multiplier: 4 },
  { value: "yearly", label: "Anual", multiplier: 1 },
]

export function RecurringDonation() {
  const [amount, setAmount] = useState(null)
  const [customAmount, setCustomAmount] = useState("")
  const [frequency, setFrequency] = useState("monthly")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAmountSelect = (value) => {
    setAmount(value)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value) => {
    setCustomAmount(value)
    setAmount(null)
  }

  const handleSubscribe = () => {
    const donationAmount = amount || parseInt(customAmount)

    if (!donationAmount || donationAmount < 500) {
      alert("El monto mínimo para donaciones recurrentes es $500")
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      alert(
        `Tu donación ${frequency === "monthly" ? "mensual" : frequency === "quarterly" ? "trimestral" : "anual"} de $${donationAmount.toLocaleString()} ha sido configurada.`
      )
    }, 2000)
  }

  const finalAmount = amount || parseInt(customAmount) || 0
  const selectedFrequency = frequencies.find((f) => f.value === frequency)
  const yearlyImpact = finalAmount * (selectedFrequency?.multiplier || 12)

  return (
    <Card className="relative">
      <div className="absolute -top-3 left-4">
        <Badge className="bg-orange-500 hover:bg-orange-600">
          <Star className="h-3 w-3 mr-1" />
          Más impacto
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Donación recurrente
        </CardTitle>
        <CardDescription>Conviértete en un héroe constante con donaciones automáticas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monto */}
        <div>
          <Label className="text-base font-medium mb-4 block">Monto de la donación</Label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {recurringAmounts.map((value) => (
              <Button
                key={value}
                variant={amount === value ? "default" : "outline"}
                onClick={() => handleAmountSelect(value)}
                className="h-12"
              >
                ${value.toLocaleString()}
              </Button>
            ))}
          </div>

          <div>
            <Label htmlFor="custom-recurring-amount">Otro monto (mín. $500)</Label>
            <Input
              id="custom-recurring-amount"
              type="number"
              placeholder="Ingresa el monto"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Frecuencia */}
        <div>
          <Label className="text-base font-medium mb-4 block">Frecuencia</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {frequencies.map((freq) => (
                <SelectItem key={freq.value} value={freq.value}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {freq.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {finalAmount >= 500 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Donación {selectedFrequency?.label.toLowerCase()}:</span>
              <span className="text-xl font-bold text-orange-600">${finalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">Impacto anual:</span>
              <span className="text-2xl font-bold text-red-600">${yearlyImpact.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Beneficios */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-900">Beneficios de ser donante recurrente:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Actualizaciones mensuales</li>
            <li>• Acceso prioritario a eventos</li>
            <li>• Certificado de donante distinguido</li>
            <li>• Cancelar o modificar en cualquier momento</li>
          </ul>
        </div>

        <Button
          onClick={handleSubscribe}
          disabled={!finalAmount || finalAmount < 500 || isProcessing}
          className="w-full h-12 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          {isProcessing
            ? "Configurando..."
            : `Donar $${finalAmount.toLocaleString()} ${selectedFrequency?.label.toLowerCase()}`}
        </Button>
      </CardContent>
    </Card>
  )
}
