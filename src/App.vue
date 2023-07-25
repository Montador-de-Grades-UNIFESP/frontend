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
          @click="cleanAll()"> Limpar grade<font-awesome-icon style="font-size: 1rem;" class="pl-1 text-red-darken-2" icon="fa-solid fa-x" />
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
                      <!-- <div class="text-caption">Taxa de reprovação: {{ value.taxa }}</div> -->
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
      Faça um pull request em<a href="https://github.com/vpedrota/montador-de-grades"><img src='../public/github-mark.png' style="max-width: 25px; vertical-align: middle;" class="mx-1"></a>ou mande uma mensagem para <strong>montadordegrades@gmail.com</strong>.
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
    let canvasScript = document.createElement('script')
    canvasScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js')
    document.head.appendChild(canvasScript);
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
    showAlert(row, col) {
      // Removendo matéria
      if(this.tabela[row][col] != ''){
        let materia = this.tabela[row][col]
        this.quantidade -= this.ListaIdsSelecionadas.filter(item => item.ID === materia.ID)[0].HORARIO.length
        this.ListaIdsSelecionadas = this.ListaIdsSelecionadas.filter(item => item.ID !== materia.ID)
        console.log(this.ListaIdsSelecionadas)
        localStorage.ListaIdsSelecionadas = JSON.stringify(this.ListaIdsSelecionadas)
        for(let i = 0; i < materia.DIA.length; i++){
          let dia = this.daysOfWeek.indexOf(materia.DIA[i])
          let horario = this.hours.indexOf(materia.HORARIO[i])
          this.tabela[horario][dia] = ''
        }
        this.tabela[row][col] = ''
        
        return
      }
      this.row = row
      this.col = col
      this.modalTitle = 'Disciplinas diponíveis para '+ this.daysOfWeek[col] + ' ' + this.hours[row]
      this.showModal = true
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
    
      var myHeaders = new Headers();

      var raw = JSON.stringify({
        "items": [
          value.ID
        ]
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
     
      // fetch("https://montador-de-grades-api-upfpc35ezq-uc.a.run.app/disciplinas/prof", requestOptions)
      //   .then(response => response.text())
      //   .then(result => {
      //       let obj;
      //       obj = JSON.parse(result)
      //       if(obj.length !== 0){
      //         let str = value.NOME.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      //         let arr = obj[0]['NOME DA UC'].map(string => {
      //         return string
      //           .normalize("NFD")
      //           .replace(/[\u0300-\u036f]/g, "")
      //           .toLowerCase();
      //       });
      //       let index = JSON.stringify(arr.indexOf(str))
      //       if(index != -1){
      //         value.taxa = obj[0]['REPROVADOS'][index]
      //       }
      //       else{
      //         value.taxa = 'Sem dados'
      //       }
      //     } else{
      //       value.taxa = 'Sem dados'
      //     }
           
          
      //   })
      //   .catch(error => console.log('error', error));

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
    save(){
    
   let UcsSelecionadasToJson = JSON.stringify(this.ListaIdsSelecionadas)
    var a = document.createElement("a");
    var file = new Blob([UcsSelecionadasToJson], {type: 'text/json'});
    a.href = URL.createObjectURL(file);
    let currentDateTime = new Date().toLocaleString();
    currentDateTime = currentDateTime.split(',');
    a.download = "SelectedUCS " + currentDateTime[0]  + currentDateTime[1] + ".json";
    a.click();
  
  },
  load()
  {
    var inputFileDocument = document.createElement("input");
    inputFileDocument.setAttribute("type", "file");
    inputFileDocument.setAttribute("id", "upload");
    inputFileDocument.addEventListener("change",  (event) => {
      ListId = this.ListaIdsSelecionadas;
      thisObjAlias = this;  
      var reader = new FileReader();
      reader.readAsText(inputFileDocument.files[0])
      reader.onload = function() { FileData = reader.result; loadtoTableAfterParse(); }
    } , false);
    inputFileDocument.click();
  },
  screenShot()
  {
    let div = document.getElementById('canvas');

            // Use the html2canvas
            // function to take a screenshot
            // and append it
            // to the output div
            html2canvas(div).then(
                function (canvas) {
                  const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
                  const a = document.createElement('a')
                  let currentDateTime = new Date().toLocaleString();
                  currentDateTime = currentDateTime.split(',');
                  a.setAttribute('download', 'UCS-ScreenShot ' + currentDateTime[0]  + currentDateTime[1] + '.png')
                  a.setAttribute('href', image)
                  a.click()
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