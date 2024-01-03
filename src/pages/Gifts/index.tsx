import { Gift } from 'phosphor-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from 'store/auth'
import { formatPoints } from 'utils/currencyFormat'

export function Gifts() {
  const redeemGift = useAuthStore(state => state.redeemGift)
  const currentBalance = useAuthStore(state => state.wallet.balance)
  const navigate = useNavigate()
  async function handleRedeemGift() {
    await redeemGift()
    navigate('/')
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-text">
      <Gift className="text-purple" weight="fill" size="80" />
      <span className="text-center text-lg font-bold">
        Hurrah!!! We have a gift for you!
      </span>
      <span className="text-center text-lg font-bold">
        We noticed that you only have{' '}
        <span className="text-purple">{formatPoints(currentBalance)}</span>{' '}
        points.
        <br />
        But don't worry, on this page you can redeem up to{' '}
        <span className="text-purple"> 300</span> points
        <br /> each time your balance is below{' '}
        <span className="text-purple"> 10 PPs</span>. <br />
        Just click on the button below and try your luck. <br />
      </span>
      <button
        onClick={handleRedeemGift}
        className="rounded-md bg-purpleDark px-4 py-2 font-bold text-text transition-colors hover:bg-purple"
      >
        Refill
      </button>
    </div>
  )
}
