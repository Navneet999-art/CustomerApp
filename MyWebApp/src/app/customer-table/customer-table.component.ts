import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PaginationComponent } from '../pagination/pagination.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  standalone: true,
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css'],
  imports: [CommonModule, HttpClientModule, PaginationComponent]
})
export class CustomerTableComponent implements OnInit, OnChanges {
  @Input() location: string = '';
  @Input() industry: string = '';
  @Input() search: string = '';

  items: any[] = [];
  total = 0;
  page = 1;
  limit = 15;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.page = 1;
    this.fetchData();
  }

  fetchData(): void {
    const params = {
      page: this.page.toString(),
      limit: this.limit.toString(),
      location: this.location,
      industry: this.industry,
      search: this.search
    };
    this.dataService.getItems(params).subscribe(data => {
      this.items = data.items;
      this.total = data.total;
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.fetchData();
  }

  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.items);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'customer_data');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
