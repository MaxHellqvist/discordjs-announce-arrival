import { db } from "./firebase";

//ANNOUNCEMENT MODULE
export const registerAnnouncement = (userID: string, audioUrl: string, volume: number) => {
    db.child(`announceArrival/registeredTargets/${userID}`).set({ audioUrl });
    db.child(`announceArrival/registeredTargets/${userID}`).set({ volume });
}

export const getAnnouncement = async (userID: string) => {
    return db.child(`announceArrival/registeredTargets/${userID}`).get()
        .then((snap) => {
            return snap.val();
        })
}

export const setVolume = (userID: string, volume: number) => {
    db.child(`announceArrival/registeredTargets/${userID}`).update({ volume });
}

export const setLastPlayed = (userID: string, lastPlayed: number) => {
    db.child(`announceArrival/registeredTargets/${userID}`).update({ lastPlayed });
}

export const setGlobalCooldown = (globalCooldown: number) => {
    db.child(`announceArrival/globalCooldown`).set(globalCooldown);
}

export const getGlobalCooldown = () => {
    return db.child(`announceArrival/globalCooldown`).get()
        .then((snap) => {
            return snap.val();
        })
}

//GENERAL
export const setActive = (isActive: boolean, module: string) => {
    db.child(`${module}/isActive`).set(isActive);
}

export const getActive = async (module: string) => {
    return db.child(`${module}/isActive`).get()
        .then((snap) => {
            return snap.val();
        })
}