import { Component, OnInit } from '@angular/core';
import { ExpressService } from '../../services/express.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  data: any[] = [];

  constructor(private expressService: ExpressService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.expressService.getDataObservable().subscribe((response) => {
      this.data = [...response];
      this.cdRef.detectChanges();
    });
  }

}
