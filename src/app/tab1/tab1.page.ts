import { Component, OnInit } from '@angular/core';
import { child, get, getDatabase, onValue, ref,  } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { ModalController } from '@ionic/angular';
import { ModalAlumnosComponent } from '../components/modal-alumnos/modal-alumnos.component';
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
  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    const auth = getAuth();
    this.uid = auth.currentUser.uid;
    this.getRole();
    this.getAvisos();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalAlumnosComponent,
    });
    modal.present();
  }

  getAvisos(){
    const db = getDatabase();
    const usersRef = ref(db, `alumnos`);
    onValue(usersRef, (snapshot) => {
      this.alumnosArray = snapshot.val();
      console.log(this.alumnosArray);
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

}
