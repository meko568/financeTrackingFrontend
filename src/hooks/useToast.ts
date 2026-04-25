import { useToastContext } from '../components/ui/ToastProvider'

const useToast = () => {
  const { pushToast } = useToastContext()
  return pushToast
}

export default useToast
