import {Router} from '@angular/router';
import * as firebase from 'firebase';
import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';


interface Manager {
  email: string;
  name: string;
  /*password: string;*/
}

interface ManagerId extends Manager {
  id: string;
}

@Injectable()
export class AuthService {
  token: string
  managersCol: AngularFirestoreCollection<Manager>;
  managers: any;
  managerDoc;
  /*managers: Observable<Manager>;*/
  name: string;
  email: string;

  constructor(
    private router: Router,
    private afs: AngularFirestore
  ) {}

  signupUser(user) {
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(response => {
        this.afs.collection('managers').doc(response.uid).set(Object.assign({}, user)).then(response => {
        })
          .catch(
          error => console.log(error)
        );
      })
      .catch(
        error => console.log(error)
      );
  }

  signinUser(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
        response => {
          this.router.navigate(['/hotels']);
          firebase.auth().currentUser.getIdToken()
            .then(
              (token: string) => this.token = token
            );
        }
      )
      .catch(
        error => console.log(error)
      );
  }

  logout() {
    firebase.auth().signOut();
    this.token = null;
    this.router.navigate(['/login']);
  }

  getToken() {
    firebase.auth().currentUser.getIdToken()
      .then(
        (token: string) => this.token = token
      );
    return this.token;
  }

  isAuthenticated() {
    return this.token != null;
  }
}
