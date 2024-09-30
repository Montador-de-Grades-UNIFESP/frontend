<!-- src/components/UCsSidebar.vue -->
<template>
  <div class="v-card p-2 shadow-lg">
    <div class="p-4 w-full mx-auto lg:max-w-4xl xl:max-w-7xl flex sm:block flex-col">
      <!-- Selected UCs -->
      <div class="-m-3 flex flex-auto flex-wrap bg-white mb-10 sm:-m-3 order-2">
        <div class="grow basis-0 w-full p-3">
          <h3 class="font-bold block text-xl m-0">Disciplinas Escolhidas:</h3>
                    Total de Créditos: {{ selectedUCs.reduce((acc, uc) => acc + uc.HORARIO.length * 2, 0) }}
          <div class="v-card shadow-lg p-2 bg-white overflow-y-scroll h-[300px] rounded">
            <div class="v-card mx-auto mb-2" v-for="(value) in selectedUCs" :key="value.ID">
              <div class="border-1 border-black rounded">
                <div class="px-4 py-3">
                  <div class="text-xs text-overline mb-1 tracking-widest2x uppercase">
                    Turma - {{ value.TURMA }}
                  </div>
                  <div class="normal-case font-sans text-xl font-medium leading-8 mb-1">
                    {{ value.NOME }}
                  </div>
                  <div class="text-2xs font-normal leading-5 tracking-wide font-sans normal-case">
                    Professor(a): {{ value.PROFESSORES }}
                  </div>
                </div>
                <div class="min-h-[52px] flex flex-none items-center p-2">
                  <CustomButton class="border-black p-2" @click="removeUC(value.ID)">
                    Excluir
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Available UCs -->
      <div class="-mx-3 -mb-3 mt-3 flex flex-auto flex-wrap bg-white mb-10">
        <div class="grow basis-0 w-full p-3 flex flex-col justify-center gap-y-1.5">
          <h3 class="block text-xl font-bold">Disciplinas Disponíveis:</h3>
          <div>
            <ListaUC :btn_state_change="btn_state" :horario="null" :dia="null" :listaSelecionadas="selectedUCs" @updateValue="addUC" />
          </div>
          <CustomButton v-show="false" class="mt-2 py-2 px-12 border-black uppercase w-full h-auto" @click="change_btn_state_conflict">
            <span class="text-wrap">Remover Disciplinas Indisponíveis</span>
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserData } from '../composables/useUserData';
import CustomButton from './ui/CustomButton.vue';
import ListaUC from './ui/ListaUC.vue';

const { selectedUCs, quantidade, removeUC, addUC } = useUserData();
const btn_state = ref(false);

function change_btn_state_conflict() {
  btn_state.value = !btn_state.value;
}
</script>
