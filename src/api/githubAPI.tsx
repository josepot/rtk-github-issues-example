import { ajax } from 'rxjs/ajax'
import parseLink, { Links } from 'parse-link-header'
import { map, pluck } from 'rxjs/operators'
import { Observable } from 'rxjs'

export interface Label {
  id: number
  name: string
  color: string
}

export interface User {
  login: string
  avatar_url: string
}

export interface Issue {
  id: number
  title: string
  number: number
  user: User
  body: string
  labels: Label[]
  comments_url: string
  state: 'open' | 'closed'
  comments: number
}

export interface RepoDetails {
  id: number
  name: string
  full_name: string
  open_issues_count: number
}

export interface Comment {
  id: number
  body: string
  user: User
  created_at: string
  updated_at: string
}

export interface IssuesResult {
  pageLinks: Links | null
  pageCount: number
  issues: Issue[]
}

const isLastPage = (pageLinks: Links) => {
  return (
    Object.keys(pageLinks).length === 2 && pageLinks.first && pageLinks.prev
  )
}

const getPageCount = (pageLinks: Links) => {
  if (!pageLinks) {
    return 0
  }
  if (isLastPage(pageLinks)) {
    return parseInt(pageLinks.prev.page, 10) + 1
  } else if (pageLinks.last) {
    return parseInt(pageLinks.last.page, 10)
  } else {
    return 0
  }
}

export function getIssues(
  org: string,
  repo: string,
  page = 1
): Observable<IssuesResult> {
  const url = `https://api.github.com/repos/${org}/${repo}/issues?per_page=25&page=${page}`
  return ajax.get(url).pipe(
    map((r) => {
      let pageCount = 0
      const pageLinks = parseLink(r.xhr.getResponseHeader('link') as string)

      if (pageLinks !== null) {
        pageCount = getPageCount(pageLinks)
      }

      return {
        pageLinks,
        pageCount,
        issues: r.response as Issue[],
      }
    })
  )
}

export function getRepoOpenIssuesCount(org: string, repo: string) {
  const url = `https://api.github.com/repos/${org}/${repo}`
  return ajax.getJSON<RepoDetails>(url).pipe(pluck('open_issues_count'))
}

export function getIssue(org: string, repo: string, number: number) {
  const url = `https://api.github.com/repos/${org}/${repo}/issues/${number}`
  return ajax.getJSON<Issue>(url)
}

export function getComments(url: string) {
  return ajax.getJSON<Comment[]>(url)
}
