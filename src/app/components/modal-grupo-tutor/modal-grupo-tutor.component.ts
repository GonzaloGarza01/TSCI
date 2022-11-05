import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { getAuth } from 'firebase/auth';
import { getDatabase, onValue, ref, update,  } from 'firebase/database';

@Component({
  selector: 'app-modal-grupo-tutor',
  templateUrl: './modal-grupo-tutor.component.html',
  styleUrls: ['./modal-grupo-tutor.component.scss'],
})
export class ModalGrupoTutorComponent implements OnInit {
  allInfoBD;
  allInfoMaestros: Array<any>;
  allInfoGrupos: Array<any>;
  gruposNombre: Array<any> = [];
  grupo: string;
  uid;
  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    public atrCtrl: AlertController,
    private router: Router,
  ) { }

  ngOnInit() {
    const auth = getAuth();
    this.uid = auth.currentUser.uid;
    this.getGrupos();
  }

  getGrupos(){
    const db = getDatabase();
    const dbRef = ref(db, `users/`);
    onValue(dbRef, (snapshot) => {
      if(this.allInfoBD){
        this.allInfoBD = {}
      }
      this.allInfoMaestros = [];
      this.allInfoGrupos = [];
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
          if(this.allInfoMaestros[key].grupos){
            if(!this.allInfoGrupos[key]){
              this.allInfoGrupos = this.allInfoMaestros[key].grupos;
            }
          }
        });
      }
      if(this.allInfoGrupos){
        Object.keys(this.allInfoGrupos).forEach(key => {
          this.gruposNombre.push(this.allInfoGrupos[key].nombre);
        });
      }
    });    
  }

  dismissModal(){
    this.modalController.dismiss();
  }

  async onSave(){
    if(this.grupo){
      const alertConfirm = await this.atrCtrl.create({
        message: `¿Esta seguro que desea elegir el grupo: ${this.grupo} como su grupo?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Confirmar',
            handler: () => {
              const db = getDatabase();
              update(ref(db, `users/${this.uid}`), {
                grupoId: this.grupo
              });
              this.dismissModal();
              this.presentToast('Grupo seleccionado');
            }
          }
        ]
      });
      (await alertConfirm).present();  
    }
    else{
      this.presentToast('Seleccione un grupo')
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000
    });
    toast.present();
  }

}
