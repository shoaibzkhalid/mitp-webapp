import { copyToClipboard } from "../../state/utils/copyToClipboard"
import { AppEnv } from "../../env"

export default function (data, setNotificationMessage) {
    copyToClipboard(`${AppEnv.webBaseUrl}/pot/${data.pot.slug}`)
    setNotificationMessage(`${AppEnv.webBaseUrl}/pot/${data.pot.slug}`)
    setTimeout(function () {
        setNotificationMessage('')
    }, 4000)
}