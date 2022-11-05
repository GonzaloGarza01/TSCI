import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { child, get, getDatabase, onValue, ref,  } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { ModalAboutComponent } from '../components/modal-about/modal-about.component';
import { ModalController } from '@ionic/angular';
import { ModalGrupoTutorComponent } from '../components/modal-grupo-tutor/modal-grupo-tutor.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  uid;
  dataUser;
  constructor(
    private authSvc:AuthService,
    private toastController: ToastController,
    private router: Router,
    private modalCtrl: ModalController
  ) {}


  ngOnInit() {
    const auth = getAuth();
    this.uid = auth.currentUser.uid;
    this.getUserInfo();
  }
  
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalAboutComponent,
    });
    modal.present();
  }

  async openModalGrupo() {
    const modal = await this.modalCtrl.create({
      component: ModalGrupoTutorComponent,
    });
    modal.present();
  }

  logOut(){
    this.authSvc.logout();
    this.presentToast("Cerrando sesión...");
    this.redirectUser();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

  redirectUser(){
    this.router.navigate(['login']);
  }

  getUserInfo(){
    const db = getDatabase();
    const dbRef = ref(db, 'users/' + this.uid);
    onValue(dbRef, (snapshot) => {
      //Traer el rol de la BD
      if (snapshot.exists()) {
        this.dataUser = snapshot.val();
      } else {
        console.log("No data available");
      }
    });
  }
  
}
