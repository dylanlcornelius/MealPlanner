import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Action } from './action.enum';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  ref = firebase.firestore().collection('user-actions');

  constructor() {}

  commitAction(uid: string, action: Action, number: Number): Promise<void> {
    const self = this;
    return new Promise<void>( resolve => {
        if (uid) {
        self.getAction(self, uid).then(function(userAction) {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const week = weekStart.getDate() + '/' + (weekStart.getMonth() + 1) + '/' + weekStart.getFullYear();
          if (userAction) {
            if (userAction.actions[week.toString()]) {
              let exists = false;
              Object.keys(userAction.actions[week.toString()]).forEach(id => {
                if (id === action) {
                  userAction.actions[week.toString()][action] += number;
                  exists = true;
                }
              });
              if (!exists) {
                userAction.actions[week.toString()][action] = number;
              }
            } else {
              userAction.actions[week.toString()] = {[action]: number};
            }
            self.putAction(self, userAction).then(function() {
              resolve();
            });
          } else {
            userAction = {'uid': uid, 'actions': {[week.toString()]: {[action]: number}}};
            self.postAction(self, userAction).then(function() {
              resolve();
            });
          }
        });
      }
    });
  }

  private getAction(self, uid: string) {
    return self.ref.where('uid', '==', uid).get().then(function(querySnapshot) {
      const action = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        action.push({
            id: doc.id,
            uid: data.uid || '',
            actions: data.actions || {},
          });
      });
      return action[0];
    });
  }

  private postAction(self, data) {
    return new Promise<void>(resolve => {
      self.ref.add(data).then(function() {
        resolve();
      }, function(error) {
        console.error('error: ', error);
      });
    });
  }

  private putAction(self, data): Promise<void> {
    return new Promise<void>(resolve => {
      self.ref.doc(data.id).set(data).then(function() {
        resolve();
      }, function(error) {
        console.error('error: ', error);
      });
    });
  }
}