"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profiles = exports.status = void 0;
var status;
(function (status) {
    status[status["pending"] = 0] = "pending";
    status[status["approved"] = 1] = "approved";
    status[status["rejected"] = 2] = "rejected";
})(status = exports.status || (exports.status = {}));
var profiles;
(function (profiles) {
    profiles[profiles["unassigned"] = 0] = "unassigned";
    profiles[profiles["administrator"] = 1] = "administrator";
    profiles[profiles["client"] = 2] = "client";
})(profiles = exports.profiles || (exports.profiles = {}));
//# sourceMappingURL=index.enum.js.map