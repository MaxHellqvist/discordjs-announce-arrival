import { db } from "./firebase";

export const registerAnnouncement = (userID: string, audioUrl: string, volume: number) => {
    db.child(`registeredTargets/${userID}`).set({ audioUrl });
    db.child(`registeredTargets/${userID}`).set({ volume });
}

export const getAnnouncement = async (userID: string) => {
    return db.child(`registeredTargets/${userID}`).get()
        .then((snap) => {
            return snap.val();
        })
}

export const setVolume = (userID: string, volume: number) => {
    db.child(`registeredTargets/${userID}`).update({ volume });
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