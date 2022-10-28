import { Component, OnInit } from '@angular/core';
import { getDatabase, onValue, ref,  } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalTareasComponent } from '../components/modal-tareas/modal-tareas.component';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  role;
  uid;
  infoUser;
  tutorView: boolean;
  maestroView: boolean;

  grupoInfo;
  tareaInfo;
  allTareas: Array<any>;
  grupoSelected;
  gruposNombre: Array<any> = [];
  tareasArr: Array<any>;
  gruposArray: Array<any>;

  filtro: boolean;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,

  ) { }

  ngOnInit() {
    const auth = getAuth();
    this.uid = auth.currentUser.uid;
    this.getRole();
    this.getAllTareas();
    this.getGrupos();
  }

  handleChange(ev: Event) {
    this.grupoSelected = (ev as CustomEvent).detail.value;
    if(this.grupoSelected == "Sin filtro"){
      this.filtro = false;
    } else this.getTareas(this.grupoSelected);
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

  getTareas(grupo){
    this.filtro = true;
    const db = getDatabase();
    const usersRef = ref(db, `users/${this.uid}/grupos/${grupo}/tareas`);
    onValue(usersRef, (snapshot) => {
      this.tareasArr = snapshot.val();
    });
  }

  getAllTareas(){
    this.filtro = false;
    const db = getDatabase();
    const usersRef = ref(db, `users/${this.uid}/grupos/`);
    this.tareaInfo = {};
    onValue(usersRef, (snapshot) => {
      this.grupoInfo = snapshot.val();
      Object.keys(this.grupoInfo).forEach(key => {
        if(this.grupoInfo[key]?.tareas){
          // console.log(this.grupoInfo[key].tareas);
          this.allTareas = Object.assign(this.tareaInfo, this.grupoInfo[key].tareas);
        }
      });
    });
  }

  goToInfo(grupo, id){
    this.router.navigate(['/data-tarea'], { queryParams: { grupo: grupo, id :id } });
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
  
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalTareasComponent,
    });
    modal.present();
  }

  async tareasSection(){
    const tareas = document.querySelector('#section-tareas');
    const calif = document.querySelector('#section-calificaciones');

    tareas.classList.add('selected');
    calif.classList.remove('selected');

    const tSection = document.querySelector('#tareas-container');
    const cSection = document.querySelector('#calif-container');

    tSection.classList.add('selected-container');
    cSection.classList.remove('selected-container');

  }

  async calificacionesSection(){
    const tareas = document.querySelector('#section-tareas');
    const calif = document.querySelector('#section-calificaciones');

    tareas.classList.remove('selected');
    calif.classList.add('selected');

    const tSection = document.querySelector('#tareas-container');
    const cSection = document.querySelector('#calif-container');

    tSection.classList.remove('selected-container');
    cSection.classList.add('selected-container');

  }

}
