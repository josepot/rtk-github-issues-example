import React, { useEffect } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

import { IssuesPageHeader } from './IssuesPageHeader'
import { IssuesList } from './IssuesList'
import { IssuePagination } from './IssuePagination'
import { currentRepoAndPage$ } from 'state'
import { skip, take } from 'rxjs/operators'

const OnError: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  useEffect(() => {
    const subscription = currentRepoAndPage$
      .pipe(skip(1), take(1))
      .subscribe(resetErrorBoundary)
    return () => subscription.unsubscribe()
  }, [resetErrorBoundary])
  return (
    <div>
      <h1>Something went wrong...</h1>
      <div>{error && error.message}</div>
    </div>
  )
}

export const IssuesListPage = () => {
  return (
    <ErrorBoundary FallbackComponent={OnError}>
      <div id="issue-list-page">
        <IssuesPageHeader />
        <IssuesList />
        <IssuePagination />
      </div>
    </ErrorBoundary>
  )
}
