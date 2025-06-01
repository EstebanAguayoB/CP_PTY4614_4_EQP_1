import { toast } from 'react-toastify'

export const notifySuccess = (msg) =>
  toast.success(msg, {
    position: 'top-right',
    autoClose: 3000,
    theme: 'colored',
  })

export const notifyError = (msg) =>
  toast.error(msg, {
    position: 'top-right',
    autoClose: 5000,
    theme: 'colored',
  })

export const notifyInfo = (msg) =>
  toast.info(msg, {
    position: 'top-right',
    autoClose: 4000,
    theme: 'colored',
  })
