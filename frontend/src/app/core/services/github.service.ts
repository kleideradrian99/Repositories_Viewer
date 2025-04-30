import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { GithubRepo } from 'src/app/shared/models/github-repo.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private baseUrl = environment.apiUrl;
  private readonly perPage = 10;

  constructor(private http: HttpClient) { }

  getUserRepos(username: string, page: number = 1): Observable<GithubRepo[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', this.perPage.toString());

    return this.http.get<GithubRepo[]>(`${this.baseUrl}/repos/${username}`, { params })
      .pipe(
        catchError(err => {
          let message = 'Unknown error, possibly need to check the server';
          if (err.status === 404) message = 'User not found';
          else if (err.error?.message) message = err.error.message;
          else if (err.status >= 500) message = 'Server error';
          return throwError(() => new Error(message));
        })
      );
  }

}
