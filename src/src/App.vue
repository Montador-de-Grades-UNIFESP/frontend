<!-- src/App.vue -->
<template>
  <div class="font-sans p-4 w-full lg:max-w-[90%] mx-auto">
    <div class="-m-3 flex flex-auto flex-wrap">
      <div class="lg:flex-0666 lg:max-w-[66%] w-full p-3 flex-0100 max-w-full">
        <Timetable @cell-clicked="openCellModal" @show-ranking="showRanking = true" />
      </div>
      <div class="lg:flex-0333 lg:max-w-[33%] p-3 flex-0100 w-full" v-if="!showRanking">
        <UCsSidebar />
      </div>
    </div>
    <div class="mt-3 -m-3 flex flex-auto flex-wrap flex-column align-center justify-center" v-if="!showRanking">
      <FooterAlert />
    </div>
    <CellModal v-if="showCellModal" @close="showCellModal = false" :title="cellModalTitle" :day="selectedDay" :hour="selectedHour" />
    <RankingModal v-if="showRanking" @close="showRanking = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Timetable from './components/Timetable.vue';
import UCsSidebar from './components/UCsSidebar.vue';
import FooterAlert from './components/FooterAlert.vue';
import CellModal from './components/CellModal.vue';
import RankingModal from './components/RankingModal.vue';
import { useUserData } from './composables/useUserData';
import useFirebase from './composables/useFirebase';

useFirebase().init();

const showRanking = ref(false);
const showCellModal = ref(false);
const cellModalTitle = ref('');
const selectedDay = ref('');
const selectedHour = ref('');

const { daysOfWeek, hours } = useUserData();

function openCellModal(day, hour) {
  console.log('event received', day, hour);
  selectedDay.value = day;
  selectedHour.value = hour;
  cellModalTitle.value = `Disciplinas disponíveis para ${day} ${hour}`;
  showCellModal.value = true;
}
</script>

<style>
@import 'style.css';
</style>
