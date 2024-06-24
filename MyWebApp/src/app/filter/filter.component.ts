import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  imports: [CommonModule, FormsModule,HttpClientModule]
})
export class FilterComponent {
  @Output() filterChange = new EventEmitter<any>();

  location: string = '';
  industry: string = '';
  search: string = '';

  onFilterChange(): void {
    this.filterChange.emit({ location: this.location, industry: this.industry, search: this.search });
  }
}
