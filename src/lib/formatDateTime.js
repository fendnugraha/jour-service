const formatDateTime = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true, // Use 12-hour format; set to false for 24-hour format
        timeZone: 'Asia/Jakarta',
    })
}

export default formatDateTime
