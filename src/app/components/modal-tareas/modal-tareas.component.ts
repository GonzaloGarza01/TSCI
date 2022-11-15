import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { getDatabase, push, ref, set, onValue, update } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { StorageserviceService } from 'src/app/services/Storage/storage-service.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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
  tareaImg;
  event;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private storageService: StorageserviceService,
    public angularFireAuth: AngularFireAuth,
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
      if(this.tareas.nombre){
        if(this.tareas.grupo){
          if(this.tareas.descripcion){
            if(this.tareas.fecha){
              const db = getDatabase();
              if(this.tareas.id){
                update(ref(db, `users/${this.uid}/tareas/${this.tareas.id}`), {
                  nombre: this.tareas.nombre,
                  descripcion: this.tareas.descripcion,
                  grupo: this.tareas.grupo,
                  fecha: this.tareas.fecha,
                  estado: 'activo'
                })
                .then(()=>{
                  this.presentToast('Tarea actualizada');
                  this.tareas.nombre = '',
                  this.tareas.descripcion = '',
                  this.tareas.grupo = '',
                  this.tareas.fecha = ''
                  this.dismissModal();
                });
                if(this.tareas.image){
                  const files = this.event.target.files;
                  const reader = new FileReader();
                  reader.readAsDataURL(files[0]);
                  reader.onloadend = () => {
                    this.tareaImg = reader.result;
                    this.storageService.uploadImage(this.uid, id, reader.result).then(urlImg=>{
                      this.tareaImg = urlImg;
                      const db = getDatabase();
                      update(ref(db, `users/${this.uid}/tareas/${this.tareas.id}`), {
                        image: urlImg
                      });
                    });
                  };
                }
              }
              else{
                update(ref(db, `users/${this.uid}/tareas/${id}`), {
                  nombre: this.tareas.nombre,
                  descripcion: this.tareas.descripcion,
                  grupo: this.tareas.grupo,
                  fecha: this.tareas.fecha,
                  id: id,
                  estado: 'activo'
                })
                .then(()=>{
                  this.presentToast('Tarea registrada');
                  this.tareas.nombre = '',
                  this.tareas.descripcion = '',
                  this.tareas.grupo = '',
                  this.tareas.fecha = ''
                  this.dismissModal();
                });
                if(this.tareas.image){
                  const files = this.event.target.files;
                  const reader = new FileReader();
                  reader.readAsDataURL(files[0]);
                  reader.onloadend = () => {
                    this.tareaImg = reader.result;
                    this.storageService.uploadImage(this.uid, id, reader.result).then(urlImg=>{
                      this.tareaImg = urlImg;
                      const db = getDatabase();
                      update(ref(db, `users/${this.uid}/tareas/${id}`), {
                        image: urlImg
                      });
                    });
                  };
                }
              }
            }
            else{
              this.presentToast('Fecha no registrada');
            }
          }
          else{
            this.presentToast('Descripción no registrada');
          }
        }
        else{
          this.presentToast('Grupo no registrada');
        }
      }
      else{
        this.presentToast('Nombre de tarea no registrada');
      }
    } catch (error) {
      console.log(error);
    }
  }

  saveImage(event){
    this.event = event;
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
