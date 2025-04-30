import { Component, OnInit, HostListener } from '@angular/core';
import { GithubService } from 'src/app/core/services/github.service';
import { GithubRepo } from 'src/app/shared/models/github-repo.model';
import { FormControl, FormGroup } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ReposComponent implements OnInit {
  repos: GithubRepo[] = [];
  filteredRepos: GithubRepo[] = [];
  loading = false;
  loadingMore = false;
  languages: string[] = [];
  currentPage = 1;
  hasMoreRepos = true;
  currentUsername = '';

  form = new FormGroup({
    username: new FormControl(''),
    language: new FormControl('')
  });

  constructor(
    private githubService: GithubService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form.get('language')?.valueChanges.subscribe(language => {
      this.filterReposByLanguage(language);
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.loading || this.loadingMore || !this.hasMoreRepos) return;

    const threshold = 100;
    const position = window.innerHeight + window.scrollY;
    const height = document.body.offsetHeight;

    if (position > height - threshold) {
      this.loadMoreRepos();
    }
  }

  searchRepos(): void {
    const username = this.form.get('username')?.value;
    if (!username) {
      this.showError('Please enter a GitHub username');
      return;
    }

    this.loading = true;
    this.repos = [];
    this.filteredRepos = [];
    this.languages = [];
    this.currentPage = 1;
    this.hasMoreRepos = true;
    this.currentUsername = username;

    this.githubService.getUserRepos(username).subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.showError('No repositories found for this user');
        }
        this.repos = data;
        this.filteredRepos = data;
        this.languages = [...new Set(data.map(repo => repo.language).filter(lang => lang))];
        this.hasMoreRepos = data.length === 10;
        this.loading = false;
      },
      error: (err: Error) => {
        this.showError(err.message);
        this.loading = false;
      },
    });
  }

  loadMoreRepos(): void {
    if (this.loadingMore || !this.hasMoreRepos) return;

    this.loadingMore = true;
    this.currentPage++;

    this.githubService.getUserRepos(this.currentUsername, this.currentPage).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.repos = [...this.repos, ...data];
          this.filteredRepos = [...this.filteredRepos, ...data];
          this.languages = [...new Set(this.repos.map(repo => repo.language).filter(lang => lang))];
          this.hasMoreRepos = data.length === 10;
        } else {
          this.hasMoreRepos = false;
        }
        this.loadingMore = false;
      },
      error: (err: Error) => {
        this.showError(err.message);
        this.loadingMore = false;
      },
    });
  }

  filterReposByLanguage(language: string | null): void {
    if (!language) {
      this.filteredRepos = this.repos;
    } else {
      this.filteredRepos = this.repos.filter(repo => repo.language === language);
    }
  }
}
