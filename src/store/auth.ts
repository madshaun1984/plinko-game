import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { produce } from 'immer'
import { auth, database } from 'lib/firebase'
import toast from 'react-hot-toast'
import { random } from 'utils/random'
import { create } from 'zustand'
import axios from 'axios'
import { useState } from 'react'

// DO NOT expose these values to public
/*const apiKey = import.meta.env.VITE_PI_API_KEY
const walletPrivateSeed = import.meta.env.VITE_PI_WALLET_PRIVATE_SEED
const piBackend = new PiNetwork(apiKey, walletPrivateSeed)*/

const Pi = window.Pi

type MyPaymentMetadata = {}

type AuthResult = {
  accessToken: string
  user: {
    uid: string
    username: string
  }
}

interface PaymentDTO {
  amount: number
  user_uid: string
  created_at: string
  identifier: string
  metadata: Object
  memo: string
  status: {
    developer_approved: boolean
    transaction_verified: boolean
    developer_completed: boolean
    cancelled: boolean
    user_cancelled: boolean
  }
  to_address: string
  transaction: null | {
    txid: string
    verified: boolean
    _link: string
  }
}

interface User {
  uid: string
  id: string
  name: string
  email: string
  profilePic?: string
}

interface Wallet {
  balance: number
}

interface State {
  user: User
  wallet: Wallet
  isAuth: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: User) => void
  isAuthLoading: boolean
  isWalletLoading: boolean
  setBalance: (balance: number) => void
  setBalanceOnDatabase: (balance: number) => Promise<void>
  incrementBalance: (amount: number) => Promise<void>
  decrementBalance: (amount: number) => Promise<void>
  redeemGift: () => Promise<void>
  fundWallet: (amount: number) => Promise<void>
}

function storeUser(user: User) {
  localStorage.setItem('uid', user.id)
  localStorage.setItem('name', user.name)
  localStorage.setItem('profilePic', user.profilePic || '')
}

function clearUser() {
  localStorage.removeItem('uid')
  localStorage.removeItem('name')
  localStorage.removeItem('profilePic')
}

const userInitialState: User = {
  uid: '',
  id: '',
  name: '',
  email: ''
}

const walletInitialState: Wallet = {
  balance: 0
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_PLINKO_APP_BACKEND_URL!,
  timeout: 20000,
  withCredentials: true
})
const config = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://plinko.digitaldungeon.co.uk',
    'Access-Control-Allow-Credentials': 'true'
  }
}

const onIncompletePaymentFound = (payment: PaymentDTO) => {
  try {
    console.log('onIncompletePaymentFound', payment)
    return axiosClient.post('/payments/incomplete', { payment })
  } catch (error) {
    console.debug(error)
  }
}

const onReadyForServerApproval = (paymentId: string) => {
  try {
    console.log('onReadyForServerApproval', paymentId)
    axiosClient.post('/payments/approve', { paymentId }, config)
  } catch (error) {
    console.debug(error)
  }
}

/*const onReadyForServerCompletion = async (paymentId: string, txid: string) => {
  try {
    const [state, setState] = useState()
    console.log('onReadyForServerCompletion', paymentId, txid)
    const { data } = await axiosClient.post(
      '/payments/complete',
      { paymentId, txid },
      config
    )
    const paymentDto: PaymentDTO = data

    if (paymentDto.status.developer_completed != true) {
      throw 'Payment was not completed.'
    }

  } catch (error) {
    console.log(`Add funds error: ${error}`)
  }
}*/

/*async function processPayment(paymentDto: PaymentDTO) {
  const currentBalance = useAuthStore(state => state.wallet.balance)
  const incrementBalance = useAuthStore(state => state.incrementBalance)
  const newBalance = useAuthStore(state => state.wallet.balance)
  console.log(`Payment recieved, adding ${paymentDto.amount} to balance.`)
  console.log('Current Balance', currentBalance)
  await incrementBalance(paymentDto.amount)
  console.log('New Balance', newBalance)
  console.log('Payment processed. Thank you!')
}*/

const onCancel = (paymentId: string) => {
  try {
    console.log('onCancel', paymentId)
    return axiosClient.post('/payments/cancelled_payment', { paymentId })
  } catch (error) {
    console.debug(error)
  }
}

const onError = (error: Error, payment?: PaymentDTO) => {
  console.log('onError', error)
  if (payment) {
    console.log(payment)
    // handle the error accordingly
  }
}

export const useAuthStore = create<State>((setState, getState) => ({
  user: userInitialState,
  wallet: walletInitialState,
  isAuthLoading: false,
  isWalletLoading: false,
  isAuth: false,
  setBalance: (balance: number) => {
    try {
      setState(
        produce<State>(state => {
          state.wallet.balance = balance
          state.isWalletLoading = false
        })
      )
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar o saldo')
      console.error('setBalanceError', error)
    }
  },
  setBalanceOnDatabase: async (balance: number) => {
    try {
      if (getState().isAuth) {
        const walletRef = ref(database, 'wallet/' + getState().user.id)
        await set(walletRef, {
          currentBalance: balance,
          user: {
            uid: getState().user.id,
            name: localStorage.getItem('name'),
            profilePic: localStorage.getItem('profilePic')
          }
        })
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar o saldo')
      console.error('setBalanceOnDatabaseError', error)
    }
  },
  redeemGift: async () => {
    try {
      const balance = getState().wallet.balance
      if (balance >= 10) {
        toast.remove()
        toast.error(
          'Você precisa ter o saldo menor abaixo de 10 para resgatar o presente'
        )
        return
      }
      const newBalance = random(10, 300)
      await getState().setBalanceOnDatabase(newBalance)
      toast.success('Presente resgatado com sucesso')
      return
    } catch (error) {
      toast.error('Ocorreu um erro ao resgatar o presente')
      console.error('redeemGiftError', error)
    }
  },
  fundWallet: async (amount: number) => {
    try {
      const txId = await Pi.createPayment(
        {
          // Amount of π to be paid:
          amount: amount.toFixed(8),
          // An explanation of the payment - will be shown to the user:
          memo: 'Plinko wallet funding.', // e.g: "Digital kitten #1234",
          // An arbitrary developer-provided metadata object - for your own usage:
          metadata: {
            uid: getState().user.id
          } // e.g: { kittenId: 1234 }
        },
        {
          // Callbacks you need to implement - read more about those in the detailed docs linked below:
          onReadyForServerApproval,
          onReadyForServerCompletion: async (
            paymentId: string,
            txid: string
          ) => {
            try {
              console.log('onReadyForServerCompletion', paymentId, txid)
              const { data } = await axiosClient.post(
                '/payments/complete',
                { paymentId, txid },
                config
              )
              const paymentDto: PaymentDTO = data

              if (paymentDto.status.developer_completed != true) {
                throw 'Payment was not completed.'
              }

              console.log(
                `Payment recieved, adding ${paymentDto.amount} to balance.`
              )
              console.log('Current Balance', getState().wallet.balance)
              getState().incrementBalance(paymentDto.amount)
              console.log('New Balance', getState().wallet.balance)
              console.log('Payment processed. Thank you!')
            } catch (error) {
              console.log(`Add funds error: ${error}`)
            }
          },
          onCancel,
          onError
        }
      )
    } catch (error) {
      toast.error('A payment error occured.')
      console.error('Payment Error', error)
    }
  },
  incrementBalance: async (amount: number) => {
    try {
      setState(state => ({ ...state, isWalletLoading: true }))
      await getState().setBalanceOnDatabase(getState().wallet.balance + amount)
      setState(state => ({ ...state, isWalletLoading: false }))
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar o saldo')
      console.error('incrementBalanceError', error)
    }
  },
  decrementBalance: async (amount: number) => {
    try {
      setState(state => ({ ...state, isWalletLoading: true }))
      await getState().setBalanceOnDatabase(getState().wallet.balance - amount)
      setState(state => ({ ...state, isWalletLoading: false }))
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar o saldo')
      console.error('decrementBalanceError', error)
    }
  },
  signIn: async () => {
    try {
      setState(state => ({ ...state, isAuthLoading: true }))
      const scopes = ['payments', 'username', 'wallet_address']
      const authResult: AuthResult = await Pi.authenticate(
        scopes,
        onIncompletePaymentFound
      ).catch(function (error) {
        console.error(error)
      })
      axiosClient.post('/user/signin', { authResult }, config)
      if (authResult.user.uid && authResult.user.username) {
        const newUser = {
          uid: authResult.user.uid,
          id: authResult.user.uid,
          name: authResult.user.username,
          email: ''
        }
        storeUser(newUser)
        setState(
          produce<State>(state => {
            state.user = newUser
            state.isAuth = true
            state.isAuthLoading = false
          })
        )
      }
      setState(state => ({ ...state, isLoading: false }))
    } catch (error) {
      toast.error('An error occured during login')
      console.error('signInError', error)
    }
  },
  signOut: async () => {
    try {
      setState(state => ({ ...state, isAuthLoading: true }))
      await auth.signOut()
      clearUser()
      setState(
        produce<State>(state => {
          state.user = userInitialState
          state.isAuth = false
          state.isAuthLoading = false
        })
      )
    } catch (error) {
      toast.error('Ocorreu um erro ao fazer logout')
      console.error('signOutError', error)
    }
  },
  setUser: (user: User) => {
    try {
      setState(
        produce<State>(state => {
          state.user = user
          state.isAuth = true
          state.isAuthLoading = false
        })
      )
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar os dados do usuário')
      console.error('setUserError', error)
    }
  }
}))
