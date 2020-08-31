import { Subject, merge } from 'rxjs'
import {
  startWith,
  withLatestFrom,
  map,
  pluck,
  filter,
  switchMap,
} from 'rxjs/operators'
import { bind, shareLatest, SUSPENSE } from '@react-rxjs/core'
import {
  Issue,
  getIssues,
  getRepoOpenIssuesCount,
  getIssue,
  getComments,
} from 'api/githubAPI'

export const INITIAL_ORG = 'rails'
export const INITIAL_REPO = 'rails'

const repoSubject$ = new Subject<{ org: string; repo: string }>()
export const onLoadRepo = (org: string, repo: string) => {
  repoSubject$.next({ org, repo })
}

const pageSelected$ = new Subject<number>()
export const onPageChange = (nextPage: number) => {
  pageSelected$.next(nextPage)
}

export const [useCurrentRepo, currentRepo$] = bind(
  repoSubject$.pipe(
    startWith({
      org: INITIAL_ORG,
      repo: INITIAL_REPO,
    })
  )
)

export const currentRepoAndPage$ = merge(
  currentRepo$.pipe(
    map((currentRepo) => ({
      ...currentRepo,
      page: 1,
    }))
  ),
  pageSelected$.pipe(
    withLatestFrom(currentRepo$),
    map(([page, repo]) => ({ ...repo, page }))
  )
).pipe(shareLatest())

export const [useCurrentPage] = bind(currentRepoAndPage$.pipe(pluck('page')))

export const [useIssues] = bind(
  currentRepoAndPage$.pipe(
    switchMap(({ page, repo, org }) =>
      getIssues(org, repo, page).pipe(startWith(SUSPENSE))
    )
  )
)

export const [useCurrentRepoOpenIssuesCount] = bind(
  currentRepo$.pipe(
    switchMap(({ org, repo }) =>
      getRepoOpenIssuesCount(org, repo).pipe(startWith(SUSPENSE))
    )
  )
)

const issueSelected$ = new Subject<number | null>()
export const onIssueSelected = (id: number) => {
  issueSelected$.next(id)
}
export const onIssueUnselecteed = () => {
  issueSelected$.next(null)
}

export const [useSelectedIssueId, selectedIssueId$] = bind(
  issueSelected$.pipe(startWith(null))
)

export const [useIssue, issue$] = bind(
  selectedIssueId$.pipe(
    filter((id): id is number => id !== null),
    withLatestFrom(currentRepo$),
    switchMap(([id, { org, repo }]) =>
      getIssue(org, repo, id).pipe(startWith(SUSPENSE))
    )
  )
)

export const [useIssueComments] = bind(
  issue$.pipe(
    filter((issue): issue is Issue => issue !== SUSPENSE),
    pluck('comments_url'),
    switchMap((url) => getComments(url).pipe(startWith(SUSPENSE)))
  )
)
