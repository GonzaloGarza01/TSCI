import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { getAuth } from "firebase/auth";
import { child, get, getDatabase, onValue, ref,  } from 'firebase/database';

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
    console.log(this.uid, this.info.params.grupo, this.info.params.nombre);
    onValue(dbRef, (snapshot) => {
      //Traer el rol de la BD
      if (snapshot.exists()) {
        this.dataUser = snapshot.val();
        console.log(this.dataUser);
      } else {
        console.log("No data available");
      }
    });
  }

}
