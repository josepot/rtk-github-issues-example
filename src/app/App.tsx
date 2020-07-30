import React, { Suspense, lazy } from 'react'

import './App.css'
import { RepoSearchForm } from 'features/repoSearch/RepoSearchForm'
import { IssuesListPage } from 'features/issuesList/IssuesListPage'
import { useSelectedIssueId } from 'state'

const IssueDetailsPage = lazy(() =>
  import('features/issueDetails/IssueDetailsPage')
)

const List: React.FC = () => {
  const id = useSelectedIssueId()
  return id !== null ? null : (
    <>
      <RepoSearchForm />
      <IssuesListPage />
    </>
  )
}

const App: React.FC = () => {
  return (
    <div className="App">
      <List />
      <Suspense fallback={null}>
        <IssueDetailsPage />
      </Suspense>
    </div>
  )
}

export default App
