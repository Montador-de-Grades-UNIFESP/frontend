// src/composables/useUserData.js
import { ref, watch } from 'vue';
import s from '/src/schemas/app.js';


const selectedUCs = ref(JSON.parse(localStorage.getItem('ListaIdsSelecionadas') || '[]'));
watch(selectedUCs, (value) => {
    localStorage.setItem('ListaIdsSelecionadas', JSON.stringify(value));
}, {deep: true});


export function useUserData() {
  const daysOfWeek = s.WeekDays.options;
  const hours = s.Hours.options;


  function addUC(uc) {
    selectedUCs.value.push(uc);
  }

  function removeUC(ucId) {
    selectedUCs.value = selectedUCs.value.filter(uc => uc.ID !== ucId);
  }

  function clearUCs() {
    selectedUCs.value = [];
  }

  return {
    daysOfWeek,
    hours,
    selectedUCs,
    addUC,
    removeUC,
    clearUCs,
  };
}

