<template>
	<v-list two-line>
		<template v-for="(kt, i) in ktlist">
			<v-list-tile :key="i">
				<v-list-tile-content>
					<div class="kt-card">
						<div class="kt-set-middle">
							<v-chip color="light-blue lighten-3"><v-checkbox v-model="kt.selection"></v-checkbox><span>{{ kt.name }}</span></v-chip>
						</div>
					</div>
				</v-list-tile-content>
			</v-list-tile>
		</template>
	</v-list>
</template>

<script>
	export default {
		name: "SelectKT",
		data() {
			return {
				ktlist: [
					{
						name: "SOCIAL_PLACE",
						selection: false
					},
					{
						name: "TEST1",
						selection: false
					}
				]
			}
		}
	}
</script>

<style>
	.kt-card {
		text-align: left;
		width: 100%;
	}

	.kt-set-middle {
		display: inline-block;	
	}

	.parent-text {
		font-size: 0.8em
	}
</style>
