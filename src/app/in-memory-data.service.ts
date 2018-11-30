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

    const posts =  [
      {id: 1, title: 'The first article',
       author: 'MG', image: 'gallery-image-1.jpg', publishdate: '2018-11-02T07:22Z', excert: 'This is the summary of the article.'},
      {id: 2, title: 'The second article',
       author: 'MG', image: 'gallery-image-2.jpg', publishdate: '2018-11-02T08:22Z', excert: 'This is the summary of the article.'},
      {id: 3, title: 'The third article',
       author: 'MG', image: 'gallery-image-3.jpg', publishdate: '2018-11-02T09:22Z', excert: 'This is the summary of the article.'},
      {id: 4, title: 'The fourth article',
       author: 'MG', image: 'gallery-image-4.jpg', publishdate: '2018-11-02T10:22Z', excert: 'This is the summary of the article.'},
      {id: 5, title: 'The fifth article',
       author: 'MG', image: 'gallery-image-5.jpg', publishdate: '2018-11-02T11:22Z', excert: 'This is the summary of the article.'},
      {id: 6, title: 'The sixth article',
       author: 'MG', image: 'gallery-image-6.jpg', publishdate: '2018-11-02T12:22Z', excert: 'This is the summary of the article.'},
      {id: 7, title: 'The seventh article',
       author: 'MG', image: 'gallery-image-3.jpg', publishdate: '2018-11-02T07:22Z', excert: 'This is the summary of the article.'},
      {id: 8, title: 'The eighth article',
       author: 'MG', image: 'gallery-image-1.jpg', publishdate: '2018-11-02T07:22Z', excert: 'This is the summary of the article.'},
      {id: 9, title: 'The ninth article',
       author: 'MG', image: 'gallery-image-4.jpg', publishdate: '2018-11-02T07:22Z', excert: 'This is the summary of the article.'},
      {id: 10, title: 'The tenth article',
       author: 'MG', image: 'gallery-image-2.jpg', publishdate: '2018-11-02T07:22Z', excert: 'This is the summary of the article.'}
  ];
    return {users, posts};
  }

  getToken(user){
    return 'this is a token';
  }

  get (reqInfo: RequestInfo){
    if (reqInfo.collectionName ==='posts' ){
      return this.getArticles(reqInfo);
    }
    return undefined;
  }

  getArticles(reqInfo: RequestInfo) {

    return reqInfo.utils.createResponse$(() => {
      const dataEncapsulation = reqInfo.utils.getConfig().dataEncapsulation;
      const collection = reqInfo.collection;
      const id = reqInfo.id;
      const data = id === undefined ? collection : reqInfo.utils.findById(collection, id)

      const options: ResponseOptions = data ?
      {
        body: dataEncapsulation ? { data } : data,
        status: 200
      } :
      {
        body: { error: 'Post not found'},
        status: 404
      };

      options.statusText = options.status === 200 ? 'ok' : 'Not Found'
      options.headers = reqInfo.headers;
      options.url = reqInfo.url;
      return options;
    });
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
