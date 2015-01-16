'use strict';

angular.module('electionPollsApp')
 .directive('pollSelect', ['$document', function($document){
	// Runs during compile
	return {
		link: function($scope, iElm, iAttrs, controller) {
			var showList = function(event) {
				if(isSelf(event)) {
					angular.element('#poll-list').removeClass('collapsed');
					$document.bind('click', hideList);
				}
			}

			var hideList = function(event) {
        if (!isSelf(event)) {
          angular.element('#poll-list').addClass('collapsed');
          $document.unbind('click', hideList);
        }
			}

			var isSelf = function(event) {
				return iElm[0] == event.target || event.target.id == "selected-poll"
			}

			iElm.on('click',showList);
			$document.bind('click', hideList);
		}
	}
}]);