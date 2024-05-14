import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-summary-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-details.component.html',
  styleUrl: './summary-details.component.css',
})
export default class SummaryDetailsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  customerId: number = 0;
  customerlist: any[] = [];
  constructor() {
    const localData = localStorage.getItem('customers');

    if (localData !== null) {
      this.customerlist = JSON.parse(localData);
    }
    this.activatedRoute.params.subscribe((res: any) => {
      if (res.id) {
        this.customerId = res.id;
      }
    });
  }

  ngOnInit(): void {
    const currentRecord = this.customerlist.find(
      (data) => data.id == this.customerId
    );

    console.log('currentRecord', currentRecord);
  }
}
