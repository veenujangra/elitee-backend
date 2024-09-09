function dateRangeQuery(startDate, endDate) {
  
    var date1 = new Date(startDate);
    date1.setUTCHours(0, 0, 0, 0); // Set UTC time to 00:00:00

    // var endDate = new Date('2024-03-21');
    var date2 = new Date(endDate);
    date2.setUTCHours(23, 59, 59, 999); // Set UTC time to 23:59:59.999

    return {
        $gte: date1,
        $lt: date2
    };
}

module.exports = {
    dateRangeQuery
};
