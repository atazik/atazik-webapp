"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusLabel = getStatusLabel;
function getStatusLabel(status, emailVerified) {
    if (!status) {
        return "Inconnu";
    }
    if (status === "activated" /* UserStatusEnum.ACTIVATED */) {
        return emailVerified ? "Activé" : "E-mail non vérifié";
    }
    else if (status === "invited" /* UserStatusEnum.INVITED */) {
        return "Invité";
    }
    else {
        return "Inconnu";
    }
}
//# sourceMappingURL=user-status.utils.js.map