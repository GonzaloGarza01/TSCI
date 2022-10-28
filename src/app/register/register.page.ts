import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { getDatabase, ref, set } from 'firebase/database';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user: any={

  };
  constructor(
    private authSvc:AuthService,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }


  async onRegister(){
    if (this.user.confpass === this.user.pass){
      if(this.user.pass.length > 5){
        if(this.user.name !== undefined){
          try {
            const user = await this.authSvc.register(this.user.email, this.user.pass);
            if(user){
              const db = getDatabase();
              set(ref(db, 'users/' + user.uid), {
                nombre: this.user.name,
                email: this.user.email,
                rol: 'tutor'
              })
              .then(()=>{
                this.presentToast('Usuario registrado, favor de confirmar desde su correo');
                this.user.name = '';
                this.user.email = '';
                this.user.pass = '';
                this.user.confpass = '';
                this.router.navigate(['login']);
              });
            }
            else{
              this.presentToast('El correo electronico debe ser verificable');
            }
          } catch (error) {
            console.log('Error', error);
          }
        }
        else{
          this.presentToast('El nombre de usuario no puede estar vacio');
        }
      }
      else{
        this.presentToast('La contraseña debe ser mayor a 5 caracteres');
      }
    }
    else{
      this.presentToast('Las contraseñas no coinciden');
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
