define(
	"sb/base/observable/newSplitedArray",
	[
		"sb/base/observable/newObservableArray"
	],
	function(newObservableArray) {

		/**
		 * @class Diff
		 * @private
		 * @constructor
		 */
		function Diff(commons, addeds, deleteds) {
			this.getCommons = function() {
				return commons
			};

			this.getAddeds = function() {
				return addeds;
			};

			this.getDeleteds = function() {
				return deleteds;
			};
		}

		/**
		 * Get diffrence of two arrays.
		 * @private
		 * @method arrayDiff
		 * @param {Array} array1 first array
		 * @param {Array} array2 second array
		 * @return {Diff} diffrence of two arrays
		 */
		function arrayDiff(arry1, arry2) {
			var commons = [];
			var addeds = [];
			var deleteds = [];
		}

		/**
		 * Create splited observable array.
		 * @method sb.base.observable.newSplitedArray
		 * @public
		 * @static
		 * @param {sb.base.binding.Observer}} observer registed observer
		 * @param {function(Object):Number}
		 * @param {Array.<*>} initArray initial value of array
		 * @return {sb.base.observable.SplitedArray} created splited observable array
		 */
		function newSplitedArray(observer, strategy, initArray) {

			// internal array
			var array = initArray;
			if (!(array instanceof Array)) {
				array = [];
			}

		}

		return newSplitedArray;
	}
);
