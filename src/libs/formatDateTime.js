const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false, // Use 12-hour format; set to false for 24-hour format
        timeZone: "Asia/Jakarta",
    });
};

export default formatDateTime;
