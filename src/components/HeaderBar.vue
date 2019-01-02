<template>
<v-toolbar dense>
    <v-icon @click="toHome">home</v-icon>

    <v-toolbar-title>{{barHeader}}</v-toolbar-title>

    <v-spacer></v-spacer>

    <span>{{info}}</span>
	<v-btn to="/SelectKT" v-if="showKtButton">Show Kind Types</v-btn>
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
			info: '',
			showKtButton: false
        }
    },
    created() {
        BUS.$on('sessionChanged', () => {
            this.barHeader = BUS.session.pageTitle;
			this.info = BUS.session.barInfo;
			this.showKtButton = BUS.session.barKtButton;
        });
    }
}
</script>
