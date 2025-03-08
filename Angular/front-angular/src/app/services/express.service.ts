import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExpressService {
  private expressUrl = 'http://localhost:3000/api/data';
  private dataSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.getDataSortedById().subscribe((data) => {
      this.dataSubject.next(data);
    });
  }

  getDataSortedById(): Observable<any[]> {
    return this.http
      .get<any[]>(this.expressUrl)
      .pipe(map((data) => data.sort((a, b) => a.id - b.id)));
  }

  getDataObservable(): Observable<any[]> {
    return this.dataSubject.asObservable();
  }

  refreshData(): void {
    this.getDataSortedById().subscribe((data) => {
      this.dataSubject.next([...data]);
    });
  }

  deleteUserFromJson(id: number): void {
    this.http.delete(`${this.expressUrl}/${id}`).subscribe(() => {
      this.getDataSortedById().subscribe((updatedData) => {
        this.dataSubject.next([...updatedData]);
      });
    });
  }
}
