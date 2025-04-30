import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { GithubRepo } from 'src/app/shared/models/github-repo.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getUserRepos(username: string): Observable<GithubRepo[]> {
    return this.http.get<GithubRepo[]>(`${this.baseUrl}/repos/${username}`)
      .pipe(
        catchError(err => {
          let message = 'Unknown error';
          if (err.status === 404) message = 'User not found';
          else if (err.error?.message) message = err.error.message;
          else if (err.status >= 500) message = 'Server error';
          return throwError(() => new Error(message));
        })
      );
  }

}
