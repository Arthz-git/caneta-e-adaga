<script setup lang="ts">
import { ref } from 'vue'
import { NLayout, NLayoutSider } from 'naive-ui'
import DashboardHeader from '@/components/DashboardHeader.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'

const colapsado = ref(false)
</script>

<template>
	<n-layout has-sider style="height: 100svh">
		<n-layout-sider
			bordered
			collapse-mode="width"
			:collapsed-width="0"
			:width="240"
			:collapsed="colapsado"
			:native-scrollbar="false"
			trigger-style="display: none"
		>
			<DashboardSidebar />
		</n-layout-sider>

		<div class="dashboard-main">
			<DashboardHeader @toggle-sidebar="colapsado = !colapsado" />

			<div class="dashboard-main__content">
				<router-view />
			</div>
		</div>
	</n-layout>
</template>

<style scoped>
.dashboard-main {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-width: 0;
	min-height: 0;
}

.dashboard-main__content {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	padding: var(--space-page-y) var(--space-page-x);
}
</style>
