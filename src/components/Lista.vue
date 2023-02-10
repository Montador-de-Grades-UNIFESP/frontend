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

  <div style="max-height: 390px;overflow-y: scroll;">
    <div v-for="item in itensFiltered" :key="item.ID" >
      
      <v-col cols="12">
        <v-card color="#385F73" theme="dark">
          <v-card-title class="text-h6">
            {{ item.NOME }}
          </v-card-title>

          <v-card-subtitle>
            <div style="display: flex;">Horário: <p v-for="hora in item.HORARIO"> {{ hora }}/</p><br></div>
            <div style="display: flex;">
            Dias: <p v-for="dia in item.DIA"> {{ dia }}/</p>
            </div>
            Professores/Turma: {{ item.PROFESSORES }} - {{ item.TURMA }}
          </v-card-subtitle>

          <v-card-actions>
            <v-btn variant="outlined"  @click="emitValue(item)">
              Adicionar
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

export default {
  props: ['listaSelecionadas', 'horario', 'dia'],
  emits: ["updateValue"],
  data() {
    return {
      picked: '',
      items: [],
      itensFiltered: [],
      pesquisa: "",
    };
  },
  mounted() {
    this.atualizarDados()
  }, 
  watch:{
    listaSelecionadas: {
      handler: function () {
        this.atualizarDados()
      }, deep:true},
    pesquisa: {
      handler: function () {
        if(this.pesquisa === ""){
          this.itensFiltered = this.items
        }
        this
        this.itensFiltered = this.items.filter(item => item.NOME.normalize('NFC').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(this.pesquisa.normalize('NFC').replace(/[\u0300-\u036f]/g, "").toLowerCase()))
      }, deep:true}
  },  
  methods: {

    filtraMateria(item){
      if(this.horario === null && this.dia === null) {
        return true
      }
      
      return item.HORARIO.includes(this.horario) && item.DIA.includes(this.dia)
    },

    atualizarDados(){

      (async() =>{
        let ids = [];
        for(let i = 0; i < this.listaSelecionadas.length; i++){
          ids.push(this.listaSelecionadas[i].ID)
        }
        axios.post('https://montador-de-grades-api-xovxunskpq-rj.a.run.app/disciplinas', {
          items: ids
        })
        .then(response => {
          this.items = response.data.filter(this.filtraMateria)
          this.itensFiltered = this.items
        })
        .catch(function (error) {
          console.log(error);
        });
      })();

    },
    emitValue(item) {
      this.$emit('updateValue', item);
      this.atualizarDados();
    }
    
  }
};
</script>

<style>

.card {
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  border: 1px solid black;
}

.card:hover{
  cursor: pointer;
}

.itens{
    display: flex;
    flex-direction: column;
    max-height: 500px;
    overflow-y: scroll;
}

.menu{
  display: flex;
  flex-direction: column;
}

.modal-body{
  overflow: hidden;
}

</style>