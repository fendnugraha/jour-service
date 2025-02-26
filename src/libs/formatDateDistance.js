import { formatDistanceToNow } from 'date-fns'

const TimeAgo = ({ timestamp }) => {
    return <span>{formatDistanceToNow(new Date(timestamp), { addSuffix: true })}</span>
}

export default TimeAgo
