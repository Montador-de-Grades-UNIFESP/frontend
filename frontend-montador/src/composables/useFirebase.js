import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs } from "firebase/firestore/lite";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA5zG55pTy8D_kfhxjx_TfKTgL1k1e7SNA",
  authDomain: "montador-de-grades---unifesp.firebaseapp.com",
  projectId: "montador-de-grades---unifesp",
  storageBucket: "montador-de-grades---unifesp.appspot.com",
  messagingSenderId: "51502672874",
  appId: "1:51502672874:web:59a3ee55f38c7cd9306093",
  measurementId: "G-N2RD5ZYNSK"
};


let app = null;


// Inicializa o Firebase
function init() {
    app = initializeApp(firebaseConfig);
}


export default function useFirebase() {

    return {
        app,
        init
    }
}
