import { setError, setLoading, setUser } from "../state/auth.slice";
import { register, login } from "../service/auth.api";
import { useDispatch } from "react-redux";


export const useAuth = () => {

  const dispatch = useDispatch();

  async function handleRegister({ email, contact, fullname, password, isSeller = false }) {

    const data = await register({ email, contact, fullname, password, isSeller });

    dispatch(setUser(data.user));
  }

  async function handleLogin({ email, password }) {
    const data = await login({ email, password });
    dispatch(setUser(data.user));
  }

  return { handleRegister, handleLogin };
}
