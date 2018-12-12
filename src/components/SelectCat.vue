<template>
	<v-list two-line>
		<template v-for="(catset, i) in catsetlist">
			<v-list-tile :key="i">
				<v-list-tile-content>
					<div class="cat-card">
						<div class="cat-set-middle">
							<template v-for="(cat, index) in catset.catlist">
								<v-chip :key="index" label outline color="blue"><v-checkbox v-model="cat.selection"></v-checkbox><span>{{ cat.name }}</span></v-chip>
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
	export default {
		name: "SelectCat",
		data() {
			return {
				catsetlist: [
					{
						name: "ENTITY-SUB-1",
						parent: "ENTITY",
						catlist: [
							{
								name: "ABSTRACT",
								selection: false
							},
							{
								name: "REAL",
								selection: false
							}
						]
					},
					{
						name: "ENTITY-SUB-2",
						parent: "ENTITY",
						catlist: [
							{
								name: "INDIVIDUAL",
								selection: false
							},
							{
								name: "COLLECTIVE",
								selection: false
							}
						]
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
