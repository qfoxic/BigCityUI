angular.module('bigcity.common.utils', [])
.service('utils', function () {
    return {
        groupByArray: function(arr, byField) {
            var grouped = {};
            angular.forEach(arr, function(val, key) {
                    var groupField = this[val[byField]];
                    if (!groupField) {groupField=[];}
                    groupField.push(val);
                    this[val[byField]] = groupField;
                }, grouped);
            return grouped;
        },
        flattenTree: function(parentArr, childArr) {
            var arr = [],
                dict = {},
                grouped = this.groupByArray(childArr, 'parent');
            angular.forEach(parentArr, function(val, key) {
                arr.push(val);
                dict[val.id] = val;
                angular.forEach(grouped[val.id], function(val, key) {
                        arr.push(val);
                        dict[val.id] = val;
                    });
                }, arr);
            return {flattenArr: arr, flattenDict: dict};
        }
   };
})
