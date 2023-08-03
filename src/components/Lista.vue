<template>
  <div>
    <v-card-text>
      <v-text-field
        density="compact"
        variant="solo"
        label="Pesquise a disciplina desejada..."
        append-inner-icon="mdi-checkbox-marked-circle"
        single-line
        hide-details 
        v-model="pesquisa"
      ></v-text-field>
    </v-card-text>

  <div style="max-height: 300px;" class="overflow-auto">
    <div class="w-100 d-flex align-center justify-center">
      <h3 v-if="vazio">Nenhuma disciplina disponível</h3>
    </div>
    
    <div v-for="item in itensFiltered" :key="item.ID">
      
      <v-col cols="12">
        <v-card :color="item.COLOR" theme="dark">
          <v-card-title class="text-h6">
            {{ item.NOME }}
          </v-card-title>

          <v-card-text>
            <div class="d-flex">
              <span class="text-white lista-horario">{{ formata_horario(item) }}</span>
            </div>
          
            Professores/Turma: {{ item.PROFESSORES }} - {{ item.TURMA }}
            <div class="d-flex">
          
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn variant="outlined" v-if="item.COLOR != '#FF0000'" @click="emitValue(item)" :disabled="loading">

              Adicionar
            </v-btn>
            <v-btn variant="outlined" v-if="item.COLOR != '#FF0000'" @click="descricao(item)" :disabled="loading">

              Descrição
            </v-btn>
          </v-card-actions>
     
        </v-card>
      </v-col>
    </div>    
  </div>     
</div> 
</template>

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
    const fetchDisciplinas = async () => {
      try {
        const { data } = await axios.post('https://montador-de-grades-api-upfpc35ezq-rj.a.run.app/disciplinas', {
          items: []
        });
        this.allUnfilteredDisciplines = data;
        this.allUnfilteredDisciplines.forEach(x => x.COLOR = "#FF0000");
      } catch (error) {
        console.log(error);
      }
    };

    fetchDisciplinas();

    this.atualizarDados();
  }, 
  watch:{
    listaSelecionadas: {
      handler: function () {
        this.atualizarDados()
      }, 
      deep: true
    },
    search: {
      handler: function () {
        if(this.search === ""){
          this.itensFiltered = this.items
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
      deep:true
    },
    btn_state_change: {
      handler : function () {
        this.itensFiltered = this.items.filter(v => v.COLOR !== "#FF0000");
      }, 
      deep:true
    }
  },  
  methods: {
    descricao(obj){
      // retira todos os textos entre parênteses ou colchetes e substitui os espaços por underline
      const nome = obj.NOME.replace(/\s*\([^)]*\)/g, '').replace(/ /g, '_');
      window.open(this.base_address + nome, "_blank");
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

    async atualizarDados(){
      const ids = this.listaSelecionadas.map(item => item.ID);

      try {
        const response = await axios.post('https://montador-de-grades-api-upfpc35ezq-rj.a.run.app/disciplinas', {
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
    emitValue(item) {
      this.loading = true;
      this.$emit('updateValue', item);
      this.atualizarDados()
        .finally(() => {
          this.loading = false;
        });
    },
    formata_horario(item) {
      return item.DIA.map((dia, index) => `${dia} - ${item.HORARIO[index]}`).join('\r\n');
    }
    
  }
};

</script>