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