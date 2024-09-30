<template>
  <div class="v-card shadow-md overflow-x-auto grid grid-rows-1 gap-2.5 w-auto">
    <!-- Table -->
    <table id="canvas" class="w-full border-collapse">
      <thead class="bg-[#ddd]">
        <tr>
          <th class="border-solid border-1 border-black">Horário</th>
          <th class="border-solid border-1 border-black" v-for="(weekDay) in daysOfWeek">{{ weekDay }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(hour, i) in s.Hours.options" :key="hour" class="even:bg-gray-100">
          <td class="whitespace-nowrap border-solid border-1 border-black">{{ hour }}</td>
          <td
            v-for="(day, i) in s.WeekDays.options" :key="day"
            @click="cellClicked(day, hour)"
            class="whitespace-nowrap border-1 border-solid border-[#302727] hover:cursor-pointer hover:bg-teal-100"
          >
            <div v-if="schedule[day][hour]" class="text-[100%] flex flex-col gap-y-1 w-full whitespace-pre-wrap border-collapse">
              <div>{{ schedule[day][hour].NOME }}</div>
              <div>{{ schedule[day][hour].TURMA }} - {{ schedule[day][hour].PROFESSORES }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Interaction Buttons -->
    <div class="flex flex-row w-full align-content-space-around justify-center whitespace-nowrap">
      <CustomButton class="border-red-700 px-4 mr-1 text-red-700" @click="clearUCs">
        Limpar grade
        <font-awesome-icon class="pl-1 text-base text-red-darken-2" icon="fa-solid fa-x" />
      </CustomButton>
      <CustomButton class="border-green-600 px-4 mr-1 text-green-600" @click="screenShot">
        Salvar como png
      </CustomButton>
      <CustomButton class="border-black px-4 mr-1" @click="save">
        Exportar
      </CustomButton>
      <CustomButton class="border-black px-4 mr-1" @click="load">
        Importar
      </CustomButton>
      <CustomButton class="border-purple-600 px-4 mr-1 text-purple-600" @click="$emit('show-ranking')">
        Ranking
      </CustomButton>
    </div>
  </div>
</template>

<script setup>
import { useUserData } from '../composables/useUserData';
import CustomButton from './ui/CustomButton.vue';
import html2canvas from 'html2canvas';
import s from '/src/schemas/app.js';
import { computed } from 'vue';

const { daysOfWeek, hours, clearUCs, removeUC, selectedUCs } = useUserData();

const schedule = computed(() => {
    const grid = Object.fromEntries(
        daysOfWeek.map((day) => [day, Object.fromEntries(hours.map((hour) => [hour, null]))])
    );
    console.log(grid);
    console.log(selectedUCs.value);
    selectedUCs.value.forEach((uc) => {
        console.log(uc)
        uc.DIA.forEach((dia, i) => {
            grid[dia][uc.HORARIO[i]] = uc;
        });
    });
    console.log(grid);
    return grid;
});

const emit = defineEmits(['cell-clicked']);

function cellClicked(day, hour) {
  const uc = schedule.value[day][hour];
  console.log(uc);
  if (uc === null) {
    // Open modal to add UC
    emit('cell-clicked', day, hour);
    return;
  }
  // Remove UC from schedule
  removeUC(uc.ID);
}

function screenShot() {
  const div = document.getElementById('canvas');
  window.devicePixelRatio = 2;
  html2canvas(div).then((canvas) => {
    const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    const currentDateTime = new Date().toLocaleString().replace(',', '');
    link.setAttribute('download', `UCS-ScreenShot ${currentDateTime}.png`);
    link.setAttribute('href', image);
    link.click();
    canvas.remove();
  });
}

function save() {
  const UCsSelecionadasToJson = JSON.stringify(selectedUCs.value);
  const link = document.createElement('a');
  const file = new Blob([UCsSelecionadasToJson], { type: 'text/json' });
  link.href = URL.createObjectURL(file);
  const currentDateTime = new Date().toLocaleString().replace(',', '');
  link.download = `SelectedUCS ${currentDateTime}.json`;
  link.click();
}

function load() {
  const inputFile = document.createElement('input');
  inputFile.setAttribute('type', 'file');
  inputFile.addEventListener(
    'change',
    (event) => {
      const reader = new FileReader();
      reader.readAsText(inputFile.files[0]);
      reader.onload = () => {
        selectedUCs.value = JSON.parse(reader.result);
      };
    },
    false
  );
  inputFile.click();
}
</script>
