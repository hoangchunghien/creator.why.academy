/**
 * Created by Hien on 5/31/2014.
 */

angular.module('creator.utils.service', [

])
    .directive('jqueryDatatable', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                if (scope.$last) {
                    $timeout(function () {
                        $(document).ready(function () {
                            attrs.$observe('jqueryDatatable', function (value) {
                                if (value) {
                                    var tbElem = $('#' + value);
                                    var unSortCols = attrs.unSortCols || "";
                                    console.log(unSortCols);
                                    var dtTableProperties = {
                                        "iDisplayLength": 100
                                    };
                                    if (unSortCols !== "") {
                                        dtTableProperties["aoColumnDefs"] = [
                                            { 'bSortable': false, 'aTargets': unSortCols.split(',').map(Number) }
                                        ]
                                    }
                                    var dtTable = tbElem.dataTable(dtTableProperties);
                                    var sCol = attrs.sortedCol || 0;
                                    var sType = attrs.sortedType || "asc";
                                    dtTable.fnSort([
                                        [sCol, sType]
                                    ]);
                                }
                            });
                        });
                    }, 0)
                }
            }
        }
    })

    .factory('utils', function () {
        return {
            // Util for finding an object by its 'id' property among an array
            findById: function (a, id) {
                console.log(JSON.stringify(a));
                for (var i = 0; i < a.length; i++) {
                    console.log(a[i]);
                    if (a[i].id == id) return a[i];
                }
                return null;
            },

            remove: function(array, id) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].id == id) {
                        array.splice(i, 1);
                    }
                }
            }
        };
    });