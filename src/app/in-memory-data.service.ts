import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo, ResponseOptions, STATUS } from 'angular-in-memory-web-api';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    const users = [
      { id: 11, firstname: 'Matt', surname: 'Goodger', email: 'matt@test.com', password: 'matt123' },
      { id: 12, firstname: 'Connor', surname: 'Rhodes', email: 'connor@test.com', password: 'connor123' },
      { id: 13, firstname: 'Kez', surname: 'Walker', email: 'kez@test.com', password: 'kez123' },
      { id: 14, firstname: 'Andy', surname: 'Thompson', email: 'andy@test.com', password: 'andy123' }
    ];
    return {users};
  }

  getToken(user){
    return 'this is a token';
  }

  post(reqInfo: RequestInfo){

    if (reqInfo.id === 'login'){
      console.log('from login')
      return reqInfo.utils.createResponse$(() => {
        const dataEncapsulation = reqInfo.utils.getConfig().dataEncapsulation;
        const users = reqInfo.collection.find(user => {
          return reqInfo.req['body'].email === user.email && reqInfo.req['body'].password === user.password;
        });

        let responseBody ={};

        if (users) {
          responseBody = {
            id: users.id,
            firstname: users.firstname,
            surname: users.surname,
            email: users.email,
            token: this.getToken(users)
          };
        }

        const options: ResponseOptions = responseBody ?
        {
          body: dataEncapsulation ? { responseBody } : responseBody,
          status: 200
        } :
        {
          body: { error: `'User' with email='${reqInfo.req['body'].email}' not found`},
          status: 404
        };

        options.statusText = options.status === 200 ? 'ok' : 'Not Found'
        options.headers = reqInfo.headers;
        options.url = reqInfo.url;
        return options;
      });

    } else if (reqInfo.id === 'signup'){
      reqInfo.id = null;
      console.log('from signup')
    }
  }
}
