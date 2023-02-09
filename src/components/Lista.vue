<template>
  <input type="text" placeholder="Digite a disciplina desejada" v-model="pesquisa">
  <div v-for="item in itensFiltered" :key="item.ID">
    <div class="card" @click="emitValue(item)">
      <div>Nome: {{ item.NOME }}</div>
      <div>Horário: {{ item.HORARIO }} </div>
      <div>Professores/Turma: {{ item.PROFESSORES }} - {{ item.TURMA }}</div>
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
        axios.post('http://127.0.0.1:5000/disciplinas', {
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


</style>