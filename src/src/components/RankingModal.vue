<!-- src/components/RankingModal.vue -->
<template>
    <CardModal @close="$emit('close')">

        <div v-if="logged">
            <div class="card-content min-h-screen flex-grow p-4 sm:p-6 md:p-8">
                <div class="card w-full max-w-2xl mx-auto bg-white rounded-lg">
                    <div class="card-header mb-4">
                        <h2 class="text-2xl font-bold">Preencha para estimar sua posição nas matérias escolhidas</h2>
                    </div>
                    <form v-if="!rankingResult" @submit.prevent="consultRanking" class="space-y-6">
                        <!-- RA and CR Fields -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label for="ra">RA: </label><span class="text-red-500">*</span>
                                <input v-model="ra" id="ra" type="text" placeholder="Seu RA" class="input w-full border border-gray-300 rounded px-2 py-1"/>
                            </div>
                            <div class="space-y-2">
                                <label for="cr">CR: </label><span class="text-red-500">*</span>
                                <input v-model="cr" id="cr" type="text" placeholder="Seu CR" class="input w-full border border-gray-300 rounded px-2 py-1"/>
                            </div>
                        </div>

                        <!-- Course and Term Select -->
                        <div class="space-y-2">
                            <label class="font-semibold">Selecione seu curso e o termo:</label><span class="text-red-500">*</span>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <select v-model="curso" class="input w-full border border-gray-300 rounded px-3 py-2">
                                    <option disabled value="">Curso</option>
                                    <option v-for="curso in cursos" :key="curso">{{ curso }}</option>
                                </select>
                                <select v-model="selectedTermo" class="input w-full border border-gray-300 rounded px-3 py-2">
                                    <option disabled value="">Termo</option>
                                    <option v-for="n in 11" :key="n">{{ n + 1 }}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Subjects Selection -->
                        <div class="space-y-2">
                            <label class="font-semibold">Você já reprovou por frequência em alguma dessas matérias?</label>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                <div v-for="subject in ListaIdsSelecionadas" :key="subject.id" class="flex items-center space-x-2">
                                    <input type="checkbox" :id="subject.id" v-model="checkedNames" :value="subject.label" class="checkbox"/>
                                    <label :for="subject.id">{{ subject.NOME }}</label>
                                </div>
                            </div>
                        </div>

                        <!-- Agreement Checkbox -->
                        <div class="flex items-center space-x-2">
                            <input type="checkbox" id="agree" v-model="agree" value="AGREE" required class="checkbox"/>
                            <label for="agree">
                                Concordo com o uso dos dados acima para calcular meu ranking. <span class="text-red-500">*</span>
                            </label>
                        </div>

                        <!-- Submit Button -->
                        <button @click="consultRanking1" type="submit" class="btn w-full bg-green-600 text-white py-2 hover:bg-green-700 transition duration-300">
                            Consultar posição
                        </button>
                    </form>

                    <!-- Results Section -->
                    <div v-if="rankingResult" class="space-y-6">
                        <h2 class="font-semibold">Seu ranking é:</h2>
                        <p v-html="rankingResult"></p>
                        <button @click="resetForm" class="btn w-full bg-blue-600 text-white py-2 hover:bg-blue-700 transition duration-300">
                            Consultar novamente
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <p class="font-bold text-center mb-4">BEM-VINDO!</p>
            <p class="font-bold text-gray-500 text-center mb-4">Para continuar você precisa fazer login!</p>
            <div class="flex justify-center">
                <GoogleLoginButton class="bg-white text-black font-semibold py-2 px-4 rounded shadow-md hover:bg-blue-600 transition duration-200 ease-in-out" />

            </div>
        </div>
    </CardModal>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import CardModal from './ui/CardModal.vue';
import GoogleLoginButton from './GoogleLoginButton.vue';
import { useUserData } from '../composables/useUserData';
import s from '/src/schemas/app.js';
import useAuth from '/src/composables/useAuth'
import useAPI from '/src/composables/useAPI'

const emit = defineEmits([ 'show-ranking' ]);

const { selectedUCs } = useUserData();

const logged = useAuth().authenticated
const ra = ref('');
const cr = ref('');
const curso = ref('');
const selectedTermo = ref('');
const agree = ref(false);
const rankingResult = ref(null);
const cursos = s.Curso.options
const checkedNames = ref([]);

function consultRanking() {
    // Validate inputs
    if (!ra.value || !cr.value || !curso.value || !selectedTermo.value || !agree.value) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
}

function resetForm() {
    ra.value = '';
    cr.value = '';
    curso.value = '';
    selectedTermo.value = '';
    agree.value = false;
    rankingResult.value = null;
    checkedNames.value = [];
}

</script>
