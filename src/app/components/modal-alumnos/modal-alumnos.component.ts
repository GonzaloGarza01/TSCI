import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { getDatabase, push, ref, set, onValue, update } from 'firebase/database';
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

  async grupoSection(){
    const grupo = document.querySelector('#section-grupo');
    const alumno = document.querySelector('#section-alumno');

    grupo.classList.add('selected');
    alumno.classList.remove('selected');

    const gSection = document.querySelector('#grupo-container');
    const aSection = document.querySelector('#alumno-container');

    gSection.classList.add('selected-container');
    aSection.classList.remove('selected-container');

  }

  async alumnoSection(){
    const grupo = document.querySelector('#section-grupo');
    const alumno = document.querySelector('#section-alumno');

    grupo.classList.remove('selected');
    alumno.classList.add('selected');

    const gSection = document.querySelector('#grupo-container');
    const aSection = document.querySelector('#alumno-container');

    gSection.classList.remove('selected-container');
    aSection.classList.add('selected-container');

  }
  
  async onSave(){
    try {
      if(this.alumnos.nombre){
        if(this.alumnos.grupo){
          if(this.alumnos.edad){
            if(this.alumnos.contacto){
              if(this.alumnos.comentarios){
                const db = getDatabase();
                set(ref(db, `users/${this.uid}/grupos/${this.alumnos.grupo}/alumnos/${this.alumnos.nombre}`), {
                  nombre: this.alumnos.nombre,
                  grupo: this.alumnos.grupo,
                  edad: this.alumnos.edad,
                  contacto: this.alumnos.contacto,
                  comentarios: this.alumnos.comentarios
                })
                .then(()=>{
                  this.presentToast('Datos agregados');
                  this.alumnos.nombre = '',
                  this.alumnos.grupo = '',
                  this.alumnos.edad = '',
                  this.alumnos.comentarios = '',
                  this.alumnos.contacto = ''
                });
              }
              else{
                const db = getDatabase();
                set(ref(db, `users/${this.uid}/grupos/${this.alumnos.grupo}/alumnos/${this.alumnos.nombre}`), {
                  nombre: this.alumnos.nombre,
                  grupo: this.alumnos.grupo,
                  edad: this.alumnos.edad,
                  contacto: this.alumnos.contacto,
                })
                .then(()=>{
                  this.presentToast('Datos agregados');
                  this.alumnos.nombre = '',
                  this.alumnos.edad = '',
                  this.alumnos.contacto = ''
                });
              }
            }
            else{
              this.presentToast('Ingrese el número de contacto');
            }
          }
          else{
            this.presentToast('Ingrese al edad del alumno');
          }
        }
        else{
          this.presentToast('Ingrese el grupo al que pertenece el alumno');
        }
      }
      else{
        this.presentToast('Ingrese el nombre del alumno');
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
        this.presentToast('Ingrese el nombre del grupo');
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
