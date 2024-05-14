import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-show',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-show.component.html',
  styleUrl: './customer-show.component.css',
})
export class CustomerShowComponent implements OnInit {
  customerlist: any = [];
  router = inject(Router);

  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const localData = localStorage.getItem('customers');

    if (localData !== null) {
      this.customerlist = JSON.parse(localData);
    }
  }

  onEditCustomer(id: number) {
    // console.log('id', id);
    this.router.navigate(['/Customers', id]);
  }

  onDeleteCustomer(id: number) {
    console.log('id onDeleteCustomer', id);

    const index = this.customerlist.findIndex((data) => data.id == id);

    this.customerlist.splice(index, 1);
    localStorage.setItem('customers', JSON.stringify(this.customerlist));
    alert("delete")
  }
}
