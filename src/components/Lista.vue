<template>
  <div v-for="item in items" :key="item.ID">
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
    };
  },
  mounted() {
    this.atualizarDados()
  }, 
  watch:{
    listaSelecionadas: {
        handler: function () {
            this.atualizarDados()
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
        console.log(ids)
        axios.post('http://127.0.0.1:5000/disciplinas', {
          items: ids
        })
        .then(response => {
          this.items = response.data.filter(this.filtraMateria)
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