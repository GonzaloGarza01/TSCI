import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { getDatabase, push, ref, set, onValue } from 'firebase/database';
import { getAuth } from "firebase/auth";

@Component({
  selector: 'app-modal-alumnos',
  templateUrl: './modal-alumnos.component.html',
  styleUrls: ['./modal-alumnos.component.scss'],
})
export class ModalAlumnosComponent implements OnInit {

  alumnos: any ={};
  grupos: any = {};
  gruposArray: Array<any>;
  gruposNombre: Array<any> = [];
  uid;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    const auth = getAuth();
    this.uid = auth.currentUser.uid;
    this.getGrupos();
  }

  getGrupos(){
    const db = getDatabase();
    const usersRef = ref(db, `users/${this.uid}/grupos`);
    onValue(usersRef, (snapshot) => {
      this.gruposNombre = [];
      this.gruposArray = snapshot.val();
      Object.keys(this.gruposArray).forEach(key => {
        this.gruposNombre.push(this.gruposArray[key].nombre);
      });
    });
  }

  async tareasSection(){
    const tareas = document.querySelector('#section-tareas');
    const calif = document.querySelector('#section-calificaciones');

    tareas.classList.add('selected');
    calif.classList.remove('selected');

    const tSection = document.querySelector('#tareas-container');
    const cSection = document.querySelector('#calif-container');

    tSection.classList.add('selected-container');
    cSection.classList.remove('selected-container');

  }

  async calificacionesSection(){
    const tareas = document.querySelector('#section-tareas');
    const calif = document.querySelector('#section-calificaciones');

    tareas.classList.remove('selected');
    calif.classList.add('selected');

    const tSection = document.querySelector('#tareas-container');
    const cSection = document.querySelector('#calif-container');

    tSection.classList.remove('selected-container');
    cSection.classList.add('selected-container');

  }
  
  async onSave(){
    try {
      if(this.alumnos.name && this.alumnos.edad && this.alumnos.number && this.alumnos.extra){
        const db = getDatabase();
        set(ref(db, `users/${this.uid}/grupos/${this.alumnos.grupo}/alumnos/${this.alumnos.name}`), {
          nombre: this.alumnos.name,
          grupo: this.alumnos.grupo,
          edad: this.alumnos.edad,
          contacto: this.alumnos.number,
          comentarios: this.alumnos.extra
        })
        .then(()=>{
          this.presentToast('Alumno registrado');
          this.alumnos.name = '',
          this.alumnos.edad = '',
          this.alumnos.number = '',
          this.alumnos.extra = ''
        });
      }
      else{
        console.log("No existe informacion")
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onSaveGrupo(){
    try {
      if(this.grupos.name){
        const db = getDatabase();
        const usersRef = ref(db, 'users/' + this.uid + '/grupos/')
        const pushData = push(usersRef)
        const id  = pushData.key;
        console.log(id);
        set(ref(db, 'users/' + this.uid + '/grupos/' + this.grupos.name), {
          //id: crear id,
          nombre: this.grupos.name,
          id: id,
        })
        .then(()=>{
          this.presentToast('Grupo registrado');
          this.grupos.name = ''
        });
      }
      else{
        console.log("No existe informacion")
      }
    } catch (error) {
      console.log(error);
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }
  
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

}
