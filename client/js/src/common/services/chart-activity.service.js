/**
 * @name Activity Graph service
 * @description formats data for activity graph
 * @param {object} Angular module with dependencies
 **/

(function() {

    angular
        .module('common')
        .service('activityService', ChartActivityService);

    /* @ngInject */
    function ChartActivityService($rootScope, $timeout) {


        /**
         * Bindable
         */
        this.formatActivityData = formatActivityData;

        /**
         * Format activity data by day
         * @param {array} array of activity data
         * @param {object} date object containing to and from date properties
         * @return {object} object of formated data and labels
         */
        function formatByDay(data, dates, average) {
            var formattedData = {
                labels: [],
                data: [
                    []
                ]
            };

            var currentDate;
            var high = -1;
            var low = 1;

            for (var i = 0; i < data.length; i++) {
                currentDate = moment(dates.from, 'YYYY-MM-DD').add(i, 'days').format('MMM DD');
                formattedData.labels.push(currentDate);
                formattedData.data[0].push(data[i]);

                if (data[i] > high) {
                    high = data[i];
                }

                if (data[i] < low) {
                    low = data[i];
                }
            }

            formattedData.high = high;
            formattedData.low = low;

            return formattedData;
        }

        /**
         * Format activity data by week
         * @param {array} array of activity data
         * @param {object} date object containing to and from date properties
         * @return {object} object of formated data and labels
         */
        function formatByWeek(data, dates) {
            var formattedData = {
                labels: [],
                data: [
                    []
                ]
            };

            var currentDate;
            var high = -1;
            var low = 1;
            var activeWeek = 0;

            for (var i = 0; i < data.length; i++) {

                if (i % 7 === 0) {
                    currentDate = 'w/c ' + moment(dates.from, 'YYYY-MM-DD').add(activeWeek * 7, 'days').format('MMM DD');
                    formattedData.labels.push(currentDate);
                    formattedData.data[0].push(data[i]);
                    activeWeek++;
                } else {
                    formattedData.data[0][activeWeek - 1] = formattedData.data[0][activeWeek - 1] + data[i];
                }

            }

            for (var j = formattedData.data[0].length - 1; j >= 0; j--) {

                if (formattedData.data[0][j] > high) {
                    high = formattedData.data[0][j];
                }

                if (formattedData.data[0][j] < low) {
                    low = formattedData.data[0][j];
                }
            }

            formattedData.high = high;
            formattedData.low = low;

            return formattedData;
        }

        /**
         * Format activity data by month
         * @param {array} array of activity data
         * @param {object} date object containing to and from date properties
         * @return {object} object of formated data and labels
         */
        function formatByMonth(data, dates) {
            var formattedData = {
                labels: [],
                data: [
                    []
                ]
            };
            var currentDate;
            var high = -1;
            var low = 1;
            var activeMonth = 0;
            var currentMonth;

            for (var i = 0; i < data.length; i++) {
                currentDate = moment(dates.from, 'YYYY-MM-DD').add(i, 'days').format('MMM YYYY');
                if (currentDate === currentMonth) {
                    formattedData.data[0][activeMonth - 1] = formattedData.data[0][activeMonth - 1] + data[i];

                } else {
                    formattedData.labels.push(currentDate);
                    formattedData.data[0].push(data[i]);
                    currentMonth = currentDate;
                    activeMonth++;
                }
            }

            for (var j = formattedData.data[0].length - 1; j >= 0; j--) {
                if (formattedData.data[0][j] > high) {
                    high = formattedData.data[0][j];
                }

                if (formattedData.data[0][j] < low) {
                    low = formattedData.data[0][j];
                }
            }

            formattedData.high = high;
            formattedData.low = low;
            return formattedData;
        }


        /**
         * Determine activity scale and format to relevent format
         * @param {array} array of activity data
         * @param {object} date object containing to and from date properties
         * @return {object} object of formated data and labels
         */
        function formatActivityData(data, dates) {
            var arr = [];

            if (data instanceof Array) {
                arr = data;
            } else {
                for (var prop in data) {
                    arr.push(data[prop]);
                }
            }

            var arrayLength = arr.length,
                finalData = [];

            if (arrayLength < 28) {
                finalData = formatByDay(arr, dates);
            } else if (arrayLength < 160) {
                finalData = formatByWeek(arr, dates);
            } else {
                finalData = formatByMonth(arr, dates);
            }

            return finalData;
        }

    }



}());
