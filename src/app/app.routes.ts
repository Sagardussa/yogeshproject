import { Routes } from '@angular/router';
import { CustomerslistComponent } from './customerslist/customerslist.component';
import { CustomerShowComponent } from './customer-show/customer-show.component';
import SummaryDetailsComponent from './summary-details/summary-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'Customershow', pathMatch: 'full' }, // redirect to `ArticleListComponent`
  { path: 'Customers', component: CustomerslistComponent },

  { path: 'Customers/:id', component: CustomerslistComponent },
  { path: 'Customershow', component: CustomerShowComponent },
  { path: 'Customersummary/:id', component: SummaryDetailsComponent }
];
