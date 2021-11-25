import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-patient-delete-account',
  templateUrl: './patient-delete-account.page.html',
  styleUrls: ['./patient-delete-account.page.scss'],
})
export class PatientDeleteAccountPage implements OnInit {

  constructor(public alertCtrl: AlertController, private router: Router, public toast: ToastController) { }
  async showAlert() {
    const alert = await this.alertCtrl.create({
    header: 'Warning',
    subHeader: 'This action is irreversible. ',
    message: 'Continue Account Deletion?',
    buttons: [
      {
        text: 'Cancel',
        handler: (data: any) => {
          console.log('Canceled', data);
        }
      },
      {
        text: 'Delete Account',
        handler: (data: any) => {
          this.router.navigate(['/login'])
        }
      }
    ]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
    }

  ngOnInit() {
  }

}
