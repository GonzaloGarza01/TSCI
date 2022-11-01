import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref,  } from 'firebase/database';

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
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        this.dataUser = snapshot.val();
      } else {
        console.log("No data available");
      }
    });
  }

}
