import { Routes } from '@angular/router';
import { FilterComponent } from './filter/filter.component';
import { CustomerTableComponent } from './customer-table/customer-table.component';

export const routes: Routes = [
     {path:'', component:CustomerTableComponent},
    {path:'filter', component:FilterComponent}
];
