<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RepoController extends Controller
{
    public function index($username)
    {
        $url = "https://api.github.com/users/{$username}/repos";

        $response = Http::withHeaders([
            'Accept' => 'application/vnd.github.v3+json',
            // If use token:
            // 'Authorization' => 'token ' . config('services.github.token'),
        ])->get($url);

        if ($response->status() === 404) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if (! $response->successful()) {
            return response()->json(['error' => 'Error communicating with GitHub'], $response->status());
        }

        $repos = collect($response->json())->map(function($repo) {
            return [
                'name'              => $repo['name'],
                'description'       => $repo['description'],
                'stargazers_count'  => $repo['stargazers_count'],
                'language'          => $repo['language'],
                'html_url'          => $repo['html_url'],
            ];
        });

        if ($repos->isEmpty()) {
            return response()->json(['message' => 'User has no public repos'], 200);
        }

        return response()->json($repos);
    }
}
