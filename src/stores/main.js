import { defineStore } from 'pinia'

export const useMain = defineStore('main-store', {
    state: () => {
        return {
            inverterSN: '96342210104155',
            userEmail: 'andrei.iordache.pfa@gmail.com',
            mainData: {},
        }
    },

    getters: {
        invData(state) {
            return state.mainData
        },
        invSN(state) {
            return state.inverterSN
        },
    },

    actions: {
        assignNewData(payload) {
            this.mainData = payload
        },
        assignNewSN(payload) {
            this.inverterSN = payload
        },
    },
})
