import { Component, OnInit } from '@angular/core';
import { getAuth } from "firebase/auth";
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, onValue, ref, set, update,  } from 'firebase/database';
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
    this.getInfoBD();
    this.getRole();
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
