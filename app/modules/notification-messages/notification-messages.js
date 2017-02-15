/** @namespace */
var notificationModule = angular.module('notification-messages', []);


angular.module('notification-messages').provider('Notification', function() {
	//Default options
	 this.options = {
        container: 'body',
        position: 'right',
        infoMessageTimeout: 90*1000,
        maxNumber: 5,
        templateUrl: 'templates/notification-messages.html',
    };
    //Method to set options
    this.setOptions = function(options){
		if (angular.isObject(options)){
			this.options = angular.extend({}, this.options, options);
		}
    }
    var startRight = 10;
    var startTop = 10;
    var verticalSpacing = 10;
   
    this.$get = function($timeout, $http, $compile, $templateCache, $rootScope, $injector, $sce, $q, $window) {
    	var notificationElements = [];
    	var options = this.options;
    	 /**
	      * @memberof notificationModule
	      * @ngdoc main
	      * @name fixPositions
	      * @desc Fix notification positions
	     */
    	var fixPositions = function(){
    		var j = 0;
            var k = 0;
            var lastTop = startTop;
            var lastRight = startRight;
            var lastPosition = 0;
            for(var i = notificationElements.length - 1; i >= 0; i --) {
                var element  = notificationElements[i];
                var elHeight = parseInt(element[0].offsetHeight);
                var elWidth  = parseInt(element[0].offsetWidth);
                var position = lastPosition;
                if ((top + elHeight) > window.innerHeight) {
                    position = startTop;
                    k ++;
                    j = 0;
                }
                var top = (lastTop = position ? (j === 0 ? position : position + verticalSpacing) : startTop);
                var horizontalSpace = lastRight + (k * (elWidth));
                element.css('top', top + 'px');
                element.css(options.position, horizontalSpace + 'px');
                lastPosition = top + elHeight;
                if (options.maxCount > 0 && notificationElements.length > options.maxCount && i === 0) {
                    element.scope().kill(true);
                }
                j++;
            }
    	}
    	/**
		   * @memberof notificationModule
		   * @ngdoc main
		   * @name notify
		   * @class notify
		   * @param {$object} params notification params, available keys are  "title", "body", "timeout" 
		   * @param {$string} type type of notification (warning|error|info)
		   * @desc Method to add notification messages
		   * of a site.
		   *
	     */
        var notify = function(params, type){
        	var deferred = $q.defer();
        	var scope = params.scope?params.scope.$new():$rootScope.$new();
        	if ( type === 'info' ){
            	params.timeout = params.timeout?params.timeout:options.infoMessageTimeout;
            }	
        	scope.body = $sce.trustAsHtml(params.body);
            scope.title = $sce.trustAsHtml(params.title);
            scope.timeout = params.timeout
            scope.type = type;
            if ( notificationElements.length >= options.maxNumber ){
            	var popedElement =notificationElements.shift();
            	popedElement.remove();
            }
        	$http.get(options.templateUrl,{cache: $templateCache}).success(function(template) {
        		
        		var templateElement = $compile(template)(scope);
	        	angular.element(document.querySelector(options.container)).append(templateElement);
                notificationElements.push(templateElement);
                /**
				   * @memberof notify
				   * @ngdoc main
				   * @name close
				   * @class close
				   * @desc method to remove current notification element
				   *
			     */
	        	var close = function() {
                    templateElement.remove();
                    scope.$destroy();
                    notificationElements.splice(notificationElements.indexOf(templateElement), 1);
                    fixPositions();
                };
                //Append close button into notification block
                var closeButton = angular.element('<div></div>');
                closeButton.addClass('close-button');
                closeButton.bind('click', close);
	        	templateElement.append(closeButton);
	        	templateElement.addClass(type);
	        	//Gave initical position for message to hide from visible area
	        	var offset = -(parseInt(templateElement[0].offsetHeight) + 50);
                templateElement.css('top', offset + "px");
                templateElement.css(options.position, startRight + "px");
				$timeout(fixPositions);
	        	if (scope.timeout) {
                    $timeout(function() {
                        closeButton[0].click();
                    }, scope.timeout);
                }
	        	deferred.resolve(scope);
        	}).error(function(data){
                throw new Error('Invalid Template: ' + data);
            });
        	return deferred.promise;
        }
         /**
	      * @memberof notify
	      * @method info
	      * @param {object} params notification params, available keys are  "title", "body", "timeout" 
	     */
        notify.info = function(params){
        	return this( params, 'info' );
        }
         /**
	      * @memberof notify
	      * @method warning
	      * @param {object} params notification params, available keys are  "title", "body", "timeout" 
	     */
        notify.warning = function(params){
        	return this( params, 'warning' );
        }
         /**
	      * @memberof notify
	      * @method error
	      * @param {object} params notification params, available keys are  "title", "body", "timeout" 
	     */
        notify.error = function(params){
        	return this( params, 'error' );
        }
        return notify;
    };
})