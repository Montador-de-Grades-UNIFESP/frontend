<template>
  <div class="normal-case px-4 pb-4 flex-auto text-xs font-normal tracking-wide">
    <TextInput
        density="compact"
        placeholder="Pesquise a disciplina desejada..."
        append-inner-icon="mdi-checkbox-marked-circle"
        @search="search = $event"
      ></TextInput>
  </div>
  <div class="overflow-auto max-h-[300px]">
    <div class="w-full flex align-center justify-center">
      <h3 v-if="vazio" class="block text-xl font-bold">Nenhuma disciplina disponível</h3>
    </div>

    <div v-for="item in itensFiltered" :key="item.ID">
      <div class="grow basis-0 w-full p-3 flex-0100 max-w-full">
        <div class="bg-cardbackground rounded text-white shadow-md">
            <div class="v-card-title h6">
              {{ item.NOME }}
            </div>
            <div class="normal-case flex-auto text-xs font-normal tracking-wide px-4 pb-4 pt-0">
              <span class="text-white font-mono whitespace-pre-wrap text-base lista-horario">{{ formata_horario(item) }}</span><br>
              <span>Professores/Turma: {{ item.PROFESSORES }} - {{ item.TURMA }}</span>
            </div>
  
            <div class="px-2 py-2 tracking-widerx flex">
              <CustomButton class="px-2 h-9 mr-2 border-solid border-1 border-white rounded uppercase font-medium" v-if="item.COLOR != '#FF0000'" @click="emitValue(item)" :disabled="loading">
                Adicionar
              </CustomButton>
              <CustomButton class="px-2 h-9 border-1 border-white rounded uppercase" v-if="item.COLOR != '#FF0000'" @click="descricao(item)" :disabled="loading">
                Descrição
              </CustomButton>
            </div>
        </div>
      </div>
    </div>    
  </div>     
 
</template>

<style>

.v-card-title {
  display: block;
  flex: none;
  font-size: 1.25rem;
  font-weight: 500;
  -webkit-hyphens: auto;
  hyphens: auto;
  letter-spacing: .0125em;
  min-width: 0;
  overflow-wrap: normal;
  overflow: hidden;
  padding: 0.5rem 1rem;
  text-overflow: ellipsis;
  text-transform: none;
  white-space: nowrap;
  word-break: normal;
  word-wrap: break-word;
}
</style>

<script>
import axios from 'axios';
import deburr from 'lodash/deburr'
import TextInput from './TextInput.vue';
import CustomButton from './CustomButton.vue';

export default {
  components: {
    TextInput,
    CustomButton,
  },
  props: ['listaSelecionadas', 'horario', 'dia', 'btn_state_change'],
  emits: ["updateValue"],
  data() {
    return {
      picked: '',
      items: [],
      itensFiltered: [],
      allUnfilteredDisciplines: [],
      search: "",
      loading: false,
      vazio: false,
      btn_state:false,
      numeroDeMateriasNaoConflitantes: 0,
      base_address: "https://www.unifesp.br/campus/sjc/images/sjc/Secretaria_de_Gradua%C3%A7%C3%A3o/UCs_Vigentes/"
    };
  },
  mounted() {
    this.fetchDisciplinas();
    this.atualizarDados();
  }, 
  watch:{
    listaSelecionadas: {
      handler: 'atualizarDados',
      deep: true,
    },
    search: {
      handler: 'filtrarItens',
      deep: true,
    },
    btn_state_change: {
      handler: 'filtrarItens',
      deep: true,
    },
  },  
  methods: {
    async fetchDisciplinas() {
      try {
        const { data } = await axios.get('/disciplinas.json', {
          items: []
        });
        this.allUnfilteredDisciplines = data.map(item => ({ ...item, COLOR: '#FF0000' }));
      } catch (error) {
        console.log(error);
      }
    },
    async atualizarDados(){
      const ids = this.listaSelecionadas.map(item => item.ID);

      try {
        const response = await axios.get('/disciplinas.json', {
          items: ids
        });
        const items = response.data.filter(this.filtraMateria);
        items.forEach(item_2 => item_2.COLOR = '#385F73');
        this.allUnfilteredDisciplines.forEach(item_3 => item_3.COLOR = '#385F73');

        const itensFiltered = items.filter(item_4 => item_4.COLOR !== '#FF0000');
        this.itensFiltered = itensFiltered;
        this.vazio = itensFiltered.length === 0;

        this.allUnfilteredDisciplines.forEach(item_5 => {
          // test if at least one of the items is in the list and the color is not red
          if (!items.some(item_6 => item_6.ID === item_6.ID) && item_5.COLOR !== '#FF0000') {
            item_5.COLOR = '#FF0000';
            this.itensFiltered.push(item_5);
          }
        });
        this.items = items;
        return response;

      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    filtrarItens() {
      if (this.search === '') {
        this.itensFiltered = this.items;
      }

      const query = this.search.toLowerCase();
      const regex = /[\u0300-\u036f]/g;
      const normalizedQuery = query.normalize('NFD').replace(regex, '');

      this.itensFiltered = this.items.filter(item => {
        const normalizedItemName = item.NOME.normalize('NFD').replace(regex, '');
        return deburr(normalizedItemName).toLowerCase().includes(deburr(normalizedQuery));
      });

      this.vazio = this.itensFiltered.length === 0;
    },
    descricao(obj){
      // retira todos os textos entre parênteses ou colchetes e substitui os espaços por underline
      const nome = obj.NOME.replace(/\s*\([^)]*\)/g, '').replace(/ /g, '_');
      window.open(this.base_address + nome[0] + "/" + nome + ".pdf", "_blank");
    },
    filtraMateria(item){
      if(this.horario === null && this.dia === null) {
        return true
      }

      this.vazio = this.itensFiltered.length === 0;

      const hasHorario = this.horario ? item.HORARIO.includes(this.horario) : true;
      const hasDia = this.dia ? item.DIA.includes(this.dia) : true;

      return hasHorario && hasDia;
    },
    emitValue(item) {
      this.loading = true;
      this.$emit('updateValue', item);
      this.atualizarDados().finally(() => {
        this.loading = false;
      });
    },
    formata_horario(item) {
      return item.DIA.map((dia, index) => `${dia} - ${item.HORARIO[index]}`).join('\r\n');
    }
  },
  computed: {
    listaSelecionadasIds() {
      return this.listaSelecionadas.map(item => item.ID);
    },
  },
};

</script>
