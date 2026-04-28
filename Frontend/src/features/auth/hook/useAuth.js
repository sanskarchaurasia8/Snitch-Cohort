import { setUser, setLoading } from "../state/auth.slice";
import { register, login, checkAuth } from "../service/auth.api";
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

    async function handleCheckAuth() {
        try {
            dispatch(setLoading(true));
            const data = await checkAuth();
            if (data && data.user) {
                dispatch(setUser(data.user));
            } else {
                dispatch(setUser(null));
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            dispatch(setUser(null));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { handleRegister, handleLogin, handleCheckAuth };
}
