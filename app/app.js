angular.module('demo', ['notification-messages'])
	.config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            position: 'right',
        });
    });

angular.module('demo').controller('mainController',['$scope', 'Notification', function($scope, Notification){
		$scope.categories = [{
		  id: 'info',
		  label: 'Info'
		}, {
		  id: 'warning',
		  label: 'Warning'
		}, {
		  id: 'error',
		  label: 'Error'
		}];


		$scope.notify = function(){			
			Notification[$scope.category.id].apply(Notification, [{body: $scope.body, title: $scope.title}]);
		}
}]);
