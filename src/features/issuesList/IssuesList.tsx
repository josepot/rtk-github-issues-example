import React, { Suspense } from 'react'

import { IssueListItem } from './IssueListItem'

import styles from './IssuesList.module.css'
import { useIssues } from 'state'

const IssuesListLoaded = () => {
  const { issues } = useIssues()
  const renderedIssues = issues.map((issue) => (
    <li key={issue.id}>
      <IssueListItem {...issue} />
    </li>
  ))

  return <ul className={styles.issuesList}>{renderedIssues}</ul>
}

export const IssuesList = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <IssuesListLoaded />
  </Suspense>
)
