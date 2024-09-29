<template>
    <button class="bg-sky-700 p-3 rounded-xl text-black font-semibold"
        @click="googleSignIn">
        Sign In with Google
    </button>
</template>

<script>
import CustomButton from './CustomButton.vue';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';


function googleSignIn() {
    const auth = getAuth();
    let provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
          //fetch data from here to see if the user is loged
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log(token) // Token
            console.log(user) // User that was authenticated
        })
        .catch((err) => {
            console.error(err); // This will give you all the information needed to further debug any errors
        });
}

export default {
    methods: {
        googleSignIn
    }
}
</script>