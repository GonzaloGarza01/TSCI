import { Component, OnInit } from '@angular/core';
import { getDatabase, onValue, ref, remove,  } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ModalAvisosComponent } from '../components/modal-avisos/modal-avisos.component';
import { ModalAboutComponent } from '../components/modal-about/modal-about.component';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  role;
  uid;
  infoUser;
  tutorView: boolean;
  maestroView: boolean;
  avisosArray: Array<any>;


  constructor(
    private modalCtrl: ModalController,
    public atrCtrl: AlertController,
    private toastController: ToastController,
  ) {}
  
  ngOnInit() {
    const auth = getAuth();
    this.uid = auth.currentUser.uid;
    this.getRole();
    this.getAvisos();
  }

  getAvisos(){
    const db = getDatabase();
    const usersRef = ref(db, `avisos`);
    onValue(usersRef, (snapshot) => {
      this.avisosArray = snapshot.val();
    });
  }

  async openModalAbout() {
    const modal = await this.modalCtrl.create({
      component: ModalAboutComponent,
    });
    modal.present();
  }

  async eliminarAviso(id){
    if(this.maestroView){
      const alertConfirm = await this.atrCtrl.create({
        message: '¿Desea eliminar este aviso?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Confirmar',
            handler: () => {
              const db = getDatabase();
              remove(ref(db, `avisos/${id}`));
              this.presentToast('Aviso eliminado');
            }
          }
        ]
      });
      (await alertConfirm).present();  
    }
  }


  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalAvisosComponent,
    });
    modal.present();
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

}
