<template>
    <button class="bg-sky-700 p-3 rounded-xl text-black font-semibold"
        @click="signIn">
        Sign In with Google
    </button>
</template>

<script>
import CustomButton from './ui/CustomButton.vue';
import useAuth from '/src/composables/useAuth';

export default {
    methods: {
        signIn () {
            const { signInWithGoogle } = useAuth();
            signInWithGoogle();
        }
    }
}
</script>
