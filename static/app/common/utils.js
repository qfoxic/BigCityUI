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
            var res = [],
                grouped = this.groupByArray(childArr, 'parent');
            angular.forEach(parentArr, function(val, key) {
                this.push(val);
                angular.forEach(grouped[val.id], function(val, key) {
                        this.push(val);
                    }, res);
                }, res);
            return res;
        }
   };
})
