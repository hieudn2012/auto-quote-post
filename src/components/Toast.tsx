import { toast } from "react-toastify"

// eslint-disable-next-line react-refresh/only-export-components
const CustomToast = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center gap-2 font-sans mr-10">
      <span>{message}</span>
    </div>
  )
}


export const toastSuccess = (message: string) => {
  toast(<CustomToast message={message} />, {
    type: 'success',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    closeButton: false,
    position: 'bottom-right',
  })
}

export const toastError = (message: string) => {
  toast(<CustomToast message={message} />, {
    type: 'error',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    closeButton: false,
    position: 'top-center',
  })
}