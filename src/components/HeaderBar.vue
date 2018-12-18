<template>
<v-toolbar dense>
    <v-icon @click="toHome">home</v-icon>

    <v-toolbar-title>{{barHeader}}</v-toolbar-title>

    <v-spacer></v-spacer>

    <span>{{info}}</span>
</v-toolbar>
</template>

<script>
import {
    BUS
} from '@/main'
import Router from '@/router/index'

export default {
    name: "HeaderBar",
    methods: {
        toHome() {
            Router.push('/');
        }
    },
    data() {
        return {
            title: 'this is headerbar',
            barHeader: '',
            info: ''
        }
    },
    created() {
        BUS.$on('sessionChanged', () => {
            this.barHeader = BUS.session.pageTitle;
            this.info = BUS.session.barInfo;
        });
    }
}
</script>
