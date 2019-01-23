import { h } from 'hyperapp'
import './input-base.scss'

export default ({ name, label, type, value, onChange }) => (
  <label className="input-base">
    <div className="input-base__label">{label}</div>
    <input
      oninput={(event) =>
        typeof onChange === 'function' && onChange(event.target.value)
      }
      value={value}
      type={type}
      name={name}
    />
  </label>
)
