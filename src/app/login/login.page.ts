import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: any={ };

  constructor(
    private authSvc:AuthService,
    private router: Router,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  async onLogin(){
    try {
      const user = await this.authSvc.login(this.user.email, this.user.password);
      if(user){
      //Verificar el mail
        const isVerified = this.authSvc.isEmailVerified(user);
        this.redirectUser(isVerified);
        this.user.email = '';
        this.user.password = '';
      }
      else{
        this.presentToast('Verifique el usuario o contraseña');
      }
    } catch (error) {
      this.presentToast('Ha ocurrido un error');
      console.log('Error', error);
    }
  }

  private redirectUser(isVerified: boolean){
    if(isVerified){
       this.presentToast('Bienvenido a Aprende+');
        this.router.navigate(['tabs/alumnos']);
    } else{
       this.presentToast('Revisa tu email para verificar la cuenta');
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
