import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  postValidPan(body: any) {
    return this.http.post<any>(
      'https://lab.pixel6.co/api/verify-pan.php',
      body
    );
  }

  postValidPostCode(body: any) {
    return this.http.post<any>(
      'https://lab.pixel6.co/api/get-postcode-details.php',
      body
    );
  }
}
