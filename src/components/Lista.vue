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

  <div style="max-height: 300px; overflow-y: scroll; ">
    <div style="width: 100%;display: flex; align-items: center; justify-content: center;" >
      <h3 v-if="vazio">Nenhuma disciplina disponível</h3>
    </div>
    
    <div v-for="item in itensFiltered" :key="item.ID">
      
      <v-col cols="12">
        <v-card :color="item.COLOR" theme="dark">
          <v-card-title class="text-h6">
            {{ item.NOME }}
          </v-card-title>

          <v-card-subtitle>
            <div style="display: flex;">Horário: <p v-for="hora in item.HORARIO"> {{ hora }}/</p><br></div>
            <div style="display: flex;">
            Dias: <p v-for="dia in item.DIA"> {{ dia }}/</p>
            </div>
           
            Professores/Turma: {{ item.PROFESSORES }} - {{ item.TURMA }}
            <div style="display: flex;">
          
            </div>
          </v-card-subtitle>

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

export default {
  props: ['listaSelecionadas', 'horario', 'dia', 'btn_state_change'],
  emits: ["updateValue"],
  data() {
    return {
      picked: '',
      items: [],
      itensFiltered: [],
      allUnfilteredDisciplines: [],
      pesquisa: "",
      loading: false,
      vazio: false,
      btn_state:false,
      numeroDeMateriasNaoConflitantes: 0,
      base_address: "https://www.unifesp.br/campus/sjc/images/sjc/Secretaria_de_Gradua%C3%A7%C3%A3o/UCs_Vigentes/"
    };
  },
  mounted() {
    this.atualizarDados();

    (async() => {
      axios.post('https://montador-de-grades-api-upfpc35ezq-uc.a.run.app/disciplinas', {
          items: []
        }).then(response => 
        {
          this.allUnfilteredDisciplines = response.data;
          this.allUnfilteredDisciplines.forEach(x => x.COLOR = "#FF0000");
        }).catch(function (error) {
          console.log(error);
        });
    })();
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

        this.itensFiltered = this.items.filter(item => deburr(item.NOME).normalize('NFC').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(deburr(this.pesquisa).normalize('NFC').replace(/[\u0300-\u036f]/g, "").toLowerCase()))
        if(this.itensFiltered.length === 0){
            this.vazio = true
          }
          else{
            this.vazio = false
          }
      }, deep:true},
      
      btn_state_change: 
      {

        handler : function() 
        {
            this.itensFiltered = this.items.filter(function(v){return v.COLOR != "#FF0000"});
          }, deep:true
      }
  },  
  methods: {

    descricao(obj){
      let nome = obj.NOME;
      nome = nome.split('(')[0];
      nome = nome.trimRight()
      nome = nome.replace(/ /g, "_");
      
      window.open(this.base_address + nome[0] + "/" + nome, "_blank");
    },

    filtraMateria(item){
      if(this.horario === null && this.dia === null) {
        return true
      }

      if(this.itensFiltered.length === 0){
        this.vazio = true
      }
      else{
        this.vazio = false
      }
      return item.HORARIO.includes(this.horario) && item.DIA.includes(this.dia);
    },

    atualizarDados(){
      this.items = [];
      (async() =>{
        let ids = [];
        for(let i = 0; i < this.listaSelecionadas.length; i++){
          ids.push(this.listaSelecionadas[i].ID)
        }
        axios.post('https://montador-de-grades-api-upfpc35ezq-uc.a.run.app/disciplinas', {
          items: ids
        })
        .then(response => {
          this.items = response.data.filter(this.filtraMateria)

          this.items.forEach(x => {x.COLOR = "#385F73"});
          this.allUnfilteredDisciplines.forEach(x => {x.COLOR = "#385F73"});
          this.itensFiltered = this.items.filter(function(v){return v.COLOR != "#FF0000"});
          if(this.itensFiltered.length === 0){
            this.vazio = true
          }
          else{
            this.vazio = false
          }
          let exists = false;
          for(let i = 0; i < this.allUnfilteredDisciplines.length; i ++)
          {
            for(let j = 0; j < this.items.length; j ++)
            {
              if(this.allUnfilteredDisciplines[i].ID == this.items[j].ID) {exists = true; break;}
            }
            if(exists == false) {
                if(this.allUnfilteredDisciplines[i].COLOR != "#FF0000")
                {
                  this.allUnfilteredDisciplines[i].COLOR = "#FF0000";
                  this.itensFiltered.push(this.allUnfilteredDisciplines[i]);
                }
              }
            exists = false;
          }
        })

        .catch(function (error) {
          console.log(error);
        });
      })();

    },
    emitValue(item) {
      this.loading = true;
      this.$emit('updateValue', item);
      this.atualizarDados();
      setTimeout(()=>{this.loading = false;},500)

      
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