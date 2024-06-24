import { Component } from '@angular/core';
import { FilterComponent } from './filter/filter.component';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, HttpClientModule, FilterComponent, CustomerTableComponent]
})
export class AppComponent {
  location: string = '';
  industry: string = '';
  search: string = '';

  onFilterChange(filter: any): void {
    this.location = filter.location;
    this.industry = filter.industry;
    this.search = filter.search;
  }
}
