<template>
<v-card>
    <v-card-title>Select An Instance to Start
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="instances" :search="search">
        <template slot="items" slot-scope="props">
            <tr :active="props.selected" @click="props.selected = !props.selected">
                <td>
                    <v-checkbox primary hide-details v-model="selectedIns" :value="props.item.instance"></v-checkbox>
                </td>
                <td>{{ props.item.instance }}</td>
            </tr>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">Your search for "{{ search }}" found no results.</v-alert>
    </v-data-table>
    <v-toolbar dense>
        <v-spacer></v-spacer>{{ selectedIns }}
        <v-btn icon @click="goNext">
            <v-icon>send</v-icon>
        </v-btn>
    </v-toolbar>
</v-card>
</template>

<script>
import {
    BUS
} from "@/main";
import axios from "axios";
import Router from '@/router/index';

export default {
    name: "Home",
    methods: {
        goNext() {
            BUS.session.currentInstance = this.selectedIns;
            Router.push("/SelectCat");
        }
    },
    data() {
        return {
            pagination: {
                sortBy: "instance"
            },
            selectedIns: "-",
            search: "",
            headers: [{
                    text: "Select",
                    sortable: false
                },
                {
                    text: "Instance",
                    align: "center",
                    value: "instance"
                }
            ],
            instances: []
        };
    },
    created() {
        BUS.session.pageTitle = "Home";
        BUS.session.currentInstance = null;
        BUS.updateSession();

        // load instance list from database
        const ax = axios.create({
            baseURL: "http://localhost:1337/parse/",
            timeout: 8000,
            headers: {
                "X-Parse-Application-Id": "myapp",
                "X-Parse-Master-Key": "mymasterkey",
                "Content-Type": "application/json"
            }
        });

        ax.get("classes/instance", {
                params: {
                    keys: "name,kind_type",
                    limit: 10000
                }
            })
            .then(response => {
                // console.log(response.data.results);
                const newlist = [];
                for (var i = 0; i < response.data.results.length; i++) {
                    newlist.push({
                        "instance": response.data.results[i].name,
                        "value": false
                    });
                }
                this.instances = newlist;
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }
};
</script>
