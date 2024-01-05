import { CurrencyDollarSimple } from 'phosphor-react'
import { formatPoints } from 'utils/currencyFormat'
import { useAuthStore } from 'store/auth'

interface WalletCardProps {
  showFormatted?: boolean
  balance: number
}

export function WalletCard({ balance, showFormatted }: WalletCardProps) {
  const fundWallet = useAuthStore(state => state.fundWallet)
  const currency = showFormatted ? formatPoints(balance) : balance
  return (
    <div className="flex cursor-pointer items-stretch">
      <div className="flex items-center gap-2 rounded-bl-md rounded-tl-md bg-background px-2 py-1 pr-4 font-bold uppercase text-white md:text-lg">
        <span className="rounded-full bg-purpleDark p-1">
          <CurrencyDollarSimple weight="bold" />
        </span>
        <span title={String(balance)}>{currency}</span>
      </div>
      <button
        title="Pi Balance"
        onClick={function handleWalletFunding() {
          try {
            const fundsToAdd = prompt('How much would you like to add?')
            fundWallet(Number(fundsToAdd))
          } catch (error) {
            console.error(error)
          }
        }}
        className="rounded-br-md rounded-tr-md bg-purpleDark p-2 font-bold text-white"
      >
        + Pi
      </button>
    </div>
  )
}
