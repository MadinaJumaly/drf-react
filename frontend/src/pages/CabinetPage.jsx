import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function CabinetPage() {
  const [client, setClient] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const username = localStorage.getItem('username')

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  useEffect(() => {
    api.getClient()
      .then((data) => {
        setClient(data)
        setForm(data)
      })
      .catch((err) => {
        if (err.status === 401) logout()
        else setError(err.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const updated = await api.updateClient(form)
      setClient(updated)
      setEditing(false)
    } catch (err) {
      if (err.status === 401) logout()
      else setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setForm(client)
    setEditing(false)
    setError('')
  }

  if (!client) return <div className="page">Loading...</div>

  return (
    <div className="page">
      <h1>Hello, {username}</h1>
      {error && <div className="error">{error}</div>}

      {!editing ? (
        <>
          <div className="field">
            <label>Name</label>
            <div>{client.name || <em>not set</em>}</div>
          </div>
          <div className="field">
            <label>Email</label>
            <div>{client.email || <em>not set</em>}</div>
          </div>
          <div className="field">
            <label>Phone</label>
            <div>{client.phone || <em>not set</em>}</div>
          </div>
          <div className="field">
            <label>Address</label>
            <div>{client.address || <em>not set</em>}</div>
          </div>
          <div className="row">
            <button className="btn" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn btn-secondary" onClick={logout}>Logout</button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSave}>
          <div className="field">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="row">
            <button type="submit" className="btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}