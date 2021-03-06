'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _MinimalTaskReporter = require('./reporters/MinimalTaskReporter');

var _MinimalTaskReporter2 = _interopRequireDefault(_MinimalTaskReporter);

var _TaskReporter = require('./reporters/TaskReporter');

var _TaskReporter2 = _interopRequireDefault(_TaskReporter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Log = function () {

    /**
     * Create a new Logger instance.
     */
    function Log() {
        _classCallCheck(this, Log);

        this.minimal = _gulpUtil2.default.env.minimal;
    }

    /**
     * Log a heading to the console.
     *
     * @param  {string} heading
     * @return {this}
     */


    _createClass(Log, [{
        key: 'heading',
        value: function heading(_heading) {
            return this.break().message(_gulpUtil2.default.colors.black(_gulpUtil2.default.colors.bgGreen(_heading)));
        }
    }, {
        key: 'task',


        /**
         * Report the stats for the given task.
         *
         * @param {Task} task
         */
        value: function task(_task) {
            this.getReporter().report(_task);
        }

        /**
         * Report the stats for all registered tasks.
         */

    }, {
        key: 'tasks',
        value: function tasks() {
            this.getReporter().report();
        }

        /**
         * Get the task reporter instance.
         *
         * @return {TaskReporter}
         */

    }, {
        key: 'getReporter',
        value: function getReporter() {
            if (!this.reporter) {
                this.reporter = this.minimal ? new _MinimalTaskReporter2.default() : new _TaskReporter2.default();
            }

            return this.reporter;
        }

        /**
         * Log a general message to the console.
         *
         * @param  {string} message
         * @return {this}
         */

    }, {
        key: 'message',
        value: function message(_message) {
            if (this.shouldBeMuted()) {
                return this;
            }

            console.log(_message);

            return this;
        }
    }, {
        key: 'status',


        /**
         * Log a heading and message to the console.
         *
         * @param  {string}      heading
         * @param  {string|null} message
         * @return {this}
         */
        value: function status(heading, message) {
            this.heading(heading);

            message && this.message(message);

            return this;
        }

        /**
         * Log an error message to the console.
         *
         * @param {string} message
         */

    }, {
        key: 'error',
        value: function error(message) {
            this.break().message(_gulpUtil2.default.colors.bgRed(message));

            return this;
        }

        /**
         * Format a console command that should be run.
         *
         * @param  {string} command
         * @return {this}
         */

    }, {
        key: 'command',
        value: function command(_command) {
            this.divider().message(_command).divider();

            return this;
        }

        /**
         * Print a long divider to the console.
         *
         * @return {this}
         */

    }, {
        key: 'divider',
        value: function divider() {
            this.message('=======================================================');

            return this;
        }

        /**
         * Add a line break to the console output.
         *
         * @return {this}
         */

    }, {
        key: 'break',
        value: function _break() {
            console.log(''); // line break

            return this;
        }

        /**
         * Determine if we're in test-mode.
         *
         * @return {boolean}
         */

    }, {
        key: 'shouldBeMuted',
        value: function shouldBeMuted() {
            return Elixir.config.muted;
        }
    }]);

    return Log;
}();

exports.default = Log;