<template>

<v-container class="grey lighten-5">
    <v-row>
      <v-col cols="12" md="8" >
        <v-card
          class="tabela-card"
          outlined
          tile
        > 
      <table  id="target">
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
      <div style="display: flex;flex-direction: row; row-gap: 10px; width: 100%; align-items: center; justify-content: center;">
        <v-btn
          variant="outlined"
          color="error"
          style="margin-right: 5px;"

          @click="cleanAll()"> Limpar grade<font-awesome-icon class="X" icon="fa-solid fa-x" />
        </v-btn>
        
        <v-btn
          variant="outlined"
          color="default"
          style="margin-right: 5px;"

          @click="save"> Salvar
        </v-btn> 

        <v-btn
          variant="outlined"
          color="default"

          @click="load"> Carregar
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
          <v-row>
            <v-col>
              <h3> Disciplinas Escolhidas: </h3> 
               Total de Créditos: {{ quantidade*2 }}
              <v-card class="pa-2 escolhidas">
                <v-card class="mx-auto Escolhida" variant="outlined" v-for="(value) in ListaIdsSelecionadas">
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
          <v-row>
            <v-col style="display: flex;flex-direction: column; row-gap: 5px; justify-content: center;">
               <h3> Disciplinas Disponíveis:</h3>
                <div>
                  <ListaUC :btn_state_change = "btn_state" :horario="null" :dia="null" :listaSelecionadas="ListaIdsSelecionadas"  @updateValue="updateValue"></ListaUC>
                </div>
                <v-btn
                variant="outlined"
                color="default"
                class="btn-conflicts"
                @click="change_btn_state_conflict()"> Remover Conflitos
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
        
      </v-col>
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
import Modal from './components/Modal.vue';
import ListaUC from './components/Lista.vue';

export default {
  components: {
    ModalButton,
    Modal,
    ListaUC
  },
  data() {
    var tabela = [];

    for (let i = 0; i < 6; i++) {
      tabela[i] = Array(6).fill('');
    }

    return {
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
    this.target = this.$refs.target;
  },
  methods: {
    showAlert(row, col) {
      // Removendo matéria
      if(this.tabela[row][col] != ''){
        let materia = this.tabela[row][col]
        this.quantidade -= this.ListaIdsSelecionadas.filter(item => item.ID === materia.ID)[0].HORARIO.length
        this.ListaIdsSelecionadas = this.ListaIdsSelecionadas.filter(item => item.ID !== materia.ID)
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
      //       let str = value.NOME.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      //       let arr = obj[0]['NOME DA UC'].map(string => {
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
      this.showModal = false
      this.quantidade += value.HORARIO.length
    },
    
    cleanAll(){
      this.ListaIdsSelecionadas = []
      for(let i = 0; i < 6; i++){
        for(let j = 0; j < 6; j++){
          this.tabela[i][j] = ''
        }
      }
      this.quantidade = 0
    },
    removeUC(obj){
      this.ListaIdsSelecionadas = this.ListaIdsSelecionadas.filter(item => item.ID !== obj.ID)
      this.updateTable(obj, '')
      this.quantidade -= obj.HORARIO.length
    },
    save(){
    
   let UcsSelecionadasToJson = JSON.stringify(this.ListaIdsSelecionadas)
      console.log(this.ListaIdsSelecionadas);
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
  ListId.forEach(value => 
  {
    thisObjAlias.updateTable(value,value);
    thisObjAlias.ListaIdsSelecionadas.push(value);
    thisObjAlias.quantidade +=  value.HORARIO.length
  });
  
  thisObjAlias = undefined;
  FileData = undefined;
  ListId = undefined;
}
   
  


</script>

<style scoped>




.cell:hover{
  cursor:pointer;
  background-color: #cdeeff;
}
.X{
  padding-left: 7px;
  color: #c5707f;
  font-size: 1rem;
}
.Escolhida{
  margin-bottom: 10px;
}
.btn-conflicts
  {
    padding-left: 50px;
    padding-right: 50px;
    margin-top: 10px;
  }
.tabela-card{
  display: grid;
  grid-template-rows: 1fr;
  row-gap: 10px ;
  width: auto;
}
 table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    height: 100px;
    width: 100px;
    text-align: center;     /* alinhamento horizontal */
    vertical-align: middle;
  }
  td {
    max-width:100px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    height: 100px;
    max-height: 100px;
    text-align: center;
    border: 1px solid #302727;
  }

  th {
    border: 1px solid #302727;
    background-color: #ddd;
    align-items: center;
    align-content: center;
    
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  .escolhidas{
    min-height: 300px;
    max-height: 300px;
    overflow-y: scroll;
  }

  .item{
    font-size: 1em;
  }

  @media (max-width: 500px) {


  .tabela-card{
    overflow-x: scroll;
  
  }

  th {
    border: 1px solid #1b1818;
    text-align: left;
    text-align: center;   
    vertical-align: middle;
  }
  td {
    border: 1px solid #302727;
    height: 50px;
    max-width: 45px;
    width: 40px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    text-align: center;
    font-size: 10px;
  }

  th {
    background-color: #ddd;
    align-items: center;
    align-content: center;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  
}

</style>