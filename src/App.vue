<template>

  <div class="parent">
    <div class="div1">
      <table>
        <thead>
          <tr>
            <th>Horário</th>
            <th v-for="(value) in daysOfWeek">{{ value }}</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(row, rowIndex) in tabela">
              <td>{{ hours[rowIndex] }}</td>
              <td v-for="(value, colIndex) in row" @click="showAlert(rowIndex, colIndex)">
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
      <button @click="cleanAll()">limpar</button>
    </div>
    <div class="div2">
      <div class="escolhidas" v-for="(value) in ListaIdsSelecionadas">{{ value.NOME }} - {{ value.TURMA }} - {{ value.PROFESSORES }} <button @click="removeUC(value)">Excluir</button></div>
    </div>
    <div class="div3 teste">
      <ListaUC :horario="null" :dia="null" :listaSelecionadas="ListaIdsSelecionadas"  @updateValue="updateValue"></ListaUC>
    </div>
  </div>

   <Modal v-if="showModal" @close="showModal = false" :title="modalTitle">
    <ListaUC :horario="hours[this.row]" :dia="daysOfWeek[this.col]" :listaSelecionadas="ListaIdsSelecionadas" @updateValue="updateValue"></ListaUC>
  </Modal>
</template>

<script>

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
      col: null,
      row: 0,
      // O controle das disciplinas será através dos ids das disciplinas
      ListaIdsSelecionadas: []
    }
  },
  methods: {
    showAlert(row, col) {
      // Removendo matéria
      if(this.tabela[row][col] != ''){
        let materia = this.tabela[row][col]
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
      this.updateTable(value, value)
      this.ListaIdsSelecionadas.push(value)
      this.showModal = false
    },
    cleanAll(){
      this.ListaIdsSelecionadas = []
      for(let i = 0; i < 6; i++){
        for(let j = 0; j < 6; j++){
          this.tabela[i][j] = ''
        }
      }
    },
    removeUC(obj){
      this.ListaIdsSelecionadas = this.ListaIdsSelecionadas.filter(item => item.ID !== obj.ID)
      this.updateTable(obj, '')
    }
  }
}
</script>

<style scoped>
 table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    height: 100px;
    min-width: 100px;
    text-align: center;     /* alinhamento horizontal */
    vertical-align: middle;
  }
  th {
    background-color: #ddd;
    align-items: center;
    align-content: center;
  }
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  .parent {
    display: grid;
    grid-template-columns: repeat(20, 1fr);
    grid-template-rows: repeat(15, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;
  }

  .parent > div {
    background-color: rgb(32, 34, 33);
    padding: 15px;
  }

  .div1 { 
    grid-area: 1 / 1 / 16 / 16;
    width: fit-content;
    width: 900px;
  }
  .div2 { 
    grid-area: 1 / 16 / 9 / 21; 
    overflow-y: scroll;
    max-height: 390px;
  }
  .div3 {
    grid-area: 9 / 16 / 16 / 21; 
  }

  .teste{
    height: 340px;
    width: 460px;
    overflow-y: scroll;
    max-height: 500px;
  }
  
  .escolhidas{
    background-color: rgb(15, 110, 110);
    padding: 15px;
    margin: 3px;
  }

  .item{
    font-size: 1em;
  }

</style>