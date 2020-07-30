import { Subject, merge } from 'rxjs'
import { startWith, withLatestFrom, map, pluck, filter } from 'rxjs/operators'
import {
  bind,
  switchMapSuspended,
  shareLatest,
  SUSPENSE,
} from '@react-rxjs/core'
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
    filter((page) => page > 0),
    withLatestFrom(currentRepo$),
    map(([page, repo]) => ({ ...repo, page }))
  )
).pipe(shareLatest())

export const [useCurrentPage] = bind(currentRepoAndPage$.pipe(pluck('page')))

export const [useIssues] = bind(
  currentRepoAndPage$.pipe(
    switchMapSuspended(({ page, repo, org }) => getIssues(org, repo, page))
  )
)

export const [useCurrentRepoOpenIssuesCount] = bind(
  currentRepo$.pipe(
    switchMapSuspended(({ org, repo }) => getRepoOpenIssuesCount(org, repo))
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
    switchMapSuspended(([id, { org, repo }]) => getIssue(org, repo, id))
  )
)

export const [useIssueComments] = bind(
  issue$.pipe(
    filter((issue): issue is Issue => issue !== SUSPENSE),
    pluck('comments_url'),
    switchMapSuspended(getComments)
  )
)
