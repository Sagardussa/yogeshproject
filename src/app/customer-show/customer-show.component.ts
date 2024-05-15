import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  toastrService = inject(ToastrService);

  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const localData = localStorage.getItem('customers');

    if (localData !== null) {
      this.customerlist = JSON.parse(localData);
    }
  }

  onEditCustomer(id: number) {
    this.router.navigate(['/Customers', id]);
  }

  onDeleteCustomer(id: number) {
    console.log('id onDeleteCustomer', id);

    const index = this.customerlist.findIndex((data) => data.id == id);

    this.customerlist.splice(index, 1);
    setTimeout(() => {
      localStorage.setItem('customers', JSON.stringify(this.customerlist));
    }, 1000);
    this.toastrService.success(
      'deleted completed successfully!',
      'Success'
    );
  }

  onviewCustomer(id: number) {
    this.router.navigate(['/Customersummary', id]);
  }
}
