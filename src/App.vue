<template>

<!-- Div mãe -->
<div class="font-sans p-4 w-full lg:max-w-[90%] mx-auto ">
  <!-- Container pra tabela e lateral -->
  <div class="-m-3 flex flex-auto flex-wrap">
    <div class="lg:flex-0666 lg:max-w-[66%] w-full p-3 flex-0100 max-w-full">
      <div class="v-card shadow-md overflow-x-scroll grid grid-rows-1 gap-2.5 w-auto">
      
        <!-- Tabela -->
        <table id="canvas" class="w-full border-collapse">
          <thead>
            <tr class="even:bg-gray-100">
              <th class="border-solid border-1 border-black">Horário </th>
              <th class="border-solid border-1 border-black" v-for="(value) in daysOfWeek">{{ value }}</th>
            </tr>
          </thead>
          <tbody>
              <tr v-for="(row, rowIndex) in tabela" class="even:bg-gray-100">
                <td class="whitespace-nowrap border-solid border-1 border-black">{{ hours[rowIndex] }}</td>
                <td 
                  v-for="(value, colIndex) in row" 
                  @click="showAlert(rowIndex, colIndex)" 
                  class="whitespace-nowrap border-1 border-solid border-[#302727] hover:cursor-pointer hover:bg-teal-100"
                >
                  <div class="break-words text-[100%] flex flex-col gap-y-1 w-full whitespace-pre-wrap border-collapse">
                    <div class="">
                      {{ value.NOME }}
                    </div>  
                    <div>{{ value.TURMA }} - {{ value.PROFESSORES }} </div>
                  </div>
                </td>
              </tr>
          </tbody>
        </table>
        <!-- Botões interação -->
        <div class="flex flex-row w-full align-content-space-around justify-center whitespace-nowrap ">
          <CustomButton class="border-red-700 px-4 mr-1 text-red-700"
            @click="cleanAll()"> Limpar grade<font-awesome-icon class="pl-1 text-base text-red-darken-2" icon="fa-solid fa-x" />
          </CustomButton>
          <CustomButton class="border-green-600 px-4 mr-1 text-green-600"
            @click="screenShot()"> Salvar como png
          </CustomButton>
          
          <CustomButton class="border-black px-4 mr-1"
            @click="save"> Exportar
          </CustomButton> 
  
          <CustomButton class="border-black px-4 mr-1"
            @click="load"> Importar
          </CustomButton> 
          
        </div>
        <span></span>
      </div>
    </div>
    <!-- Disciplinas escolhidas e disponíveis -->
    <div class="lg:flex-0333 lg:max-w-[33%] p-3 flex-0100 w-full p-3 flex-0100">
      <div class="v-card p-2 shadow-lg">
        <div class="p-4 w-full mx-auto lg:max-w-4xl xl:max-w-7xl mx-auto flex sm:block flex-col">
          <!-- Disciplinas Escolhidas: -->
          <div class="-m-3 flex flex-auto flex-wrap bg-white mb-10 sm:-m-3 order-2">
            <div class="grow basis-0 w-full p-3">
              <h3 class="font-bold block text-xl m-0"> Disciplinas Escolhidas: </h3> 
                Total de Créditos: {{ quantidade*2 }}
              <div class="v-card shadow-lg p-2 bg-white overflow-y-scroll h-[300px] rounded">
                <div class="v-card mx-auto mb-2" v-for="(value) in ListaIdsSelecionadas">
                  <div class="border-1 border-black rounded">
                    <div class="px-4 py-3">
                      <div class="text-xs text-overline mb-1 tracking-widest2x uppercase">
                        Turma - {{ value.TURMA }}
                      </div>
                      <div class="normal-case font-sans text-xl font-medium leading-8 mb-1">
                        {{value.NOME}}
                      </div>
                      <div class="text-2xs font-normal leading-5 tracking-wide font-sans normal-case">Professor(a): {{ value.PROFESSORES }}</div>
                    </div>
                    <div class="min-h-[52px] flex flex-none items-center p-2">
                      <CustomButton class="border-black p-2" @click="removeUC(value)">
                        Excluir
                      </CustomButton>
                    </div>
                  </div>
                </div>
            </div>
            </div>
          </div>
          <!-- Disciplinas Disponíveis: -->
          <div class="-mx-3 -mb-3 mt-3 flex flex-auto flex-wrap bg-white mb-10 ">
            <div class="grow basis-0 w-full p-3 flex flex-col justify-center gap-y-1.5">
                <h3 class="block text-xl font-bold">Disciplinas Disponíveis:</h3>
                <div class="">
                  <ListaUC :btn_state_change = "btn_state" :horario="null" :dia="null" :listaSelecionadas="ListaIdsSelecionadas"  @updateValue="updateValue"></ListaUC>
                </div>
                <CustomButton 
                  class="mt-2 py-2 px-12 border-black uppercase w-full h-auto" 
                  @click="change_btn_state_conflict()"
                >
                  <span class="text-wrap ">Remover Disciplinas Indisponíveis</span>
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="mt-3 -m-3 flex flex-auto flex-wrap flex-column align-center justify-center">
    <Alert
      v-model="alert"
      title="Problemas?"
      close-label="Close Alert"
      color="deep-purple-accent-4"
    >
    Faça um pull request em<a href="https://github.com/vpedrota/montador-de-grades"><font-awesome-icon class="mx-1 align-middle text-3xl text-grey-darken-4" icon="fa-brands fa-github"/></a>ou mande uma mensagem para <strong>montadordegrades@gmail.com</strong>.
    </Alert>
  </div>
   
</div>

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
import Alert from './components/Alert.vue';
import CustomButton from './components/CustomButton.vue';

export default {
  components: {
    ModalButton,
    Modal,
    ListaUC,
    Alert,
    CustomButton,
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


<style>

@import url('./style.css');

</style>