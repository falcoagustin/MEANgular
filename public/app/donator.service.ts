import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Donator } from './models/Donator';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class DonatorService {

  private donatorsUrl = 'api/donators';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  getDonators(): Promise<Donator[]> {
    return this.http.get(this.donatorsUrl)
               .toPromise()
               .then(response => response.json() as Donator[])
               .catch();
  }

  createNewDonatorPoint(data: any): Promise<Boolean> {
    return this.http.post(this.donatorsUrl, JSON.stringify(data), {headers: this.headers})
             .toPromise()
             .then(response => true)
             .catch(response => false);
  }

  handleError() { /* Handle error */}
}
