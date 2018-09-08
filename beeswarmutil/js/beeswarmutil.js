(function() {

    var ONE_HOUR = 60 * 60,
        COUNTERS = [
            { 
                id: "redbooster",
                title: "Red Booster",
                type: "booster",
                img: "redbooster.jpg",
                time: ONE_HOUR * 2
            },
            { 
                id: "bluebooster",
                title: "Blue Booster",
                type: "booster",
                img: "bluebooster.jpg",
                time: ONE_HOUR * 2
            },
            { 
                id: "tmbooster",
                title: "Top Mountain Booster",
                type: "booster",
                img: "tmbooster.jpg",
                time: ONE_HOUR * 2
            },
            { 
                id: "treatdis",
                title: "Treat Dispenser",
                type: "consumable",
                img: "treatdispenser.jpg",
                time: ONE_HOUR
            },
            { 
                id: "reddis",
                title: "Red Dispenser",
                type: "consumable",
                img: "reddispenser.jpg",
                time: ONE_HOUR * 4
            },
            { 
                id: "bluedis",
                title: "Blue Dispenser",
                type: "consumable",
                img: "bluedispenser.jpg",
                time: ONE_HOUR * 4
            },
            { 
                id: "antdis",
                title: "Ant Dispenser",
                type: "consumable",
                img: "antdispenser.jpg",
                time: ONE_HOUR * 2
            },
            { 
                id: "blackbear",
                title: "Black Bear Quest",
                type: "various",
                img: "blackbear.jpg",
                time: ONE_HOUR
            },
            { 
                id: "werewolf",
                title: "Werewolf",
                type: "enemy",
                img: "werewolf.jpg",
                time: ONE_HOUR
            },
            { 
                id: "spider",
                title: "Spider",
                type: "enemy",
                img: "spider.jpg",
                time: ONE_HOUR / 2
            },
            { 
                id: "scorpion",
                title: "Scorpion",
                type: "enemy",
                img: "scorpion.jpg",
                time: ONE_HOUR / 3
            },
            { 
                id: "mantis",
                title: "Mantis",
                type: "enemy",
                img: "mantis.jpg",
                time: ONE_HOUR / 3
            },
            { 
                id: "kingbeetle",
                title: "King Beetle",
                type: "enemy",
                img: "kingbeetle.jpg",
                time: ONE_HOUR * 24
            },
            { 
                id: "clubdis",
                title: "The Club Dispenser",
                type: "various",
                img: "clubdispenser.jpg",
                time: ONE_HOUR
            },
            { 
                id: "royaljellydis",
                title: "Royal Jelly Dispenser",
                type: "consumable",
                img: "royeljellydis.jpg",
                time: ONE_HOUR * 24
            },
/*
            { 
                id: "tunnelbear",
                title: "Tunnel Bear",
                type: "enemy",
                img: "kingbeetle.jpg",
                time: ONE_HOUR * 48
            },
            { 
                id: "honeystorm",
                title: "Honey Storm",
                type: "consumable",
                img: "kingbeetle.jpg",
                time: ONE_HOUR * 4
            },
            { 
                id: "brownbear",
                title: "Brown Bear Daily Quest",
                type: "various",
                img: "kingbeetle.jpg",
                time: ONE_HOUR * 4 // TODO build something special for this !!
            },
*/
        ],
        STORAGE = {
            getObject : function(name) {
                try {
                    return ((JSON.parse(window.localStorage.getItem("bss-counter"))) || {});
                } catch(e) {
                    return {};
                }
            },
            setObject : function(name, object) {
                if(name && object) {
                    window.localStorage.setItem(name, JSON.stringify(object));
                }
            }
        },
        getNowInSeconds = function() {
            return Math.round(new Date().getTime()/1000);
        };

    Vue.filter("timeInHours", function(value) {
        let hours =  parseInt(Math.floor(value / 3600)); 
        let minutes = parseInt(Math.floor((value - (hours * 3600)) / 60)); 
        let seconds= parseInt((value - ((hours * 3600) + (minutes * 60))) % 60); 

        let dHours = (hours > 9 ? hours : "0" + hours);
        let dMins = (minutes > 9 ? minutes : "0" + minutes);
        let dSecs = (seconds > 9 ? seconds : "0" + seconds);

        return dHours + ":" + dMins + ":" + dSecs;
    });

    Vue.component("bss-counter", {
        props: ["config"],
        data: function () {
            return {
                secondsToGo: 0,
                startedAt: (STORAGE.getObject("bss-config")[this.config.id] || 0),
                interval: undefined,
                reset: 0
            }
        },
        methods: {
            start: function () {
                if(this.secondsToGo > 0) {
                    this.reset += 3;
                    if(this.reset > 6) {
                        this.stop();
                    }
                
                } else {
                    var bss = STORAGE.getObject("bss-config");
                    this.startedAt = getNowInSeconds();
                    bss[this.config.id] = this.startedAt;
                    STORAGE.setObject("bss-counter", bss);

                    this.doInterval();
                    this.interval = setInterval(this.doInterval, 1000);
                }
            },
            stop: function() {
                this.secondsToGo = 0;
                this.startedAt = 0;
                this.reset = 0;
                clearInterval(this.interval);
            },
            doInterval: function() {
                if(this.reset > 0) {
                    this.reset -= 1;
                } 
                this.secondsToGo = Math.round(
                    this.config.time - (getNowInSeconds() - this.startedAt)
                );
                if(this.secondsToGo <= 0) {
                    this.stop();
                }             
            }
        },
        created () {
            if(this.startedAt > 0 && (this.config.time - (getNowInSeconds() - this.startedAt)) > 0) {
                this.doInterval();
                this.interval = setInterval(this.doInterval, 1000);
            }
        },
        template: `
            <li class="counter" v-bind:style="{ backgroundImage: 'url(images/' + config.img + ')' }" v-on:click="start">
                <div class="countdown" v-if="secondsToGo > 0" v-bind:class="{ reset: reset > 0 }">
                    {{ secondsToGo | timeInHours}}
                </div>
                <div class="countdown ready" v-if="secondsToGo <= 0">
                    READY
                </div>
            </li>
        `
    });

    var app = new Vue({
        el: "#app",
        data: {
            counters: COUNTERS
        }
    });

    /* register the serviceworker for our PWA*/
    window.addEventListener("load", function(e) {
        if("serviceWorker" in navigator) {
            try {
                navigator.serviceWorker.register("../sw.js");
            } catch (error) {
                console.error("serviceworker not registered", error);
            }
        }
    });

})();