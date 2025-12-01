import * as React from "react"

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

export function Checkbox(props: CheckboxProps) {
    return <input type="checkbox" {...props} />
}
