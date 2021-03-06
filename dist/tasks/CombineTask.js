'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CombineTask = function (_Elixir$Task) {
    _inherits(CombineTask, _Elixir$Task);

    /**
     * Create a new CombineTask instance.
     *
     * @param {string} name
     * @param {GulpPaths} paths
     */
    function CombineTask(name, paths) {
        _classCallCheck(this, CombineTask);

        return _possibleConstructorReturn(this, (CombineTask.__proto__ || Object.getPrototypeOf(CombineTask)).call(this, name, null, paths));
    }

    /**
     * Build the Gulp task.
     */


    _createClass(CombineTask, [{
        key: 'gulpTask',
        value: function gulpTask() {
            // The mix.combine() task should only
            // concat the files. That's it.
            if (this.name == 'combine') {
                return gulp.src(this.src.path).pipe(this.concat()).on('error', this.onError()).pipe(this.saveAs(gulp)).pipe(this.onSuccess('Assets Combined!'));
            }

            // Otherwise, for mix.scripts() and mix.styles(),
            // we can also apply source maps and minification.
            return gulp.src(this.src.path).pipe(this.initSourceMaps()).pipe(this.concat()).pipe(this.minify()).on('error', this.onError()).pipe(this.writeSourceMaps()).pipe(this.saveAs(gulp)).pipe(this.onSuccess('Assets Combined!'));
        }

        /**
         * Register file watchers.
         */

    }, {
        key: 'registerWatchers',
        value: function registerWatchers() {
            this.watch(this.src.path).ignore(this.output.path);
        }
    }]);

    return CombineTask;
}(Elixir.Task);

exports.default = CombineTask;