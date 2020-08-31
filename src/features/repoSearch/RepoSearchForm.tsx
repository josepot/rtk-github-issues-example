import React, { useState, ChangeEvent } from 'react'

import './pure-forms.css'
import './pure-buttons.css'
import {
  useCurrentPage,
  onLoadRepo,
  onPageChange,
  INITIAL_REPO,
  INITIAL_ORG,
} from 'state'

type InputEvent = ChangeEvent<HTMLInputElement>
type ChangeHandler = (e: InputEvent) => void

export const RepoSearchForm: React.FC = () => {
  const [currentOrg, setCurrentOrg] = useState(INITIAL_ORG)
  const [currentRepo, setCurrentRepo] = useState(INITIAL_REPO)
  const page = useCurrentPage()
  const [currentPageText, setCurrentPageText] = useState(page.toString())

  const onOrgChanged: ChangeHandler = e => {
    setCurrentOrg(e.target.value)
  }

  const onRepoChanged: ChangeHandler = e => {
    setCurrentRepo(e.target.value)
  }

  const onCurrentPageChanged: ChangeHandler = e => {
    setCurrentPageText(e.target.value)
  }

  const onLoadRepoClicked = () => {
    onLoadRepo(currentOrg, currentRepo)
  }

  const onJumpToPageClicked = () => {
    const newPage = parseInt(currentPageText)

    if (newPage >= 1) {
      onPageChange(newPage)
    }
  }

  return (
    <form className="pure-form">
      <div>
        <label htmlFor="org" style={{ marginRight: 5 }}>
          Org:
        </label>
        <input name="org" value={currentOrg} onChange={onOrgChanged} />
        <label htmlFor="repo" style={{ marginRight: 5, marginLeft: 10 }}>
          Repo:
        </label>
        <input name="repo" value={currentRepo} onChange={onRepoChanged} />
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={onLoadRepoClicked}
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
          onChange={onCurrentPageChanged}
        />
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={onJumpToPageClicked}
        >
          Jump to Page
        </button>
      </div>
    </form>
  )
}
