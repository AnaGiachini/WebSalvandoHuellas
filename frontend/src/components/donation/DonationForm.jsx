import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../components/ui/RadioGroup"
import { Separator } from "../../components/ui/separator"
import { CreditCard, Building2 } from "lucide-react"
import { useToast } from "../../hooks/useToast"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../components/auth/AuthProvider"
import paymentService from "../../services/paymentService"
import donationService from "../../services/donationService"

const predefinedAmounts = [500, 1000, 2500, 5000, 10000]

export function DonationForm() {
  const [amount, setAmount] = useState(null)
  const [customAmount, setCustomAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("mercado_pago")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleAmountSelect = (value) => {
    setAmount(value)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value) => {
    setCustomAmount(value)
    setAmount(null)
  }

  const handleDonate = async () => {
    try {
      const donationAmount = amount || parseInt(customAmount)
      if (!user) { navigate('/login?next=/donaciones'); return }
      if (!donationAmount || donationAmount < 100) {
        toast({ title: "Monto inválido", description: "El monto mínimo de donación es $100" })
        return
      }
      setIsProcessing(true)

      if (paymentMethod === 'mercado_pago') {
        const { init_point } = await paymentService.createDonationPreference({ monto: donationAmount })
        if (init_point) { window.location.href = init_point; return }
        toast({ title: 'No se pudo iniciar el pago', description: 'Intenta nuevamente en unos minutos' })
      } else if (paymentMethod === 'transfer') {
        await donationService.createTransfer({ monto: donationAmount })
        toast({ title: 'Donación registrada', description: 'Realiza la transferencia con los datos indicados. ¡Gracias!' })
        navigate('/donaciones/gracias')
        return
      }
    } catch (e) {
      toast({ title: 'Error', description: e?.response?.data?.message || e.message || 'No se pudo procesar la donación' })
    } finally {
      setIsProcessing(false)
    }
  }

  const finalAmount = amount || parseInt(customAmount) || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Donación única
        </CardTitle>
        <CardDescription>Haz una donación única para ayudar a los animales rescatados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selección de monto */}
        <div>
          <Label className="text-base font-medium mb-4 block">Selecciona el monto</Label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {predefinedAmounts.map((value) => (
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
            <Label htmlFor="custom-amount">Otro monto</Label>
            <Input
              id="custom-amount"
              type="number"
              placeholder="Ingresa el monto"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <Separator />

        {/* Método de pago */}
        <div>
          <Label className="text-base font-medium mb-4 block">Método de pago</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="mercado_pago" id="mercado_pago" />
              <Label htmlFor="mercado_pago" className="flex items-center gap-2 cursor-pointer flex-1">
                <CreditCard className="h-4 w-4" />
                Mercado Pago (tarjeta/billeteras)
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="transfer" id="transfer" />
              <Label htmlFor="transfer" className="flex items-center gap-2 cursor-pointer">
                <Building2 className="h-4 w-4" />
                Transferencia bancaria
              </Label>
            </div>
          </RadioGroup>
          {paymentMethod === 'transfer' && (
            <div className="mt-4 p-4 rounded-lg border bg-white">
              <div className="font-medium mb-2">Instrucciones para transferencia</div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center justify-between">
                  <span><span className="text-gray-500">Alias:</span> salvandohuellas.jm</span>
                  <button
                    type="button"
                    className="text-primary text-xs underline"
                    onClick={() => { navigator.clipboard.writeText('salvandohuellas.jm'); toast({ title: 'Copiado', description: 'Alias copiado al portapapeles' }); }}
                  >Copiar</button>
                </li>
                <li className="flex items-center justify-between">
                  <span><span className="text-gray-500">CVU:</span> 0000003100064017923408</span>
                  <button
                    type="button"
                    className="text-primary text-xs underline"
                    onClick={() => { navigator.clipboard.writeText('0000003100064017923408'); toast({ title: 'Copiado', description: 'CVU copiado al portapapeles' }); }}
                  >Copiar</button>
                </li>
                <li>
                  <span className="text-gray-500">Titular:</span> Mara Emma Giachini
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                Una vez realizada la transferencia, presiona "Donar" para registrar tu donación como pendiente. Podrás ver el estado en "Mis donaciones".
              </p>
            </div>
          )}
        </div>

        {finalAmount > 0 && (
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total a donar:</span>
              <span className="text-2xl font-bold text-orange-600">${finalAmount.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600">
              Con esta donación podrás ayudar a alimentar a {Math.floor(finalAmount / 150)} animales por un día
            </p>
          </div>
        )}

        <Button
          onClick={handleDonate}
          disabled={!finalAmount || finalAmount < 100 || isProcessing}
          className="w-full h-12 text-lg"
        >
          {isProcessing ? "Procesando..." : `Donar $${finalAmount.toLocaleString()}`}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Al hacer clic en "Donar" aceptas nuestros términos y condiciones. Recibirás un certificado de donación por
          email.
        </p>
      </CardContent>
    </Card>
  )
}
