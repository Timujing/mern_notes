// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
export function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: "short",
        day: "numeric",
        year: "numeric"
    })
}