import { Component, OnInit } from '@angular/core';
import { getDatabase, onValue, ref, remove,  } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ModalAlumnosComponent } from '../components/modal-alumnos/modal-alumnos.component';
import { Router } from '@angular/router';
import { ModalAboutComponent } from '../components/modal-about/modal-about.component';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  role;
  uid;
  infoUser;
  tutorView: boolean;
  maestroView: boolean;
  alumnosArray: Array<any>;
  gruposArray: Array<any>;
  gruposNombre: Array<any> = [];
  grupoSelected;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    public atrCtrl: AlertController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    const auth = getAuth();
    this.uid = auth.currentUser.uid;
    this.getRole();
    this.getGrupos();
  }

  handleChange(ev: Event) {
    this.grupoSelected = (ev as CustomEvent).detail.value;
    this.getAlumnos(this.grupoSelected);
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalAlumnosComponent,
    });
    modal.present();
  }

  async openModalAbout() {
    const modal = await this.modalCtrl.create({
      component: ModalAboutComponent,
    });
    modal.present();
  }

  async onPress(grupo, nombre){
    if(this.maestroView){
      const alertConfirm = await this.atrCtrl.create({
        message: `¿Desea eliminar el alumno ${nombre}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Confirmar',
            handler: () => {
              const db = getDatabase();
              remove(ref(db, `users/${this.uid}/grupos/${grupo}/alumnos/${nombre}`));
              //Dirigir a tareas
              this.presentToast('Alumno eliminado');
            }
          }
        ]
      });
      (await alertConfirm).present();  
    }
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

  getAlumnos(grupo){
    const db = getDatabase();
    const usersRef = ref(db, `users/${this.uid}/grupos/${grupo}/alumnos`);
    onValue(usersRef, (snapshot) => {
      this.alumnosArray = snapshot.val();
    });
  }

  getRole(){
    const db = getDatabase();
    const dbRef = ref(db, 'users/' + this.uid);
    onValue(dbRef, (snapshot) => {
      //Traer el rol de la BD
      if (snapshot.exists()) {
        this.infoUser = snapshot.val();
        this.role = this.infoUser.rol;
        if(this.role === 'tutor'){
          this.tutorView = true;
        }
        else{
          this.maestroView = true;
        }
      } else {
        console.log("No data available");
      }
    });
  }

  goToInfo(grupo, nombre){
    this.router.navigate(['/data-alumno'], { queryParams: { grupo: grupo, nombre:nombre } });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

}
