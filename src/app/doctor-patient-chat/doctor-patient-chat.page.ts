/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable eqeqeq */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/semi */
import { Observable } from 'rxjs';
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { NotificationService } from './../services/notification.service';
import { Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { ChatService } from './../services/chat.service';
import { AuthService } from './../services/auth.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-doctor-patient-chat',
  templateUrl: './doctor-patient-chat.page.html',
  styleUrls: ['./doctor-patient-chat.page.scss'],
})
export class DoctorPatientChatPage implements OnInit {
  @ViewChild('file') files: ElementRef;
  @ViewChild('file2') files2: ElementRef;

  userid: string = ""; // Doctor ID
  patientInfo: any = []; //Patient Information includng its ID
  chat_id: string = "";

  content: string = "";
  chat$: Observable<any>;

  imgUrl: any;

  file1: any = "";
  file2: any = "";

  filename: string = "";
  filename2: string = "";

  error_message = "";
  success_message = "";


  medList: any = [];
  labList: any = [];
  presList: any = [];

  constructor(
    public afu: AuthService,
    public chats: ChatService,
    public userservice: UserService,
    public router: Router,
    //public notif: NotificationService
  ) { }

  ngOnInit(): void {

    this.userid = this.afu.get_UID();
    this.userservice.get_avatar(this.userid).then(e=>{
      this.imgUrl = e.data().image;
    })
    this.patientInfo = JSON.parse(localStorage.getItem('data'));
    console.log(this.patientInfo);
    this.chats.check_chat(this.userid,this.patientInfo.uid).then(e=>{
      e.forEach(item=>{
        this.chat_id = item.id;
      })
    }).then(()=>{
      this.chat_source();
    })


    /*this.get_medical();
    this.get_lab();
    this.get_prescription();*/
  }

  chat_source()
  {
     console.log(this.chat_id);
     this.chat$=this.chats.get(this.chat_id).pipe(
      map(doc => {
        return {
          id: doc.payload.id,
          ...
          Object.assign({}, doc.payload.data() )
        };
      })
    );
  }
  send_message()
  {
    if(this.content!="")
    {
      this.chats.send_message(this.chat_id,this.content,this.userid).then(()=>{
        this.content="";
        console.log("message sent!");
      })
    }else
    {
      console.log("Empty!");
    }
  }

  choosefile(e,type)
  {
    if(type=="cs")
    {
      this.file1 = e.target.files[0];
      console.log(e.target.files[0]);
    }
    else if(type=="prs")
    {
      this.file2 = e.target.files[0];
      console.log(e.target.files[0]);
    }
  }

  uploadFile()
  {
    console.log(this.filename);
    if(this.filename != "" && this.filename2 != "")
    {
      this.userservice.send_medicalRecord(this.patientInfo.uid,this.userid,this.filename+".pdf",this.file1)
      .catch(error=>{
        console.log(error)
      }).then(()=>{
        console.log("Stored successfully!");
      })
      this.userservice.send_prescriptionRecord(this.patientInfo.uid,this.userid,this.filename2+".pdf",this.file2)
      .catch(error=>{
        console.log(error)
      }).then(()=>{
        console.log("Stored successfully2!");
      })
      this.success_message = "Files sent successfully!";

      let record2 ={};
      record2['title'] = "Medical Summary and Prescription"
      record2['description'] = "The doctor sent your Medical Summary and your Prescription. Check your Records now!";
      record2['createdAt'] = formatDate(new Date(),'short','en');
      //this.notif.send_patient(this.patientInfo.uid,record2);


      setTimeout(() => {
        this.success_message = "";
      }, 5000);
    }
    else
    {
      this.error_message = "Make sure the fields are not empty!";
      setTimeout(() => {
        this.error_message = "";
      }, 5000);
    }
  }
  /*uploadMedical()
  {
    if(this.filename != "" && this.file1 != "")
    {
      console.log(this.file1);
      this.userservice.send_medicalRecord(this.patientInfo.uid,this.userid,this.filename+".pdf",this.file1)
      .catch(error=>{
        console.log(error)
      }).then(()=>{
        console.log("Stored successfully!");
        this.success_message = "File sent successfully!";

        let record2 ={};
        record2['title'] = "Medical Certificate"
        record2['description'] = "A doctor sent a medical Certificate. Check your Records now!";
        record2['createdAt'] = formatDate(new Date(),'short','en');
        this.notif.send_patient(this.patientInfo.uid,record2);

        setTimeout(() => {
          this.success_message = "";
        }, 5000);
      })
    }
    else{
      console.log('Empty Fields');
      this.error_message = "Empty Fields!";
      setTimeout(() => {
        this.error_message = "";
      }, 5000);
    }
  }
  choosefile2(e)
  {
    this.file1 = e.target.files[0];
    console.log(this.file1);
  }
  close()
  {
    this.filename = "";
    this.filename2 = "";
    this.files.nativeElement.value = "";
    this.files2.nativeElement.value= "";
  }*/
  video_call()
  {
    const audio = new Audio('assets/sounds/video-button.mp3');
    audio.play();
    window.open('/video-call','location=yes,height=570,width=2000,scrollbars=yes,status=yes');
  }

  /*finish_consultation()
  {
    let record = {};
    this.userservice.get_upcoming(this.patientInfo.upcoming_id).then(e=>{
      record['createdAt'] = formatDate(new Date(),'MM/dd/yyyy','en');
      record['doctor_id'] = e.data().doctor_id;
      record['patient_id'] = e.data().patient_id;
      record['schedule'] = e.data().schedule;
      record['consultation_schedule'] = e.data().consultation_schedule;
      record['time'] = e.data().time;
      record['status'] = "done";
    }).then(()=>{
      this.userservice.remove_upcoming(this.patientInfo.upcoming_id).then(()=>{
        console.log('Upcoming removed!')

        this.userservice.remove_share(this.userid,this.patientInfo.uid);

      }).then(()=>{
        this.userservice.create_consultation(record).then(()=>{
          console.log('Consultation Record Created!');
          this.router.navigate(['doctor-patients']);

          let record2 ={};
          record2['title'] = "Consultation Finished"
          record2['description'] = "Congratulations! You have finished your Consultation!";
          record2['createdAt'] = formatDate(new Date(),'short','en');
          this.notif.send_patient(this.patientInfo.uid,record2);
        })
      })
    });
  }
  open(file)
  {
    window.open(file);
  }
  get_medical()
  {
    var data;
    var tempArray = [];
    this.userservice.get_sharedFile(this.userid,this.patientInfo.uid)
    .onSnapshot(snapshot=>{
      let changes = snapshot.docChanges();
      changes.forEach(item=>{
        this.userservice.get_medical_shared(item.doc.data().file_id)
        .then(e=>{
          if(e.exists)
          {
            data = e.data();
            data.uid = e.id;
            tempArray.push(data);
          }
        })
      })
    })
    this.medList = tempArray;
    console.log(this.medList);
  }
  get_lab()
  {
    var data;
    var tempArray = [];
    this.userservice.get_sharedFile(this.userid,this.patientInfo.uid)
    .onSnapshot(snapshot=>{
      let changes = snapshot.docChanges();
      changes.forEach(item=>{
        this.userservice.get_lab_shared(item.doc.data().file_id)
        .then(e=>{
          if(e.exists)
          {
            console.log(e.data());
            data = e.data();
            data.uid = e.id;
            tempArray.push(data);
          }
        })
      })
    })
    this.labList = tempArray;
    console.log(this.labList);
  }

  get_prescription()
  {
    var data;
    var tempArray = [];
    this.userservice.get_sharedFile(this.userid,this.patientInfo.uid)
    .onSnapshot(snapshot=>{
      let changes = snapshot.docChanges();
      changes.forEach(item=>{
        this.userservice.get_prescription_shared(item.doc.data().file_id)
        .then(e=>{
          if(e.exists)
          {
            console.log(e.data());
            data = e.data();
            data.uid = e.id;
            tempArray.push(data);
          }
        })
      })
    })
    this.presList = tempArray;
    console.log(this.presList);
  }*/
}
