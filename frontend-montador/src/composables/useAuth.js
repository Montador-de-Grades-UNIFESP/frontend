import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import useAPI from "./useAPI";
import { ref } from "vue";

const authenticated = ref(false);
const userId = ref(null); // Nova variável reativa para armazenar o user_id

async function signInWithGoogle() {
   const auth = getAuth();
   let provider = new GoogleAuthProvider();

   try {
      const result = await signInWithPopup(auth, provider);
      const response = await useAPI().post("/auth/sessao", {
         id_token: result.user.accessToken,
      });

      authenticated.value = true;
      userId.value = result.user.uid; // Armazena o user_id retornado pelo Firebase

      localStorage.setItem("authenticated", true);
      localStorage.setItem("userId", userId.value); // Armazena o user_id no localStorage
      return;
   } catch (err) {
      console.error(err);
      authenticated.value = false;
      userId.value = null;
      localStorage.setItem("authenticated", false);
      localStorage.removeItem("userId"); // Remove o user_id do localStorage em caso de erro
   }
}

export default function useAuth() {
   if (localStorage.getItem("authenticated")) {
      authenticated.value = true;
      userId.value = localStorage.getItem("userId"); // Carrega o user_id armazenado do localStorage
   }

   return {
      signInWithGoogle,
      authenticated,
      userId, // Retorna o user_id null para outros componentes
   };
}
