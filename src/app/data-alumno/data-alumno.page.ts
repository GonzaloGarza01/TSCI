import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, remove,  } from 'firebase/database';
import { ModalAlumnosComponent } from '../components/modal-alumnos/modal-alumnos.component';

@Component({
  selector: 'app-data-alumno',
  templateUrl: './data-alumno.page.html',
  styleUrls: ['./data-alumno.page.scss'],
})
export class DataAlumnoPage implements OnInit {

  info;
  uid;
  dataUser;

  constructor(
    private route: ActivatedRoute,
    public atrCtrl: AlertController,
    private router: Router,
    private toastController: ToastController,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    const auth = getAuth();
    this.uid = auth.currentUser.uid;
    this.route.queryParamMap.subscribe((params) => {
      this.info = { ...params.keys, ...params };
    });
    this.getInfoBD();
  }

  getInfoBD(){
    const db = getDatabase();
    const dbRef = ref(db, `users/${this.uid}/grupos/${this.info.params.grupo}/alumnos/${this.info.params.nombre}`);
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        this.dataUser = snapshot.val();
      } else {
        console.log("No data available");
      }
    });
  }

  async eliminarAlumno(){
    const alertConfirm = await this.atrCtrl.create({
      message: '¿Esta seguro que desea eliminar el alumno?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            const db = getDatabase();
            remove(ref(db, `users/${this.uid}/grupos/${this.info.params.grupo}/alumnos/${this.info.params.nombre}`));
            //Dirigir a tareas
            this.router.navigate(['tabs/alumnos']);
            this.presentToast('Alumno eliminado');
          }
        }
      ]
    });
    (await alertConfirm).present();  
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

  async editAlumno(alumnos){
    const modal = await this.modalCtrl.create({
      component: ModalAlumnosComponent,
      componentProps: {
        alumnos: alumnos
      }
    });
    modal.present();  
  }

  async deleteAlumno(){
    const alertConfirm = await this.atrCtrl.create({
      message: `¿Desea eliminar el alumno ${this.dataUser.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            const db = getDatabase();
            remove(ref(db, `users/${this.uid}/grupos/${this.dataUser.grupo}/alumnos/${this.dataUser.nombre}`));
            //Dirigir a tareas
            this.router.navigate(['tabs/alumnos']);
            this.presentToast('Alumno eliminada');
          }
        }
      ]
    });
    (await alertConfirm).present();    
  }

}
