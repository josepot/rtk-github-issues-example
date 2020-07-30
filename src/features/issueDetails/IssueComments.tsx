import React from 'react'
import ReactMarkdown from 'react-markdown'

import { insertMentionLinks } from 'utils/stringUtils'
import { Comment } from 'api/githubAPI'
import { UserWithAvatar } from 'components/UserWithAvatar'

import styles from './IssueComments.module.css'
import { useIssueComments } from 'state'

interface ICProps {
  comment: Comment
}

function IssueComment({ comment }: ICProps) {
  return (
    <div className={styles.comment}>
      <UserWithAvatar
        user={comment.user}
        classes={{ avatar: styles.avatar, username: styles.username }}
        orientation="horizontal"
      />

      <div className={styles.body}>
        <ReactMarkdown
          className="markdown"
          source={insertMentionLinks(comment.body)}
        />
      </div>
    </div>
  )
}

export const IssueComments: React.FC = () => {
  const comments = useIssueComments()
  return (
    <ul className={styles.commentsList}>
      {comments.map((comment) => (
        <li key={comment.id}>
          <IssueComment comment={comment} />
        </li>
      ))}
    </ul>
  )
}
