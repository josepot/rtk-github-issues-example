import React, { Suspense } from 'react'
import { useCurrentRepoOpenIssuesCount, useCurrentRepo } from 'state'

function OrgRepo() {
  const { org, repo } = useCurrentRepo()
  return (
    <span>
      <a href={`https://github.com/${org}`} className="header__org">
        {org}
      </a>
      {' / '}
      <a href={`https://github.com/${org}/${repo}`} className="header__repo">
        {repo}
      </a>
    </span>
  )
}

function OpenIssues() {
  const openIssuesCount = useCurrentRepoOpenIssuesCount()
  return (
    <>
      <span className="header__openIssues">{openIssuesCount}</span> open{' '}
      {openIssuesCount === 1 ? 'issue' : 'issues'} for {}
    </>
  )
}

export function IssuesPageHeader() {
  return (
    <h1>
      <Suspense fallback={'Open issues for '}>
        <OpenIssues />
      </Suspense>
      <OrgRepo />
    </h1>
  )
}
