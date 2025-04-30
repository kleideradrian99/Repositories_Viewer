import { Component, OnInit, HostListener } from '@angular/core';
import { GithubService } from 'src/app/core/services/github.service';
import { GithubRepo } from 'src/app/shared/models/github-repo.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.scss']
})
export class ReposComponent implements OnInit {
  repos: GithubRepo[] = [];
  filteredRepos: GithubRepo[] = [];
  loading = false;
  loadingMore = false;
  error = '';
  languages: string[] = [];
  currentPage = 1;
  hasMoreRepos = true;
  currentUsername = '';

  form = new FormGroup({
    username: new FormControl(''),
    language: new FormControl('')
  });

  constructor(private githubService: GithubService) { }

  ngOnInit(): void {
    this.form.get('language')?.valueChanges.subscribe(language => {
      this.filterReposByLanguage(language);
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
      this.error = 'Please enter a GitHub username';
      return;
    }

    this.loading = true;
    this.error = '';
    this.repos = [];
    this.filteredRepos = [];
    this.languages = [];
    this.currentPage = 1;
    this.hasMoreRepos = true;
    this.currentUsername = username;

    this.githubService.getUserRepos(username).subscribe({
      next: (data) => {
        this.repos = data;
        this.filteredRepos = data;
        this.languages = [...new Set(data.map(repo => repo.language).filter(lang => lang))];
        this.hasMoreRepos = data.length === 10;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = err.message;
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
        this.error = err.message;
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
