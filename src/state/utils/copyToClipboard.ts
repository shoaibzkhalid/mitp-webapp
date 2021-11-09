export function copyToClipboard(str: string) {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(str)
		return true
	}
	return false
}
