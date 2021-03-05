import { db } from "./firebase";

export const registerAnnouncement = (userID: string, audioUrl: string) => {
    db.child(`registeredTargets/${userID}`).set({ audioUrl });
}

export const getAnnouncement = async (userID: string) => {
    return db.child(`registeredTargets/${userID}`).get()
        .then((snap) => {
            return snap.val();
        })
}

export const setActive = (isActive: boolean) => {
    db.child(`isActive`).set(isActive);
}

export const getActive = async () => {
    return db.child(`isActive`).get()
    .then((snap) => {
        return snap.val();
    })
}