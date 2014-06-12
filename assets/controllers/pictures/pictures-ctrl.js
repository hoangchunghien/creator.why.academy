/**
 * Created by Hien on 5/31/2014.
 */

angular.module('creator.pictures.directive', [
    'ui.router',
    'creator.api.service',
    'creator.pictures.service'
])

    .directive('pictureUploader', function (picturesSrv) {
        return{
            restrict: 'A',
            templateUrl: '/views/pictures/pictures.uploader.html',
            link: function (scope, elem, attrs) {
                scope.returnElementId = attrs.returnElementId;
                scope.callElementId = attrs.callElementId;

                $("#" + scope.callElementId).click(function () {
                    $('#pictureUploader').modal('show');
                });

                $("#uploadingBtn").click(function () {
                    var file = document.getElementById('fPicture').files[0];
                    picturesSrv.upload(file, file.name.substring(0, file.name.lastIndexOf('.')),
                        function (progress) {
                            $('#uploadingBtn').button('loading');
                        },
                        function (response) {
                            var picture_url = response.photo.url;
                            $('#uploadingBtn').button('reset');
                            $('#' + scope.returnElementId).val(picture_url).trigger("change").blur();
                            $('#pictureUploader').modal('hide');
                            $('#txtUploadFileName').val("");
                            $('#fPicture').val(null);
                        }
                    );
                });
            }
        }
    });