'use strict';

angular.module('electionPollsApp')
 .directive('pollSelect', ['$document', function($document){
	// Runs during compile
	return {
		link: function($scope, iElm, iAttrs, controller) {
			var showList = function() {
				angular.element('#poll-list').removeClass('collapsed');
				$document.bind('click', hideList);
			}

			var hideList = function(event) {
				var isChild = iElm.has(event.target).length > 0;
        var isSelf = iElm[0] == event.target;
        var isInside = isChild || isSelf;
        var list = angular.element('#poll-list');
        var collapsed = list.hasClass('collapsed');
        if (!isInside) {
          angular.element('#poll-list').addClass('collapsed');
          $document.unbind('click', hideList);
        }
			}

			angular.element('#switch-poll').on('click',showList);	
		}
	}
}]);