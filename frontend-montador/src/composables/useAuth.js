import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import useAPI from './useAPI';
import { ref } from 'vue';

const authenticated = ref(false);

async function signInWithGoogle() {
    const auth = getAuth();
    let provider = new GoogleAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
        const response = await useAPI().post('/auth/sessao', { id_token: result.user.accessToken });
        if (response.ok) {
            authenticated.value = true;
            localStorage.setItem('authenticated', true);
            return;
        }
    } catch (err) {
        console.error(err);
        authenticated.value = false;
        localStorage.setItem('authenticated', false);
    }
}

export default function useAuth() {
    if (localStorage.getItem('authenticated')) {
        authenticated.value = true;
    }
    
    return {
        signInWithGoogle,
        authenticated
    }
}
