import React, { useState, useEffect } from 'react'
import './pure-forms.css'
import './pure-buttons.css'
import {
  useCurrentPage,
  onLoadRepo,
  onPageChange,
  INITIAL_REPO,
  INITIAL_ORG,
} from 'state'

export const RepoSearchForm = () => {
  const [currentOrg, setCurrentOrg] = useState(INITIAL_ORG)
  const [currentRepo, setCurrentRepo] = useState(INITIAL_REPO)

  const page = useCurrentPage()
  const [currentPageText, setCurrentPageText] = useState(page.toString(10))
  useEffect(() => {
    setCurrentPageText(page.toString(10))
  }, [page])

  return (
    <form className="pure-form">
      <div>
        <label htmlFor="org" style={{ marginRight: 5 }}>
          Org:
        </label>
        <input
          name="org"
          value={currentOrg}
          onChange={(e) => setCurrentOrg(e.target.value)}
        />
        <label htmlFor="repo" style={{ marginRight: 5, marginLeft: 10 }}>
          Repo:
        </label>
        <input
          name="repo"
          value={currentRepo}
          onChange={(e) => setCurrentRepo(e.target.value)}
        />
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={() => onLoadRepo(currentOrg, currentRepo)}
        >
          Load Repo
        </button>
      </div>
      <div style={{ marginTop: 5 }}>
        <label htmlFor="jumpToPage" style={{ marginRight: 5 }}>
          Issues Page:
        </label>
        <input
          name="jumpToPage"
          value={currentPageText}
          onChange={(e) => setCurrentPageText(e.target.value)}
        />
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={() => onPageChange(Number(currentPageText))}
        >
          Jump to Page
        </button>
      </div>
    </form>
  )
}
