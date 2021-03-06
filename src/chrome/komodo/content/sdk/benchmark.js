/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Benchmark APIs -- wraps around the XPCOM koIBenchmark service.
 */
const {Cc, Ci} = require("chrome");

var koBenchmark = Cc["@activestate.com/koBenchmark;1"].getService(Ci.koIBenchmark);

    /**
     * Records the start time for the given event name.
     */
exports.startTiming = function(name) {
    return koBenchmark.startTiming(name);
}

    /**
     * Records the end time for the given event name. Must have a matching startTiming call.
     */
exports.endTiming = function(name) {
    return koBenchmark.endTiming(name)
}

    /**
     * Reports that the given event took the given time duration.
     */
exports.addTiming = function(name, duration) {
    return koBenchmark.addTiming(name, duration);
}

    /**
     * Reports an event occurred (at the current time).
     */
exports.addEvent = function(name) {
    return koBenchmark.addEvent(name);
}

    /**
     * Accumulate the number of calls and duration for this name.
     */
exports.accumulate = function(name, duration) {
    return koBenchmark.accumulate(name, duration);
}

    /**
     * Reports an event occurred at the given time.
     */
exports.addEventAtTime = function(name, t) {
    return koBenchmark.addEventAtTime(name, t);
}

    /**
     * Dump current benchmark results to stdout.
     */
exports.display = function() {
    return koBenchmark.display();
}
