import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { getDatabase, onValue, ref } from 'firebase/database';
import { getAuth } from "firebase/auth";

@Component({
  selector: 'app-modal-about',
  templateUrl: './modal-about.component.html',
  styleUrls: ['./modal-about.component.scss'],
})
export class ModalAboutComponent implements OnInit {
  name: string;
  tutorView: boolean;
  maestroView: boolean;
  uid;
  role;
  infoUser;


  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    const auth = getAuth();
    this.uid = auth.currentUser.uid;
    this.getRole();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
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
