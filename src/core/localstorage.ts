const KEY = "my_local_storage_key"

export const getStorageObj = () => {
    const objStr = localStorage.getItem(KEY) as string
    let obj = {}
    try {
        obj = JSON.parse(objStr) || {}
    } finally {
        return obj
    }
}

export const setStorageObj = (obj: {}) => {
    localStorage.setItem(KEY, JSON.stringify(obj))
}
