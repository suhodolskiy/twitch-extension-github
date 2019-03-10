import { h } from 'hyperapp'
import './input-base.scss'

export default ({ name, label, type, placeholder, value, onChange }) => (
  <label className="input-base">
    <span className="input-base__label">{label}</span>
    <div className="input-base__wrapper">
      <input
        placeholder={placeholder}
        oninput={(event) =>
          typeof onChange === 'function' && onChange(event.target.value)
        }
        value={value}
        type={type}
        name={name}
      />
    </div>
  </label>
)
