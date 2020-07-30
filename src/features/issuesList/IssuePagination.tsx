import React, { Suspense } from 'react'
import classnames from 'classnames'
import Paginate from 'react-paginate'

import styles from './IssuePagination.module.css'
import './IssuePagination.css'
import { useCurrentPage, useIssues, onPageChange } from 'state'

const IssuePaginationLoaded = () => {
  const currentPage = useCurrentPage()
  const { pageCount } = useIssues()

  return pageCount === 0 ? null : (
    <div className={classnames('issuesPagination', styles.pagination)}>
      <Paginate
        forcePage={currentPage - 1}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        nextLabel="&rarr;"
        previousLabel="&larr;"
      />
    </div>
  )
}

export const IssuePagination = () => (
  <Suspense fallback={null}>
    <IssuePaginationLoaded />
  </Suspense>
)
