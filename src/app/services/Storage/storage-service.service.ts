import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { environment } from 'src/environments/environment';

firebase.initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root'
})
export class StorageserviceService {

  storageRef = firebase.app().storage().ref();
  constructor() { }

  async uploadImage(name: string, id: any , imgbase: any){
    try {
      const response = await this.storageRef.child(`users/${name}/tareas/${id}`).putString(imgbase,'data_url');
      return await response.ref.getDownloadURL();
    } catch (error) {
      console.log('Error ->' , error);
      return null;
    }
  }
}
