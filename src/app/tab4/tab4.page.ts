import { Component, OnInit } from '@angular/core';
import { getDatabase, onValue, ref, remove,  } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalTareasComponent } from '../components/modal-tareas/modal-tareas.component';
import { ModalAboutComponent } from '../components/modal-about/modal-about.component';
import { ModalGrupoTutorComponent } from '../components/modal-grupo-tutor/modal-grupo-tutor.component';

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
  grupoSelected;
  gruposNombre = [];
  tareasArr: any = {};
  gruposArray: Array<any>;
  filtro: boolean;
  itemSelectedValue: boolean;
  itemSessionsTS = [];


  allArrays: any = {};
  tareasActivas: Array<any>;
  tareasFinalizadas: Array<any>;
  tareasGrupoActivas: Array<any>;
  tareasGrupoFinalizadas: Array<any>;
  
  allInfoBD;
  allInfoMaestros: Array<any>;
  allInfoTareas: Array<any>;
  tareasTutorActivas: Array<any>;
  tareasTutorVencidas: Array<any>;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    public atrCtrl: AlertController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    const auth = getAuth();
    this.uid = auth.currentUser.uid;
    this.getRole();
    this.getAllTareas();
    this.getGrupos();
  }

  getGrupoTutor(info){
    const grupo = info.grupoId;
    const db = getDatabase();
    const dbRef = ref(db, `users/`);
    onValue(dbRef, (snapshot) => {
      if(this.allInfoBD){
        this.allInfoBD = {}
      }
      this.allInfoMaestros = [];
      this.allInfoTareas = [];
      this.tareasTutorActivas = [];
      this.tareasTutorVencidas = [];
      this.allInfoBD = snapshot.val();
      if(this.allInfoBD){
        Object.keys(this.allInfoBD).forEach(key => {
          if(this.allInfoBD[key].rol === 'maestro'){
            if(!this.allInfoMaestros[key]){
              this.allInfoMaestros[key] = this.allInfoBD[key];
            }
          }
        });
      }
      if(this.allInfoMaestros){
        Object.keys(this.allInfoMaestros).forEach(key => {
          if(this.allInfoMaestros[key].tareas){
            if(!this.allInfoTareas[key]){
              this.allInfoTareas = this.allInfoMaestros[key].tareas;
            }
          }
        });
      }
      if(this.allInfoTareas){
        Object.keys(this.allInfoTareas).forEach(key => {
          if(this.allInfoTareas[key].grupo === grupo){
            if(this.allInfoTareas[key].estado === 'activo'){
              if(!this.tareasTutorActivas[key]){
                this.tareasTutorActivas[key] = this.allInfoTareas[key]
              }
            } 
            else{
              if(!this.tareasTutorVencidas[key]){
                this.tareasTutorVencidas[key] = this.allInfoTareas[key]
              }
            }
          }
        });
      }
    });
  }

  async openModalAbout() {
    const modal = await this.modalCtrl.create({
      component: ModalAboutComponent,
    });
    modal.present();
  }

  async onPress(event, id){
    if(this.maestroView){
      const alertConfirm = await this.atrCtrl.create({
        message: '¿Desea eliminar esta tarea?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Confirmar',
            handler: () => {
              const db = getDatabase();
              remove(ref(db, `users/${this.uid}/tareas/${id}`));
              //Dirigir a tareas
              this.presentToast('Tarea eliminada');
            }
          }
        ]
      });
      (await alertConfirm).present();  
    }
  }

  //Traer las tareas
  getAllTareas(){
    this.filtro = false;
    const db = getDatabase();
    const usersRef = ref(db, `users/${this.uid}/tareas`);
    onValue(usersRef, (snapshot) => {
      if (this.allArrays) {
        this.allArrays = {};
      }
      this.tareasActivas = [];
      this.tareasFinalizadas = [];
      this.allArrays.allTareas = snapshot.val();
      if(this.allArrays.allTareas){
        Object.keys(this.allArrays.allTareas).forEach(key => {
          if(this.allArrays.allTareas[key].estado === 'activo'){
            if(!this.tareasActivas[key]){
              this.tareasActivas[key] = this.allArrays.allTareas[key];
            }
          } else{
            if(!this.tareasFinalizadas[key]){
              this.tareasFinalizadas[key] = this.allArrays.allTareas[key];
            }
          }
        });
      }
    });
  }

  //Filtrar por grupo
  handleChange(ev: Event) {
    this.grupoSelected = (ev as CustomEvent).detail.value;
    if(this.grupoSelected == "Sin filtro"){
      this.filtro = false;
    } else this.getTareas(this.grupoSelected);
  }

  //Traer las tareas de la BD con filtro
  getTareas(grupo){
    this.filtro = true;
    const db = getDatabase();
    const usersRef = ref(db, `users/${this.uid}/tareas`);
    onValue(usersRef, (snapshot) => {
      if(this.tareasArr){
        this.tareasArr = {}
      }
      this.tareasGrupoActivas = [];
      this.tareasGrupoFinalizadas = [];
      this.tareasArr = snapshot.val();
      if(this.tareasArr){
        Object.keys(this.tareasArr).forEach(key => {
          if(this.tareasArr[key].grupo === grupo){
            if(this.allArrays.allTareas[key].estado === 'activo'){
              if(!this.tareasGrupoActivas[key]){
                this.tareasGrupoActivas[key] = this.tareasArr[key];
              }
            }
            else{
              if(!this.tareasGrupoFinalizadas[key]){
                this.tareasGrupoFinalizadas[key] = this.tareasArr[key];
              }
            }
          }
        });
      }
    });
  }

  
  //Traer los grupos de la BD
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

  //Navegación
  goToInfo(grupo, id){
    this.router.navigate(['/data-tarea'], { queryParams: { grupo: grupo, id :id } });
  }

  //Traer el rol del usuario
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
          if(!this.infoUser.grupoId){
            this.openModalGrupo();
          }
          else{
            this.getGrupoTutor(this.infoUser);
          }
        }
        else{
          this.maestroView = true;
        }
      } else {
        console.log("No data available");
      }
    });
  }
  
  async openModalGrupo() {
    const modal = await this.modalCtrl.create({
      component: ModalGrupoTutorComponent,
    });
    modal.present();
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }
}
