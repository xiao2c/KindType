<!-- Not used -->
<template>
	<div class="cat-card">
		<div class="cat-set-middle">
			<template v-for="(cat, index) in catlist">
				<v-chip :key="index" label outline color="blue"><v-checkbox></v-checkbox><span>{{ cat.name }}</span></v-chip>
			</template>
		</div>
		<div class="cat-set">
			<v-icon>arrow_drop_up</v-icon><span class="parent-text">{{ parent }}</span>
			<br>
			<v-icon>arrow_drop_down</v-icon>
		</div>
	</div>	
</template>

<script>
	export default {
		name: "KCatSet",
		data() {
			return {
				parent: "ENTITY",
				catlist: [{
						name: "ABSTRACT",
						selection: false
					},
					{
						name: "REAL",
						selection: false
					}
				]
			}
		}
	}
</script>

<style>
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