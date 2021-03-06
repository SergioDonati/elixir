'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vinylMap = require('vinyl-map2');

var _vinylMap2 = _interopRequireDefault(_vinylMap);

var _minifier = require('./utilities/minifier');

var _minifier2 = _interopRequireDefault(_minifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = function () {

    /**
     * Create a new Task instance.
     *
     * @param {string}    name
     * @param {Function}  gulpTask
     * @param {GulpPaths} paths
     */
    function Task(name, gulpTask, paths) {
        _classCallCheck(this, Task);

        this.name = name;
        this.watchers = [];
        this.isComplete = false;
        this.steps = [];

        if (!this.gulpTask) {
            this.gulpTask = gulpTask;
        }

        if (paths) {
            this.paths = paths;
            this.src = this.paths.src;
            this.output = this.paths.output;
        }

        this.register();
    }

    /**
     * Set the task to be called, when firing `Gulp`.
     *
     * @return {Task}
     */


    _createClass(Task, [{
        key: 'register',
        value: function register() {
            Elixir.tasks.push(this);

            this.registerWatchers && this.registerWatchers();

            return this;
        }

        /**
         * Get the "ucwords" version of the task name.
         *
         * @return {string}
         */

    }, {
        key: 'ucName',
        value: function ucName() {
            return this.name.substr(0, 1).toUpperCase() + this.name.substr(1);
        }

        /**
         * Set a path regex to watch for changes.
         *
         * @param  {string} regex
         * @param  {string} category
         * @return {Task}
         */

    }, {
        key: 'watch',
        value: function watch(regex) {
            var category = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

            if (regex) {
                this.watchers = this.watchers.concat(regex);
            }

            this.category = category;

            return this;
        }

        /**
         * Determine if the task has any watchers.
         *
         * @return {Boolean}
         */

    }, {
        key: 'hasWatchers',
        value: function hasWatchers() {
            return this.watchers.length > 0;
        }

        /**
         * Exclude the given path from the watcher.
         *
         * @param  {string} path
         * @return {Task}
         */

    }, {
        key: 'ignore',
        value: function ignore(path) {
            this.watchers.push(('!./' + path).replace('././', './'));

            return this;
        }

        /**
         * Execute the task.
         *
         * @return {function}
         */

    }, {
        key: 'run',
        value: function run() {
            var stream = this.gulpTask(Elixir.Plugins, Elixir.config);

            this.isComplete = true;

            this.log();

            return stream;
        }

        /**
         * An ordered list of the actions that occurred for the task.
         *
         * @return {string}
         */

    }, {
        key: 'summary',
        value: function summary() {
            var summary = this.steps.map(function (step, index) {
                return ++index + '. ' + step;
            }).join('\n');

            // Now that the summary has been prepared, we'll
            // clear out the steps for the next run-through.
            this.steps = [];

            return summary;
        }

        /**
         * Initialize the sourcemaps.
         *
         * @param {object} options
         */

    }, {
        key: 'initSourceMaps',
        value: function initSourceMaps() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (!Elixir.config.sourcemaps) {
                return this.stream();
            }

            return Elixir.Plugins.sourcemaps.init(options);
        }

        /**
         * Write to the sourcemaps file.
         */

    }, {
        key: 'writeSourceMaps',
        value: function writeSourceMaps() {
            if (!Elixir.config.sourcemaps) {
                return this.stream();
            }

            this.recordStep('Writing Source Maps');

            return Elixir.Plugins.sourcemaps.write('.');
        }

        /**
         * Minify the relevant CSS or JS files.
         */

    }, {
        key: 'minify',
        value: function minify() {
            if (!Elixir.inProduction) {
                return this.stream();
            }

            this.recordStep('Applying Minification');

            return (0, _minifier2.default)(this.output);
        }

        /**
         * Apply concatenation to the incoming stream.
         */

    }, {
        key: 'concat',
        value: function concat() {
            this.recordStep('Concatenating Files');

            return Elixir.Plugins.concat(this.output.name);
        }

        /**
         * Set the destination path.
         *
         * @param {object} gulp
         */

    }, {
        key: 'saveAs',
        value: function saveAs(gulp) {
            this.recordStep('Saving to Destination');

            return gulp.dest(this.output.baseDir);
        }

        /**
         * Handle successful compilation.
         *
         * @param {string|null} message
         */

    }, {
        key: 'onSuccess',
        value: function onSuccess() {
            var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            message = message || this.ucName() + ' Compiled!';

            return new Elixir.Notification(message);
        }

        /**
         * Handle a compilation error.
         *
         * @return {function}
         */

    }, {
        key: 'onError',
        value: function onError() {
            var task = this.ucName();

            return function (e) {
                new Elixir.Notification().error(e, task + ' Compilation Failed!');

                Elixir.isWatching() ? this.emit('end') : process.exit(1);
            };
        }

        /**
         * Log the task input and output.
         *
         * @param {string|null} message
         */

    }, {
        key: 'log',
        value: function log() {
            var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (message) {
                return Elixir.log.status(message);
            }

            // As long as we're not triggering the entire
            // suite, we can log the stats for this task.
            if (!Elixir.isRunningAllTasks) {
                Elixir.log.task(this);
            }
        }

        /**
         * Record a step to the summary list.
         *
         * @param {string} message
         */

    }, {
        key: 'recordStep',
        value: function recordStep(message) {
            if (this.steps.indexOf(message) == -1) {
                this.steps.push(message);
            }
        }

        /**
         * Get a generic stream to return.
         */

    }, {
        key: 'stream',
        value: function stream() {
            return (0, _vinylMap2.default)(function () {});
        }
    }]);

    return Task;
}();

exports.default = Task;