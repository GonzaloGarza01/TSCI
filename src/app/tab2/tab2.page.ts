import { Component, OnInit } from '@angular/core';
import { child, get, getDatabase, onValue, ref,  } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { ModalController } from '@ionic/angular';
import { ModalAvisosComponent } from '../components/modal-avisos/modal-avisos.component';
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
    private modalCtrl: ModalController
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

}
