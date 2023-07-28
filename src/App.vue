<template>

<v-container class="grey lighten-5">
    <v-row>
      <v-col cols="12" md="8" >
        <v-card
          class="tabela-card"
          outlined
          tile
        > 
      <table id="canvas" class="w-100">
        <thead>
          <tr>
            <th>Horário</th>
            <th v-for="(value) in daysOfWeek">{{ value }}</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(row, rowIndex) in tabela">
              <td>{{ hours[rowIndex] }}</td>
              <td v-for="(value, colIndex) in row" @click="showAlert(rowIndex, colIndex)" class = "cell" >
                <div class="item">
                  <div>
                  {{ value.NOME }}
                  </div>  
                  <div>{{ value.TURMA }} - {{ value.PROFESSORES }} </div>
                </div>
              </td>
            </tr>
        </tbody>
      </table>
      <div class="d-flex flex-row w-100 align-content-space-around justify-center" style="row-gap: 10px;">
        <v-btn
          variant="outlined"
          color="error"
          class="mr-1"
          @click="cleanAll()"> Limpar grade<font-awesome-icon class="pl-1 text-base text-red-darken-2" icon="fa-solid fa-x" />
        </v-btn>
        <v-btn
          variant="outlined"
          color="success"
          class="mr-1"
          @click="screenShot()"> Salvar como png
        </v-btn>
        
        <v-btn
          variant="outlined"
          color="default"
          class="mr-1"
          @click="save"> Exportar
        </v-btn> 

        <v-btn
          variant="outlined"
          color="default"
          class="mr-1"
          @click="load"> Importar
        </v-btn> 
        
      </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card
          class="pa-2"
          outlined
          tile
        >
        <v-container class="ordem">
          <v-row class="flex-item" style="order: 2;" >
            <v-col>
              <h3> Disciplinas Escolhidas: </h3> 
               Total de Créditos: {{ quantidade*2 }}
              <v-card class="pa-2 escolhidas">
                <v-card class="mx-auto mb-2" variant="outlined" v-for="(value) in ListaIdsSelecionadas">
                  <v-card-item>
                    <div>
                      <div class="text-overline mb-1">
                        Turma - {{ value.TURMA }}
                      </div>
                      <div class="text-h6 mb-1">
                        {{value.NOME}}
                      </div>
                      <div class="text-caption">Professor(a): {{ value.PROFESSORES }}</div>
                    </div>
                  </v-card-item>
                  <v-card-actions>
                    <v-btn variant="outlined" @click="removeUC(value)">
                      Excluir
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-card>
            </v-col>
          </v-row>
          <v-row  class="flex-item">
            <v-col class="d-flex flex-column justify-center" style="row-gap: 5px;">
               <h3>Disciplinas Disponíveis:</h3>
                <div>
                  <ListaUC :btn_state_change = "btn_state" :horario="null" :dia="null" :listaSelecionadas="ListaIdsSelecionadas"  @updateValue="updateValue"></ListaUC>
                </div>
                <v-btn 
                height="auto"
                variant="outlined"
                color="default"
                class="btn-conflicts"
                @click="change_btn_state_conflict()"><span class="text-wrap py-2">Remover Disciplinas Indisponíveis</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        </v-card>
        
      </v-col>
    </v-row>
    <v-row class="d-flex flex-column align-center justify-center">
      <v-alert
        v-model="alert"
        border="start"
        variant="tonal"
        title="Problemas?"
        close-label="Close Alert"
        color="deep-purple-accent-4"
      >
      Faça um pull request em<a href="https://github.com/vpedrota/montador-de-grades"><font-awesome-icon class="mx-1 alert-icon text-grey-darken-4" icon="fa-brands fa-github"/></a>ou mande uma mensagem para <strong>montadordegrades@gmail.com</strong>.
      </v-alert>
    </v-row>
   
  </v-container>

<Modal v-if="showModal" @close="showModal = false" :title="modalTitle">
    <ListaUC :horario="hours[this.row]" :dia="daysOfWeek[this.col]" :listaSelecionadas="ListaIdsSelecionadas" @updateValue="updateValue"></ListaUC>
</Modal>
</template>

<script>

var FileData; 
var ListId;
var thisObjAlias;

import ModalButton from './components/ModalButton.vue';
import Modal from '@/components/Modal.vue';
import ListaUC from './components/Lista.vue';
import html2canvas from 'html2canvas';

export default {
  components: {
    ModalButton,
    Modal,
    ListaUC
  },
  name: 'App',
  data() {
    var tabela = [];

    for (let i = 0; i < 6; i++) {
      tabela[i] = Array(6).fill('');
    }

    return {
      alert: true,
      daysOfWeek: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      hours: ['08h00-10h00', '10h00-12h00', '13h30-15h30', '15h30-17h30', '19h00-21h00', '21h00-23h00'],
      modalTitle: 'Título do Modal',
      showModal: false, 
      tabela: tabela,
      col: 0,
      row: 0,
      quantidade: 0,
      btn_state:false,
      // O controle das disciplinas será através dos ids das disciplinas
      ListaIdsSelecionadas: []
    }
  },
  mounted(){
    this.quantidade = 0
    if (localStorage.ListaIdsSelecionadas) { 
      this.ListaIdsSelecionadas = JSON.parse(localStorage.ListaIdsSelecionadas)
      this.ListaIdsSelecionadas.forEach(value => {
        this.updateTable(value,value);
        this.quantidade += value.HORARIO.length
      })
    }
  
  },
  methods: {
    showAlert(rowIndex, colIndex) {

      const cellValue = this.tabela[rowIndex][colIndex];

      if (cellValue === '') {
        this.row = rowIndex;
        this.col = colIndex;
        this.modalTitle = `Disciplinas diponíveis para ${this.daysOfWeek[colIndex]} ${this.hours[rowIndex]}`;
        this.showModal = true;
        return;
      }

      // Removendo matéria
      const selectedSubject = this.ListaIdsSelecionadas.find(item => item.ID === cellValue.ID);
      const selectedSubjectIndex = this.ListaIdsSelecionadas.indexOf(selectedSubject);
      const selectedSubjectHours = selectedSubject.HORARIO.length;
      
      this.quantidade -= selectedSubjectHours;
      this.ListaIdsSelecionadas.splice(selectedSubjectIndex, 1);
      localStorage.ListaIdsSelecionadas = JSON.stringify(this.ListaIdsSelecionadas);
      
      for (let i = 0; i < cellValue.DIA.length; i++) {
        const dayIndex = this.daysOfWeek.indexOf(cellValue.DIA[i]);
        const hourIndex = this.hours.indexOf(cellValue.HORARIO[i]);
        this.tabela[hourIndex][dayIndex] = '';
      }
      
      this.tabela[rowIndex][colIndex] = '';

      return;
    }, 
    updateTable(obj, valor){
      for(let i = 0; i < obj.DIA.length; i++){
        let dia = this.daysOfWeek.indexOf(obj.DIA[i])
        let horario = this.hours.indexOf(obj.HORARIO[i])
        this.tabela[horario][dia] = valor
      }
    }, 
    updateValue(value){
      
      this.updateTable(value, value);

      this.ListaIdsSelecionadas.push(value)
      localStorage.ListaIdsSelecionadas = JSON.stringify(this.ListaIdsSelecionadas)
  
      this.showModal = false
      this.quantidade += value.HORARIO.length
    },
    
    cleanAll(){
      this.ListaIdsSelecionadas = []
      localStorage.ListaIdsSelecionadas = JSON.stringify(this.ListaIdsSelecionadas)
      for(let i = 0; i < 6; i++){
        for(let j = 0; j < 6; j++){
          this.tabela[i][j] = ''
        }
      }
      this.quantidade = 0
    },
    removeUC(obj){
      this.ListaIdsSelecionadas = this.ListaIdsSelecionadas.filter(item => item.ID !== obj.ID)
      localStorage.ListaIdsSelecionadas = JSON.stringify(this.ListaIdsSelecionadas)
      this.updateTable(obj, '')
      this.quantidade -= obj.HORARIO.length
    },
    save() {

      const UcsSelecionadasToJson = JSON.stringify(this.ListaIdsSelecionadas)
      const aux = document.createElement("a");
      const file = new Blob([UcsSelecionadasToJson], {type: 'text/json'});
      aux.href = URL.createObjectURL(file);
      const currentDateTime = new Date().toLocaleString().replace(',', '');
      aux.download = `SelectedUCS ${currentDateTime}.json`;
      aux.click();
  
    },
    load() {
      var inputFileDocument = document.createElement("input");
      inputFileDocument.setAttribute("type", "file");
      inputFileDocument.setAttribute("id", "upload");
      inputFileDocument.addEventListener("change",  (event) => {
        ListId = this.ListaIdsSelecionadas;
        thisObjAlias = this;  
        var reader = new FileReader();
        reader.readAsText(inputFileDocument.files[0])
        reader.onload = () => {
          FileData = reader.result;
          loadtoTableAfterParse();
        }
      }, false);
      inputFileDocument.click();
    },
    screenShot() {
      let div = document.getElementById('canvas');
      console.log(div)
      // Use the html2canvas to take a screenshot at 2x device pixel ratio
      // and append it to the output div
      window.devicePixelRatio = 2;
      html2canvas(div).then((canvas) => {
          const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
          const aux = document.createElement('a')
          const currentDateTime = new Date().toLocaleString().replace(',', '');
          aux.setAttribute('download', `UCS-ScreenShot ${currentDateTime}.png`);
          aux.setAttribute('href', image)
          aux.click()
          canvas.remove()
        })
    },
    change_btn_state_conflict()
    {
      this.btn_state = !this.btn_state;
    }
  
  }
}


function loadtoTableAfterParse()
{
  ListId = JSON.parse(FileData);
  thisObjAlias.ListaIdsSelecionadas = [];
  localStorage.ListaIdsSelecionadas = thisObjAlias.ListaIdsSelecionadas
  ListId.forEach(value => 
  {
    thisObjAlias.updateTable(value,value);
    thisObjAlias.ListaIdsSelecionadas.push(value);
    localStorage.ListaIdsSelecionadas = thisObjAlias.ListaIdsSelecionadas
    thisObjAlias.quantidade +=  value.HORARIO.length
  });
  
  thisObjAlias = undefined;
  FileData = undefined;
  ListId = undefined;
}

</script>


<style scoped>

@import url('./style.css');

</style>