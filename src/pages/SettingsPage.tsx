import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'

export function SettingsPage() {
  const { logout } = useAuth()
  const { uiVersion, setUiVersion, resetAppData } = useShop()

  return (
    <>
      <h1>Settings</h1>

      <fieldset className="option-group">
        <legend>UI version</legend>
        <label htmlFor="ui-v1">
          <input
            id="ui-v1"
            type="radio"
            name="ui-version"
            data-testid="ui-version-v1"
            checked={uiVersion === 'v1'}
            onChange={() => setUiVersion('v1')}
          />
          v1
        </label>
        <label htmlFor="ui-v2">
          <input
            id="ui-v2"
            type="radio"
            name="ui-version"
            data-testid="ui-version-v2"
            checked={uiVersion === 'v2'}
            onChange={() => setUiVersion('v2')}
          />
          v2
        </label>
      </fieldset>
      <p>
        Current UI version: <strong data-testid="ui-version-current">{uiVersion}</strong>
      </p>

      <div className="button-row">
        <button type="button" className="secondary-button" data-testid="reset-data-button" onClick={resetAppData}>
          Reset app data
        </button>
        <button type="button" className="primary-button" data-testid="settings-logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </>
  )
}
