import { Component, OnInit } from '@angular/core';
import { getAuth } from "firebase/auth";
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, onValue, ref, update,  } from 'firebase/database';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-data-tarea',
  templateUrl: './data-tarea.page.html',
  styleUrls: ['./data-tarea.page.scss'],
})
export class DataTareaPage implements OnInit {
  uid;
  info;
  dataTarea;
  infoUser;
  tutorView: boolean;
  maestroView: boolean;
  role;
  estado;

  tareaInfo;

  allInfoBD;
  allInfoMaestros: Array<any>;
  allInfoTareas: Array<any>;
  tareasTutorActivas: Array<any>;
  tareasTutorVencidas: Array<any>;

  constructor(
    private route: ActivatedRoute,
    public atrCtrl: AlertController,
    private router: Router,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    const auth = getAuth();
    this.uid = auth.currentUser.uid;
    this.route.queryParamMap.subscribe((params) => {
      this.info = { ...params.keys, ...params };
    });
    this.getRole();
    this.getInfoBD();
    this.getEstado();
  }

  getEstado(){
    const db = getDatabase();
    const usersRef = ref(db, `users/${this.uid}/tareas/${this.info.params.id}`)
    onValue(usersRef, (snapshot) => {
      this.tareaInfo = snapshot.val();
      if(this.tareaInfo.estado === 'activo'){
        this.estado = 'activo';
      } else{
        this.estado = 'finalizado';
      }
    });
  }

  async finalizarTarea(){
    const alertConfirm = await this.atrCtrl.create({
      message: '¿Esta seguro que desea marcar como finalizada esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            const db = getDatabase();
            update(ref(db, `users/${this.uid}/tareas/${this.info.params.id}`), {
              estado: 'finalizado'
            });
            //Dirigir a tareas
            this.router.navigate(['tabs/asignaciones']);
            this.presentToast('Tarea finalizada');
          }
        }
      ]
    });
    (await alertConfirm).present();
  }

  async activarTarea(){
    const alertConfirm = await this.atrCtrl.create({
      message: '¿Esta seguro que desea volver a activar esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            const db = getDatabase();
            update(ref(db, `users/${this.uid}/tareas/${this.info.params.id}`), {
              estado: 'activo'
            });
            //Dirigir a tareas
            this.router.navigate(['tabs/asignaciones']);
            this.presentToast('Tarea finalizada');
          }
        }
      ]
    });
    (await alertConfirm).present();
  }

  getInfoBD(){
    if(this.maestroView){
      const db = getDatabase();
      const dbRef = ref(db, `users/${this.uid}/tareas/${this.info.params.id}`);
      onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          this.dataTarea = snapshot.val();
        } else {
          console.log("No data available");
        }
      });
    }
    else{
      const db = getDatabase();
      const dbRef = ref(db, `users/`);
      onValue(dbRef, (snapshot) => {
        if(this.allInfoBD){
          this.allInfoBD = {}
        }
        this.allInfoMaestros = [];
        this.allInfoTareas = [];
        this.tareasTutorActivas = [];
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
            if(this.allInfoTareas[key].id === this.info.params.id){
              this.dataTarea = this.allInfoTareas[key];
            }
          });
        }
      });    
    }

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
