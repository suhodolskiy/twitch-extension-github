import { h } from 'hyperapp'
import './select-base.scss'

import IconArrow from '../Icons/IconArrow'

export default ({
  name,
  label,
  value,
  options = [],
  placeholder,
  onChange,
}) => (
  <label className="select-base">
    <span className="select-base__label">{label}</span>
    <div className="select-base__wrapper">
      <select
        name={name}
        id={name}
        onchange={(event) =>
          typeof onChange === 'function' && onChange(event.target.value)
        }
      >
        {placeholder && (
          <option value="" disabled selected>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option value={option.value} selected={option.value === value}>
            {option.label}
          </option>
        ))}
      </select>
      <IconArrow className="select-base__arrow" />
    </div>
  </label>
)
