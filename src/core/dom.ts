/** Create element node tree with props */
export const $ = <K extends keyof HTMLElementTagNameMap>(
    name: K,
    props: Partial<HTMLElementTagNameMap[K]> = {},
    ...children: (string | Node)[]
) => {
    const ele = document.createElement(name)
    for (let k in props) {
        ele[k] = props[k]!
    }
    if (props.style) {
        for (let k in props.style) {
            ele.style[k] = props.style[k]
        }
    }
    ele.append(...children)
    return ele
}

const panel = document.querySelector("#debug details") as HTMLDetailsElement

export const addToDebugPanel = (ele: Element) => panel.appendChild(ele)
