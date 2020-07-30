import React, { Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import classnames from 'classnames'

import { insertMentionLinks } from 'utils/stringUtils'
import { IssueLabels } from 'components/IssueLabels'

import { IssueMeta } from './IssueMeta'
import { IssueComments } from './IssueComments'

import styles from './IssueDetailsPage.module.css'
import './IssueDetailsPage.css'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { onIssueUnselecteed, useIssue, useSelectedIssueId } from 'state'

const Comments: React.FC = () => {
  const { comments } = useIssue()
  return comments === 0 ? (
    <div className="issue-detail--no-comments">No comments</div>
  ) : (
    <Suspense
      fallback={
        <div className="issue-detail--comments-loading">Coments loading...</div>
      }
    >
      <IssueComments />
    </Suspense>
  )
}

const BackButton = () => (
  <button className="pure-button" onClick={onIssueUnselecteed}>
    Back to Issues List
  </button>
)

const IssueDetails: React.FC = () => {
  const issue = useIssue()
  return (
    <div className={classnames('issueDetailsPage', styles.issueDetailsPage)}>
      <h1 className="issue-detail__title">{issue.title}</h1>
      <BackButton />
      <IssueMeta issue={issue} />
      <IssueLabels labels={issue.labels} className={styles.issueLabels} />
      <hr className={styles.divider} />
      <div className={styles.summary}>
        <ReactMarkdown
          className={'testing'}
          source={insertMentionLinks(issue.body)}
        />
      </div>
      <hr className={styles.divider} />
    </div>
  )
}

const Loading: React.FC = ({ children }) => (
  <div className="issue-detail--loading">
    <BackButton />
    {children}
  </div>
)

const IssueError: React.FC<FallbackProps> = ({ error }) => (
  <Loading>
    <p>Something went wrong...</p>
    <p>{error!.message}</p>
  </Loading>
)

const Issue: React.FC<{ id: number }> = ({ id }) => {
  return (
    <div>
      <ErrorBoundary FallbackComponent={IssueError}>
        <Suspense
          fallback={
            <Loading>
              <p>Loading issue #{id}...</p>
            </Loading>
          }
        >
          <IssueDetails />
          <Comments />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

const IssueDetailsPage: React.FC = () => {
  const id = useSelectedIssueId()
  return id === null ? null : <Issue id={id} />
}

export default IssueDetailsPage
