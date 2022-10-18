import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { getDatabase, ref, set } from 'firebase/database';

@Component({
  selector: 'app-modal-alumnos',
  templateUrl: './modal-alumnos.component.html',
  styleUrls: ['./modal-alumnos.component.scss'],
})
export class ModalAlumnosComponent implements OnInit {

  alumnos: any ={};

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,

  ) { }

  ngOnInit() {}
  
  async onSave(){
    try {
      if(this.alumnos.name && this.alumnos.edad && this.alumnos.number && this.alumnos.extra){
        const db = getDatabase();
        set(ref(db, 'alumnos/' + this.alumnos.name), {
          nombre: this.alumnos.name,
          edad: this.alumnos.edad,
          contacto: this.alumnos.number,
          comentarios: this.alumnos.extra
        })
        .then(()=>{
          this.presentToast('Alumno registrado');
          this.alumnos.name = '',
          this.alumnos.edad = '',
          this.alumnos.number = '',
          this.alumnos.extra = ''
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
