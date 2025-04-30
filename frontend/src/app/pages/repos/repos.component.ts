import { Component, OnInit } from '@angular/core';
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
  error = '';
  languages: string[] = [];
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

    this.githubService.getUserRepos(username).subscribe({
      next: (data) => {
        this.repos = data;
        this.filteredRepos = data;
        this.languages = [...new Set(data.map(repo => repo.language).filter(lang => lang))];
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
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
