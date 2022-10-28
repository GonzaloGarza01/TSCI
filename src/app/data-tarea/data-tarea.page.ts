import { Component, OnInit } from '@angular/core';
import { getAuth } from "firebase/auth";
import { ActivatedRoute } from '@angular/router';
import { getDatabase, onValue, ref,  } from 'firebase/database';

@Component({
  selector: 'app-data-tarea',
  templateUrl: './data-tarea.page.html',
  styleUrls: ['./data-tarea.page.scss'],
})
export class DataTareaPage implements OnInit {
  uid;
  info;
  dataTarea;
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
    const dbRef = ref(db, `users/${this.uid}/grupos/${this.info.params.grupo}/tareas/${this.info.params.id}`);
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        this.dataTarea = snapshot.val();
      } else {
        console.log("No data available");
      }
    });
  }

}
