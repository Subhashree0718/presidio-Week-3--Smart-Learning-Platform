import useAuth from './useAuth';
import { axiosPublic } from '../api/axios';
const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const refresh = async () => {
        const response = await axiosPublic.get('/users/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            return { ...prev, accessToken: response.data.accessToken, user: response.data.user }
        });
        return response.data.accessToken;
    }
    return refresh;
};
export default useRefreshToken;