import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { getDatabase, push, ref, set, onValue } from 'firebase/database';
import { getAuth } from "firebase/auth";

@Component({
  selector: 'app-modal-tareas',
  templateUrl: './modal-tareas.component.html',
  styleUrls: ['./modal-tareas.component.scss'],
})
export class ModalTareasComponent implements OnInit {

  tareas: any ={};
  uid;
  gruposNombre: Array<any> = [];
  gruposArray: Array<any>;


  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    const auth = getAuth();
    this.uid = auth.currentUser.uid;
    this.getGrupos();
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

  async onSave(){
    try {
      const db = getDatabase();
      const usersRef = ref(db, 'users/' + this.uid + '/grupos/')
      const pushData = push(usersRef)
      const id  = pushData.key;
      if(this.tareas.name && this.tareas.descripcion && this.tareas.grupo && this.tareas.fecha){
        const db = getDatabase();
        set(ref(db, `users/${this.uid}/tareas/${id}`), {
          nombre: this.tareas.name,
          descripcion: this.tareas.descripcion,
          grupo: this.tareas.grupo,
          fecha: this.tareas.fecha,
          id: id,
          estado: 'activo'
        })
        .then(()=>{
          this.presentToast('Tarea registrada');
          this.tareas.name = '',
          this.tareas.descripcion = '',
          this.tareas.grupo = '',
          this.tareas.fecha = ''
          this.dismissModal();
        });
      }
      else{
        console.log("No existe informacion")
      }
    } catch (error) {
      console.log(error);
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

}
