import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { getDatabase, ref, set, push } from 'firebase/database';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-modal-avisos',
  templateUrl: './modal-avisos.component.html',
  styleUrls: ['./modal-avisos.component.scss'],
})
export class ModalAvisosComponent implements OnInit {
  
  aviso: any ={};

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,

  ) { }

  ngOnInit() {}

  async onSave(){
    try {
      if(this.aviso.title && this.aviso.body){
        const db = getDatabase();
        const usersRef = ref(db, 'avisos')
        const pushData = push(usersRef)
        const id  = pushData.key;
        set(ref(db, 'avisos/' + id), {
          titulo: this.aviso.title,
          descripcion: this.aviso.body,
        })
        .then(()=>{
          this.presentToast('Aviso registrado');
          this.aviso.title = '';
          this.aviso.body = '';
          this.dismissModal();
        });
      }
      else{
        console.log("No existe aviso")
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
