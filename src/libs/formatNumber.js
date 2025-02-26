const formatNumber = number => {
    return new Intl.NumberFormat('id-ID').format(number)
}

export default formatNumber
