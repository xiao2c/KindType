<template>
<v-list two-line>
    <template v-for="(catset, i) in catsetlist">
        <v-list-tile :key="i">
            <v-list-tile-content>
                <div class="cat-card">
                    <div class="cat-set-middle">
                        <template v-for="(cat, index) in catset.catlist">
                            <v-chip :key="index" label outline color="blue">
                                <input type="checkbox" v-model="selectedCats" :value="cat.name" @click="boxChecked(cat.name, $event)" @change="boxChanged()" />&nbsp;<span>{{ cat.name }}</span>

                            </v-chip>
                        </template>
                    </div>
                    <div class="cat-set">
                        <v-icon>arrow_drop_up</v-icon><span class="parent-text">{{ catset.parent }}</span>
                        <br>
                        <v-icon>arrow_drop_down</v-icon>
                    </div>
                </div>
            </v-list-tile-content>
        </v-list-tile>
        <v-divider v-if="i + 1 < catsetlist.length" :key="`divider-${i}`"></v-divider>
    </template>
</v-list>
</template>

<script>
import {
    BUS
} from "@/main";
import axios from "axios";

const ax = axios.create({
    baseURL: "http://localhost:1337/parse/",
    timeout: 8000,
    headers: {
        "X-Parse-Application-Id": "myapp",
        "X-Parse-Master-Key": "mymasterkey",
        "Content-Type": "application/json"
    }
});

export default {
    name: "SelectCat",
    computed: {
        vSelectedCats() {
            return true;
        }
    },
    methods: {
		boxChanged() {
            BUS.session.barInfo = "Selected Categorie(s): " + this.selectedCats;
            BUS.updateSession();
		},
        boxChecked(category, e) {
            this.expandCatSet(category);

            return true;
        },
        upClicked(category) {

        },
        downClicked(category) {

        },
        async expandCatSet(category) {
            console.log(category);
            // lookup the category in catsetlist
            var c = null;
            var cIndex = -1;
            var found = false;
            for (let i = 0; !found && i < this.catsetlist.length; i++) {
                let s = this.catsetlist[i];
                for (let j = 0; j < s.catlist.length; j++) {
                    let t = s.catlist[j];
                    if (t.name === category) {
                        found = true;
                        c = t;
                        cIndex = i;
                        break;
                    }
                }
            }

            if (c != null) {
                if (c.children === null || c.children.length <= 0) {

                } else {
                    // console.log("FOUND: " + JSON.stringify(c));
                    let newsetList = [];
                    for (let i = 0; i < c.children.length; i++) {
                        let catSet = c.children[i];
                        let whereStr = JSON.stringify({
                            name: {
                                "$in": catSet
                            }
                        });
                        // call api to get category detail
                        let newset = await this.syncRequest(category, whereStr);
                        newsetList.push(newset);
                    }
                    // console.log(cIndex + " newsetList = " + JSON.stringify(newsetList));
                    for (var i = 0; i < newsetList.length; i++) {
                        this.catsetlist.splice(cIndex, 0, newsetList[i]);
                    }
                    this.catsetlist.splice(cIndex + i, 1);
                    console.log("new set list : " + JSON.stringify(this.catsetlist));
                    this.$forceUpdate();
                }
            }
        },
        syncRequest(category, whereStr) {
            return ax.get("classes/category", {
                    params: {
                        where: whereStr,
                        limit: 10000
                    }
                })
                .then(response => {
                    let newset = {
                        parent: category,
                        catlist: response.data.results
                    };
                    // console.log("newset : " + JSON.stringify(newset));
                    return newset;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    },
    data() {
        return {
            selectedCats: [],
            catsetlist: []
        }
    },
    created() {
        BUS.session.pageTitle = "Instance: " + BUS.session.currentInstance;
        BUS.updateSession();

        // Get the default start category ENTITY
        ax.get("classes/category", {
                params: {
                    where: "{\"name\":\"ENTITY\"}",
                    limit: 10000
                }
            })
            .then(response => {
                this.catsetlist = [{
                    parent: "",
                    catlist: response.data.results
                }];
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }
}
</script>

<style scoped>
.cat-card {
    text-align: left;
    width: 100%;
}

.cat-set-middle {
    display: inline-block;
    top: 50%;
    transform: translateY(-35%);
    -ms-transform: translateY(-35%);
    -moz-transform: translateY(-35%);
    -webkit-transform: translateY(-35%);
    -o-transform: translateY(-35%);
}

.cat-set {
    display: inline-block;
}

.parent-text {
    font-size: 0.8em
}
</style>
